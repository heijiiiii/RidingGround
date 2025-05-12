import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 환경 변수를 window 객체에 할당
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  // 배포 환경에 따른 환경 변수 설정 방식 분리
  if (window.location.hostname.includes('vercel.app') || process.env.REACT_APP_DEPLOY_ENV === 'vercel') {
    // Vercel 환경용 - process.env 사용
    window.ENV_VARS = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
      KAKAO_MAP_API_KEY: process.env.REACT_APP_KAKAO_MAP_API_KEY || '',
      WEATHER_API_KEY: process.env.REACT_APP_WEATHER_API_KEY || '7f111eb21aaf2127ac1cccdd553e8ee0'
    };
  } else {
    // 닷홈 환경용 - window.ENV_VARS가 이미 설정되어 있을 수 있음
    window.ENV_VARS = window.ENV_VARS || {
      NEXT_PUBLIC_SUPABASE_URL: "https://stvccensiwrzvgwhnfnm.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E",
      KAKAO_MAP_API_KEY: "14f8f44a515998883eba13ef308e5bec",
      WEATHER_API_KEY: "7f111eb21aaf2127ac1cccdd553e8ee0"
    };
  }
  
  console.log("환경 변수 설정 완료:", window.location.hostname, "환경 감지");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 