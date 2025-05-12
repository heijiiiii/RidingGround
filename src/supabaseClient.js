import { createClient } from '@supabase/supabase-js'

// .htaccess에 설정된 Supabase 연결 정보
const SUPABASE_URL = "https://stvccensiwrzvgwhnfnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E";

// 환경 변수나 window.ENV_VARS가 있으면 우선 사용, 없으면 기본값 사용
const supabaseUrl = typeof window !== 'undefined' && window.ENV_VARS && window.ENV_VARS.NEXT_PUBLIC_SUPABASE_URL 
  ? window.ENV_VARS.NEXT_PUBLIC_SUPABASE_URL 
  : SUPABASE_URL;

const supabaseAnonKey = typeof window !== 'undefined' && window.ENV_VARS && window.ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  ? window.ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  : SUPABASE_ANON_KEY;

// 연결 정보 로깅
console.log("Supabase 연결 시도:", supabaseUrl);

// supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 연결 확인
supabase.auth.getSession()
  .then(() => console.log("Supabase 연결 성공"))
  .catch(error => console.error("Supabase 연결 오류:", error)); 