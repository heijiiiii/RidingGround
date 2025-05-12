import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = 'https://stvccensiwrzvgwhnfnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmotionsTable() {
  try {
    console.log('emotions 테이블 조회 중...');
    
    // emotions 테이블 조회
    const { data, error } = await supabase
      .from('emotions')
      .select('*');
    
    if (error) {
      console.error('emotions 테이블 조회 오류:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('emotions 테이블 구조:');
      console.log(Object.keys(data[0]));
      
      console.log('\nemotions 테이블 데이터:');
      data.forEach(emotion => {
        console.log(`ID: ${emotion.id}, 이름(한국어): ${emotion.name_kr}, 이름(영어): ${emotion.name_en}, 색상: ${emotion.color}, 이모지: ${emotion.emoji}`);
      });
      
      // UUID 매핑 작성 예시 표시 (name_kr 기준)
      console.log('\n감정 매핑 테이블 예시 (name_kr 기준):');
      console.log('const emotionToIdMap = {');
      data.forEach(emotion => {
        if (emotion.name_kr) {
          console.log(`  '${emotion.name_kr}': '${emotion.id}',`);
        }
      });
      console.log('};');
      
      // CSV 파일의 감정값과 매칭하기 위한 참고 정보
      console.log('\nCSV 파일의 감정값 예시:');
      console.log('고요함, 기쁨, 리프레시, 설렘, 위로, 기타');
      
      // 감정별 ID 확인 (수동 매핑 생성을 위한 기초 자료)
      console.log('\n감정별 ID 확인:');
      for (const emotion of data) {
        console.log(`${emotion.name_kr || emotion.name_en || '미지정'}: ${emotion.id}`);
      }
    } else {
      console.log('emotions 테이블에 데이터가 없습니다.');
    }
    
  } catch (error) {
    console.error('실행 중 오류 발생:', error);
  }
}

// 스크립트 실행
checkEmotionsTable().catch(console.error); 