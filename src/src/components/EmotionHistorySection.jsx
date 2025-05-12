import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaQuoteLeft, FaBiking, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const EmotionHistorySection = () => {
  // 월 선택 상태
  const [selectedMonth, setSelectedMonth] = useState(3); // 0: 1월, 1: 2월, 2: 3월, 3: 4월(현재)
  
  // 월별 데이터
  const months = [
    { id: 0, label: '1월' },
    { id: 1, label: '2월' },
    { id: 2, label: '3월' },
    { id: 3, label: '4월' },
  ];

  // 감정 데이터
  const emotions = [
    { id: 'calm', label: '고요함', color: 'bg-mint', textColor: 'text-mint', emoji: '😌' },
    { id: 'excitement', label: '설렘', color: 'bg-pink', textColor: 'text-pink', emoji: '😍' },
    { id: 'comfort', label: '위로', color: 'bg-purple', textColor: 'text-purple', emoji: '🤗' },
    { id: 'joy', label: '기쁨', color: 'bg-purple-light', textColor: 'text-purple-light', emoji: '😊' },
    { id: 'refresh', label: '리프레시', color: 'bg-green-500', textColor: 'text-green-500', emoji: '😎' },
  ];

  // 감정 기록 데이터 - 월별 감정 그래프를 위한 데이터
  const monthlyEmotionData = [
    // 1월 
    [
      { day: 5, emotion: 'calm' },
      { day: 12, emotion: 'joy' },
      { day: 19, emotion: 'comfort' },
      { day: 26, emotion: 'refresh' },
    ],
    // 2월
    [
      { day: 2, emotion: 'excitement' },
      { day: 9, emotion: 'calm' },
      { day: 16, emotion: 'comfort' },
      { day: 23, emotion: 'joy' },
    ],
    // 3월
    [
      { day: 1, emotion: 'joy' },
      { day: 8, emotion: 'refresh' },
      { day: 15, emotion: 'excitement' },
      { day: 22, emotion: 'calm' },
      { day: 29, emotion: 'comfort' },
    ],
    // 4월
    [
      { day: 5, emotion: 'comfort' },
      { day: 12, emotion: 'excitement' },
      { day: 19, emotion: 'refresh' },
      { day: 26, emotion: 'joy' },
    ],
  ];

  // 감정 일기 카드 데이터
  const diaryEntries = [
    {
      id: 1,
      date: '2023.04.26',
      emotion: 'joy',
      route: '한강 봄꽃길',
      content: '오랜만에 나온 햇살을 온몸으로 맞으며 달렸다. 벚꽃과 유채꽃이 내 기분을 한껏 밝게 해주었다. 오늘은 정말 좋은 날이었다.',
    },
    {
      id: 2,
      date: '2023.04.19',
      emotion: 'refresh',
      route: '북한산 둘레길',
      content: '지친 마음을 달래고자 산 속으로 라이딩을 떠났다. 시원한 바람과 맑은 공기가 머리를 정화시켜 주었다. 다시 활력이 생겼다.',
    },
    {
      id: 3,
      date: '2023.04.12',
      emotion: 'excitement',
      route: '남산 야경 코스',
      content: '저녁에 남산 달리기는 늘 설렌다. 반짝이는 도시의 불빛들을 내려다보며 달리는 기분이란... 내일도 또 오고 싶은 코스.',
    },
  ];

  // 감정 컬러 가져오기
  const getEmotionColor = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.color : 'bg-gray-300';
  };

  // 감정 텍스트 컬러 가져오기
  const getEmotionTextColor = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.textColor : 'text-gray-500';
  };

  // 감정 이모지 가져오기
  const getEmotionEmoji = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.emoji : '😐';
  };

  // 감정 레이블 가져오기
  const getEmotionLabel = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.label : '';
  };

  // 감정 그래프 포인트 위치 계산 (30일 기준)
  const calculatePointPosition = (day) => {
    return (day / 30) * 100;
  };

  // 감정의 Y축 위치 계산 함수
  const getEmotionYPosition = (emotion) => {
    const emotionIndex = emotions.findIndex(e => e.id === emotion);
    return 15 - (emotionIndex * 3);
  };

  return (
    <section className="py-16 bg-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-scdream text-text mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            내 감정 라이딩 히스토리
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-lighter max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            지난 4개월간의 감정 변화와 라이딩 기록을 확인해보세요
          </motion.p>
        </div>

        {/* 월 선택 탭 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 inline-flex">
            {months.map((month) => (
              <button
                key={month.id}
                className={`px-6 py-2 rounded-full text-sm md:text-base transition ${
                  selectedMonth === month.id
                    ? 'bg-purple text-white'
                    : 'hover:bg-purple/10 text-gray-700'
                }`}
                onClick={() => setSelectedMonth(month.id)}
              >
                {month.label}
              </button>
            ))}
          </div>
        </div>

        {/* 감정 그래프 */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg md:text-xl font-semibold text-text mb-8 flex items-center font-scdream">
            <FaCalendarAlt className="mr-2 text-purple" /> 
            {months[selectedMonth].label} 감정 흐름
          </h3>
          
          {/* 그래프 바 & 포인트 */}
          <div className="relative h-72 overflow-hidden">
            {/* 선형 그래프 가로 선 (배경) */}
            <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-1/2 transform -translate-y-1/2 w-full"></div>
            
            {/* 레전드 텍스트 (왼쪽) */}
            <div className="absolute left-0 top-0 flex flex-wrap items-center gap-3 py-2 text-xs text-gray-500">
              {emotions.map((emotion, idx) => (
                <div key={`legend-${emotion.id}`} className="flex items-center">
                  <div className={`w-2 h-2 ${emotion.color} rounded-full mr-1`}></div>
                  <span className="whitespace-nowrap">{emotion.label}</span>
                </div>
              ))}
            </div>
            
            {/* 꺾은선 그래프 선 그리기 */}
            {monthlyEmotionData[selectedMonth].length > 1 && (
              <svg 
                className="absolute w-full h-48" 
                style={{ top: '50%', transform: 'translateY(-45%)', left: '8%', width: '84%' }}
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
              >
                {/* 그래프 배경 */}
                <rect x="0" y="0" width="100" height="60" fill="#fafafa" rx="3" ry="3" />
                
                {/* 배경 그리드 라인 */}
                {[0, 1, 2, 3, 4].map((line) => (
                  <line 
                    key={`grid-${line}`}
                    x1="0" 
                    y1={12 + line * 9} 
                    x2="100" 
                    y2={12 + line * 9} 
                    stroke="#e5e7eb" 
                    strokeWidth="0.05" 
                    strokeDasharray="1,1"
                  />
                ))}
                
                {/* 날짜 눈금 (하단) */}
                {[1, 8, 15, 22, 29].map((day) => (
                  <g key={`day-${day}`}>
                    <line 
                      x1={calculatePointPosition(day)} 
                      y1="0" 
                      x2={calculatePointPosition(day)} 
                      y2="60" 
                      stroke="#e5e7eb" 
                      strokeWidth="0.05" 
                      strokeDasharray="1,1"
                    />
                  </g>
                ))}
                
                {/* 메인 꺾은선 그래프 */}
                <polyline 
                  points={monthlyEmotionData[selectedMonth].map(entry => {
                    const y = getEmotionYPosition(entry.emotion) * 2;
                    return `${calculatePointPosition(entry.day)} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8572FF"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* 그래프 점 */}
                {monthlyEmotionData[selectedMonth].map((entry, index) => {
                  const y = getEmotionYPosition(entry.emotion) * 2;
                  const x = calculatePointPosition(entry.day);
                  
                  // 임시 색상 매핑
                  const colorMap = {
                    'calm': '#B4D8D6',
                    'excitement': '#EA7C97',
                    'comfort': '#8572FF',
                    'joy': '#BAB0F9',
                    'refresh': '#22C55E'
                  };
                  
                  return (
                    <g key={`point-${index}`}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="1.5" 
                        fill={colorMap[entry.emotion] || '#8572FF'} 
                        stroke="#ffffff" 
                        strokeWidth="0.3"
                      />
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="0.5" 
                        fill="#ffffff"
                      />
                    </g>
                  );
                })}
              </svg>
            )}
            
            {/* 하단 날짜 표시 */}
            <div className="absolute bottom-0 left-[8%] right-[8%] text-xs text-gray-400 flex justify-between px-2">
              <span>1일</span>
              <span>8일</span>
              <span>15일</span>
              <span>22일</span>
              <span>29일</span>
            </div>
          </div>
        </motion.div>

        {/* 감정 일기 카드 */}
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-text flex items-center font-scdream">
            <FaQuoteLeft className="mr-2 text-purple" /> 
            감정 라이딩 일기
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diaryEntries.map((entry) => (
            <motion.div
              key={entry.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-t-4 ${getEmotionColor(entry.emotion)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + entry.id * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getEmotionEmoji(entry.emotion)}</span>
                    <div>
                      <div className={`text-xs font-medium ${getEmotionTextColor(entry.emotion)}`}>
                        {getEmotionLabel(entry.emotion)}
                      </div>
                      <div className="text-sm text-gray-500">{entry.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-purple">
                    <FaBiking className="mr-1" />
                    <span>{entry.route}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 italic">
                  "{entry.content}"
                </p>
                
                <div className="mt-4 flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{entry.route}</span>
                  </div>
                  <button className="text-purple flex items-center hover:underline">
                    <FaHeart className="mr-1" />
                    <span>다시 라이딩</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="text-purple hover:text-purple-light transition-colors text-sm inline-flex items-center">
            이전 기록 더보기
          </button>
        </div>
      </div>
    </section>
  );
};

export default EmotionHistorySection; 