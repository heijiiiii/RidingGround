import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = 'https://stvccensiwrzvgwhnfnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E';

const supabase = createClient(supabaseUrl, supabaseKey);

// 테이블 구조 확인
async function checkTableSchema() {
  try {
    console.log('Supabase emotion_courses 테이블 구조 확인 중...');
    
    // 테이블의 첫 번째 행을 조회하여 구조 확인
    const { data, error } = await supabase
      .from('emotion_courses')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('테이블 조회 오류:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('테이블 구조:');
      console.log(Object.keys(data[0]));
      
      // 각 필드 타입도 출력
      console.log('\n필드 타입:');
      const record = data[0];
      Object.entries(record).forEach(([key, value]) => {
        console.log(`${key}: ${typeof value}`);
      });
    } else {
      console.log('테이블에 데이터가 없어 구조를 확인할 수 없습니다.');
      
      // 대체 방법으로 RPC 호출
      console.log('\n테이블 정보 조회 시도 중...');
      
      // 처음 몇 개 레코드만 조회
      const { data: sampleData, error: sampleError } = await supabase
        .from('emotion_courses')
        .select('*')
        .limit(5);
      
      if (sampleError) {
        console.error('샘플 데이터 조회 오류:', sampleError);
      } else {
        console.log('샘플 데이터:', sampleData);
      }
    }
    
  } catch (error) {
    console.error('테이블 구조 확인 오류:', error);
  }
}

// 스크립트 실행
checkTableSchema().catch(console.error); 