import React from 'react';
import { motion } from 'framer-motion';

const TechSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50" id="tech-section">
      <div className="container mx-auto px-4">
        {/* 메인 타이틀 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-scdream font-bold text-text mb-4">
            Riding Ground <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-purple to-indigo-600">Technology</span>
          </h2>
          <p className="text-xl font-medium text-text">멀티모달 감정 인식 기반 AI 추천 시스템</p>
          
          {/* 서브타이틀 */}
          <p className="mt-6 text-lg text-gray-lighter max-w-4xl mx-auto">
            다양한 감정 표현을 이해하고, 사용자에게 맞는 라이딩 코스를 실시간으로 추천하는 감성 기반 AI 플랫폼입니다.
          </p>
        </motion.div>
        
        {/* 시스템 구성 3요소 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* 1. 감정 인식 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border border-mint/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.2 } }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-mint to-teal-400"></div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center text-mint mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text">Emotion Recognition</h3>
            </div>
            <p className="text-gray-lighter mb-3">텍스트, 이모지, 사진, 음악 등 다양한 입력값을 분석</p>
            <p className="text-gray-lighter">KoBERT, CLIP 기반의 감정 추론 알고리즘 적용</p>
          </motion.div>
          
          {/* 2. 감정-장소 매핑 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border border-pink/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.2 } }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink to-rose-400"></div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-pink/20 flex items-center justify-center text-pink mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text">Emotion-Place Mapping</h3>
            </div>
            <p className="text-gray-lighter mb-3">SNS 리뷰, 후기, 위치 데이터를 감정 태그와 연결</p>
            <p className="text-gray-lighter">자전거 코스별로 '고요함', '설렘', '위로' 등 정서 데이터 학습</p>
          </motion.div>
          
          {/* 3. AI 추천 엔진 */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border border-purple/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", transition: { duration: 0.2 } }}
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple to-indigo-600"></div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple/20 flex items-center justify-center text-purple mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text">AI Recommendation Engine</h3>
            </div>
            <p className="text-gray-lighter mb-3">사용자의 감정 + 위치 + 시간대 + 날씨를 종합 분석</p>
            <p className="text-gray-lighter">협업 필터링 기반의 정서 맞춤형 라이딩 코스 추천</p>
          </motion.div>
        </div>
        
        {/* 기술 흐름도 - 유리모피즘 스타일로 변경 */}
        <motion.div 
          className="relative py-10 px-6 md:px-14 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg mb-14 border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)' }}
        >
          {/* 배경 효과 - 기술적 느낌의 그리드 패턴 */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-5">
            <div className="w-full h-full bg-grid-pattern"></div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            {/* 입력 - 아이콘 개선 */}
            <div className="text-center mb-8 md:mb-0">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-mint/40 to-teal-300/40 flex items-center justify-center mx-auto mb-2 shadow-lg border border-mint/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                animate={{ rotateY: [0, 360] }}
                transition={{ rotateY: { repeat: Infinity, duration: 6, ease: "linear" }, scale: { duration: 0.2 } }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2 2 4-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 3v4M14 3v4" />
                </svg>
              </motion.div>
              <h4 className="font-medium text-sm text-text mb-1">Input</h4>
              <p className="text-xs text-gray-lighter">텍스트, 이모지, 사진</p>
              
              {/* 기술 스택 배지 */}
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-2 py-0.5 bg-mint/10 text-mint text-[10px] rounded-full border border-mint/20">NLP</span>
                <span className="px-2 py-0.5 bg-teal-400/10 text-teal-600 text-[10px] rounded-full border border-teal-400/20">CV</span>
              </div>
            </div>
            
            {/* 화살표 */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-mint to-pink relative">
              <motion.div 
                className="absolute top-0 left-0 w-full h-full"
                animate={{ 
                  background: ["linear-gradient(90deg, #4FD1C5 0%, #4FD1C5 0%, #F8B4C2 100%)", 
                               "linear-gradient(90deg, #4FD1C5 0%, #F8B4C2 50%, #F8B4C2 100%)",
                               "linear-gradient(90deg, #4FD1C5 0%, #F8B4C2 100%, #F8B4C2 100%)"] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute -right-1 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-pink transform rotate-45"></div>
            </div>
            
            {/* 감정분석 - 아이콘 개선 */}
            <div className="text-center mb-8 md:mb-0">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-pink/40 to-rose-300/40 flex items-center justify-center mx-auto mb-2 shadow-lg border border-pink/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(248,180,194,0.2)",
                    "0 0 0 10px rgba(248,180,194,0)",
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </motion.div>
              <h4 className="font-medium text-sm text-text mb-1">Analysis</h4>
              <p className="text-xs text-gray-lighter">AI 모델 처리</p>
              
              {/* 기술 스택 배지 */}
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-2 py-0.5 bg-pink/10 text-pink text-[10px] rounded-full border border-pink/20">TensorFlow</span>
                <span className="px-2 py-0.5 bg-rose-400/10 text-rose-600 text-[10px] rounded-full border border-rose-400/20">BERT</span>
              </div>
            </div>
            
            {/* 화살표 */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-pink to-purple-light relative">
              <motion.div 
                className="absolute top-0 left-0 w-full h-full"
                animate={{ 
                  background: ["linear-gradient(90deg, #F8B4C2 0%, #F8B4C2 0%, #BAB0F9 100%)", 
                               "linear-gradient(90deg, #F8B4C2 0%, #BAB0F9 50%, #BAB0F9 100%)",
                               "linear-gradient(90deg, #F8B4C2 0%, #BAB0F9 100%, #BAB0F9 100%)"] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute -right-1 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-purple-light transform rotate-45"></div>
            </div>
            
            {/* 맞춤 매핑 - 아이콘 개선 */}
            <div className="text-center mb-8 md:mb-0">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-light/40 to-violet-300/40 flex items-center justify-center mx-auto mb-2 shadow-lg border border-purple-light/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ rotate: { repeat: Infinity, duration: 2, ease: "easeInOut" }, scale: { duration: 0.2 } }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </motion.div>
              <h4 className="font-medium text-sm text-text mb-1">Mapping</h4>
              <p className="text-xs text-gray-lighter">지역별 감정 데이터</p>
              
              {/* 기술 스택 배지 */}
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-2 py-0.5 bg-purple-light/10 text-purple-light text-[10px] rounded-full border border-purple-light/20">GraphQL</span>
                <span className="px-2 py-0.5 bg-violet-400/10 text-violet-600 text-[10px] rounded-full border border-violet-400/20">GIS</span>
              </div>
            </div>
            
            {/* 화살표 */}
            <div className="hidden md:block w-16 h-px bg-gradient-to-r from-purple-light to-purple relative">
              <motion.div 
                className="absolute top-0 left-0 w-full h-full"
                animate={{ 
                  background: ["linear-gradient(90deg, #BAB0F9 0%, #BAB0F9 0%, #8572FF 100%)", 
                               "linear-gradient(90deg, #BAB0F9 0%, #8572FF 50%, #8572FF 100%)",
                               "linear-gradient(90deg, #BAB0F9 0%, #8572FF 100%, #8572FF 100%)"] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="absolute -right-1 -top-1.5 w-3 h-3 border-t-2 border-r-2 border-purple transform rotate-45"></div>
            </div>
            
            {/* 코스 추천 - 아이콘 개선 */}
            <div className="text-center">
              <motion.div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple/40 to-indigo-400/40 flex items-center justify-center mx-auto mb-2 shadow-lg border border-purple/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(133,114,255,0.2)",
                    "0 0 0 10px rgba(133,114,255,0)",
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <h4 className="font-medium text-sm text-text mb-1">Recommendation</h4>
              <p className="text-xs text-gray-lighter">맞춤형 라이딩 루트</p>
              
              {/* 기술 스택 배지 */}
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-2 py-0.5 bg-purple/10 text-purple text-[10px] rounded-full border border-purple/20">ML</span>
                <span className="px-2 py-0.5 bg-indigo-400/10 text-indigo-600 text-[10px] rounded-full border border-indigo-400/20">Rec.Sys</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 기대 효과 / 확장성 - 한글로 변경 */}
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple to-indigo-600 font-medium leading-relaxed">
            라이딩 그라운드의 AI는 시간이 지날수록 사용자의 감정 패턴을 학습하며,<br />
            더 개인화된 감성 웰니스 경험을 제공합니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TechSection; 