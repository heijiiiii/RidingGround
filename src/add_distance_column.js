import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정
const supabaseUrl = 'https://stvccensiwrzvgwhnfnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E';

const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL 테이블에 distance_km 칼럼을 추가하는 함수
async function addDistanceColumn() {
  try {
    console.log('distance_km 칼럼 추가 시도 중...');
    
    // PostgreSQL RPC 함수를 사용하여 ALTER TABLE 쿼리 실행
    const { data, error } = await supabase.rpc('add_distance_column', {});
    
    if (error) {
      console.error('칼럼 추가 중 오류 발생:', error);
      
      // 대체 방법 시도: SQL 쿼리로 직접 실행
      console.log('대체 방법으로 SQL 쿼리 직접 실행 시도...');
      
      // REST API를 통해 SQL 쿼리 실행 (관리자 권한 필요)
      console.log('Supabase Studio에서 다음 SQL 쿼리를 실행해주세요:');
      console.log(`
      -- distance_km 칼럼이 없는 경우에만 추가
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
    
    console.log('distance_km 칼럼 추가 성공!');
    
    // 테이블 구조 확인
    const { data: tableData, error: tableError } = await supabase
      .from('emotion_courses')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('테이블 구조 확인 오류:', tableError);
      return;
    }
    
    if (tableData && tableData.length > 0) {
      console.log('업데이트된 테이블 구조:');
      console.log(Object.keys(tableData[0]));
    } else {
      console.log('테이블에 데이터가 없어 구조를 확인할 수 없습니다.');
    }
    
  } catch (error) {
    console.error('칼럼 추가 중 예외 발생:', error);
  }
}

// 스크립트 실행
addDistanceColumn().catch(console.error); 