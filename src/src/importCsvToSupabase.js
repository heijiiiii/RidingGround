import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// .htaccess 파일에 설정된 Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://stvccensiwrzvgwhnfnm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E';

console.log('Supabase URL:', supabaseUrl);
console.log('API 키 확인:', supabaseKey ? '설정됨' : '설정되지 않음');

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV 파일 경로
const csvFilePath = './DATASET/emotiondata_fixed.csv';

// 감정 매핑 테이블 (실제 UUID 값으로 업데이트)
const emotionToIdMap = {
  '설렘': 'a7d090e0-1818-476a-b38d-362c4ac038df',
  '위로': '2285968c-de48-4f7e-ae9e-5e1980c36e67',
  '고요함': '5c7dc60d-160c-4e24-be3d-7a05dcaa9031',
  '기쁨': '2180739c-f604-478a-ada8-229ae4741992',
  '리프레시': '3a37910c-1254-4a7e-bac7-1d32f344a7d3',
  '호기심': 'ba21dfc1-913e-4ea4-ad8b-56fcc7c8594f',
  '활력': '1461a884-2b53-44e0-a81f-818e6aa417d6',
  '평화': '5cde16c6-d1ce-4a60-ba4c-d8983071a7c0',
  // '기타' 감정이 없어서 평화로 대체
  '기타': '5cde16c6-d1ce-4a60-ba4c-d8983071a7c0'
};

// 테이블이 distance_km 칼럼을 포함하는지 확인
async function checkTableSchema() {
  const { data, error } = await supabase
    .from('emotion_courses')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('테이블 구조 확인 오류:', error);
    return false;
  }
  
  if (data && data.length > 0) {
    const columns = Object.keys(data[0]);
    return columns.includes('distance_km');
  }
  
  // 테이블에 데이터가 없는 경우
  console.log('테이블에 데이터가 없습니다. distance_km 칼럼이 있다고 가정합니다.');
  return true;
}

// 데이터 가져오기
async function importData() {
  try {
    console.log('CSV 데이터 로드 중...');
    
    // 테이블 구조 확인
    const hasDistanceColumn = await checkTableSchema();
    if (!hasDistanceColumn) {
      console.log('\n주의: "distance_km" 칼럼이 테이블에 없습니다.');
      console.log('Supabase Studio에서 다음 SQL 쿼리를 실행한 후 다시 시도하세요:');
      console.log(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'emotion_courses' AND column_name = 'distance_km'
        ) THEN
          ALTER TABLE emotion_courses ADD COLUMN distance_km DECIMAL;
        END IF;
      END $$;
      `);
      return;
    }
    
    // CSV 파일 읽기
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`총 ${records.length}개의 코스 데이터를 찾았습니다.`);
    
    // 배치 크기 (Supabase 한 번에 업로드할 수 있는 데이터 제한이 있을 수 있음)
    const batchSize = 50;
    const totalBatches = Math.ceil(records.length / batchSize);
    
    let successCount = 0;
    let errorCount = 0;
    
    // 배치 처리
    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, records.length);
      const batch = records.slice(start, end);
      
      // 데이터 변환 (테이블 구조에 맞게 필드 조정)
      const formattedData = batch.map(record => {
        // 감정값을 emotion_id로 변환 (매핑 테이블 사용)
        const emotionValue = record.emotion_refined || record.emotion;
        // UUID 형식의 emotion_id 값을 사용
        const emotionId = emotionToIdMap[emotionValue] || emotionToIdMap['기타'];
        
        // 거리 계산
        const distance = calculateDistance(
          parseFloat(record.lat_start), 
          parseFloat(record.lng_start), 
          parseFloat(record.lat_end), 
          parseFloat(record.lng_end)
        );
        
        return {
          route_name: record.노선명,
          city: record.시도명,
          district: record.시군구명,
          start_point: record['도로구간-기점'],
          end_point: record['도로구간-종점'],
          lat_start: parseFloat(record.lat_start),
          lng_start: parseFloat(record.lng_start),
          lat_end: parseFloat(record.lat_end),
          lng_end: parseFloat(record.lng_end),
          emotion_id: emotionId, // UUID 형식 사용
          distance_km: distance
        };
      });
      
      console.log(`배치 ${i+1}/${totalBatches} 처리 중... (${start+1}-${end})`);
      
      // Supabase에 데이터 업로드
      const { data, error } = await supabase
        .from('emotion_courses')
        .upsert(formattedData, { 
          onConflict: 'route_name, start_point, end_point',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`배치 ${i+1} 업로드 오류:`, error);
        errorCount += batch.length;
      } else {
        console.log(`배치 ${i+1} 성공적으로 업로드됨`);
        successCount += batch.length;
      }
      
      // 너무 빠른 요청으로 인한 API 제한을 방지하기 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n데이터 가져오기 완료: 총 ${records.length}개 중 ${successCount}개 성공, ${errorCount}개 실패`);
    
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
  }
}

// 두 지점 간의 거리를 계산하는 함수 (Haversine 공식)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구 반경 (km)
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2); 
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // 킬로미터 단위 거리
  
  return parseFloat(distance.toFixed(2));
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// 스크립트 실행
importData().catch(console.error); 