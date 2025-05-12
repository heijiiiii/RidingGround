<?php
// 서버 환경 변수를 JavaScript 객체로 내보내기
header('Content-Type: application/javascript');

// 환경 변수가 설정되지 않았을 경우 기본값 사용
$supabase_url = getenv("NEXT_PUBLIC_SUPABASE_URL") ?: "https://stvccensiwrzvgwhnfnm.supabase.co";
$supabase_key = getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ?: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E";
$kakao_map_key = getenv("KAKAO_MAP_API_KEY") ?: "14f8f44a515998883eba13ef308e5bec";
$weather_key = getenv("WEATHER_API_KEY") ?: "7f111eb21aaf2127ac1cccdd553e8ee0";
?>

window.ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: '<?php echo $supabase_url; ?>',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: '<?php echo $supabase_key; ?>',
  KAKAO_MAP_API_KEY: '<?php echo $kakao_map_key; ?>',
  WEATHER_API_KEY: '<?php echo $weather_key; ?>'
}; 