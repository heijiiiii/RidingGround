import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 환경 변수를 window 객체에 할당
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  window.ENV_VARS = {
    NEXT_PUBLIC_SUPABASE_URL: '<?php echo $_ENV["NEXT_PUBLIC_SUPABASE_URL"]; ?>',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '<?php echo $_ENV["NEXT_PUBLIC_SUPABASE_ANON_KEY"]; ?>',
    KAKAO_MAP_API_KEY: '<?php echo $_ENV["KAKAO_MAP_API_KEY"]; ?>',
    WEATHER_API_KEY: '<?php echo $_ENV["WEATHER_API_KEY"]; ?>'
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 