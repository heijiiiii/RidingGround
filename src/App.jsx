import React, { useState, useEffect } from 'react';
import './App.css';
import IntroSection from './components/IntroSection';
import EmotionInputSection from './components/EmotionInputSection';
import EmotionMapSection from './components/EmotionMapSection';
import EmotionHistorySection from './components/EmotionHistorySection';
import TechSection from './components/TechSection';

function App() {
  // 선택된 감정 상태를 App 컴포넌트에서 관리하여 컴포넌트 간 공유
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  
  // 감정 선택 처리 함수
  const handleEmotionSelect = (emotions) => {
    setSelectedEmotions(emotions);
    console.log("App에서 선택된 감정:", emotions);
  };

  useEffect(() => {
    // 환경 변수 로깅
    console.log('환경 변수 확인:');
    if (window.ENV_VARS) {
      console.log('WEATHER_API_KEY 설정됨:', !!window.ENV_VARS.WEATHER_API_KEY);
      console.log('KAKAO_MAP_API_KEY 설정됨:', !!window.ENV_VARS.KAKAO_MAP_API_KEY);
      console.log('SUPABASE URL 설정됨:', !!window.ENV_VARS.NEXT_PUBLIC_SUPABASE_URL);
    } else {
      console.warn('window.ENV_VARS가 설정되지 않았습니다.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-text">
            <span className="text-purple">R</span>iding Ground
          </div>
          <nav className="flex gap-10 justify-end">
            <a href="#intro" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">서비스 소개</a>
            <a href="#tech" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">기술 소개</a>
            <a href="#emotion" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">감정 입력</a>
            <a href="#courses" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">자전거 코스</a>
            <a href="#history" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">히스토리</a>
            <a href="#community" className="text-gray-lighter hover:text-purple uppercase text-sm font-medium tracking-wide">커뮤니티</a>
          </nav>
        </div>
      </header>

      <main className="overflow-hidden">
        <div id="intro"><IntroSection /></div>
        <div id="tech"><TechSection /></div>
        <div id="emotion"><EmotionInputSection 
          selectedEmotions={selectedEmotions} 
          onEmotionSelect={handleEmotionSelect} 
        /></div>
        <div id="courses"><EmotionMapSection selectedEmotions={selectedEmotions} /></div>
        <div id="history"><EmotionHistorySection /></div>
      </main>
    </div>
  );
}

export default App; 