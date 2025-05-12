import React from 'react';
import { motion } from 'framer-motion';

const IntroSection = () => {
  // 버튼 클릭 시 감정 입력 섹션으로 스크롤 처리하는 함수
  const handleScrollToEmotion = () => {
    const emotionSection = document.getElementById('emotion');
    if (emotionSection) {
      emotionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* 왼쪽 텍스트 영역 */}
          <div className="w-full md:w-1/2 pr-0 md:pr-12 mb-12 md:mb-0">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="font-scdream font-medium text-text block">오늘 기분, </span>
              <span className="font-scdream font-light text-purple block">어디로 향하고 있나요?</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-lighter mb-6 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              감정을 따라 달리는 자전거길, 라이딩 그라운드는 
              <br />당신의 감정에 맞는 최적의 자전거 코스를 추천합니다.
            </motion.p>
            
            <motion.div 
              className="bg-gradient-to-r from-purple/5 to-purple-light/5 rounded-xl p-6 mb-8 border-l-4 border-purple shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-3">
                <span className="text-xl mr-2">✨</span>
                <h3 className="text-purple font-medium text-lg">감정을 읽고, 연결하는 AI 큐레이터</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                <span className="font-medium text-purple-light">《Riding Ground》</span>는 텍스트, 음악, 이미지, 이모지 등 다양한 감정 신호를 멀티모달 AI가 분석하여,
                <br />사용자 감정에 맞는 자전거 코스를 추천합니다.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mt-2">
                단순 길 찾기 서비스가 아니라, 감정 흐름 기반 웰니스 경험을 설계하는 AI 감성 코치입니다.
              </p>
              <div className="mt-3 text-xs text-right text-gray-500 italic">
                (BERT, CLIP, 감성 태깅 기반 다중 감정 추론 알고리즘 적용)
              </div>
            </motion.div>

            <motion.button 
              className="mt-4 bg-purple hover:bg-purple/90 text-white px-8 py-4 rounded-full text-sm font-medium transition-colors inline-flex items-center shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              onClick={handleScrollToEmotion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              시작하기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
          
          {/* 오른쪽 자전거 이미지 */}
          <div className="w-full md:w-1/2 relative">
            <motion.div
              className="relative h-[400px] md:h-[500px] flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="relative">
                <img 
                  src="/RidingGround/bike.png" 
                  alt="자전거 이미지" 
                  className="object-contain max-h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection; 