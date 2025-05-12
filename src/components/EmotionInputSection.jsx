import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPalette, FaSmile, FaFont, FaUpload, FaRobot, FaCheck, FaKeyboard } from 'react-icons/fa';

const EmotionInputSection = ({ selectedEmotions: externalSelectedEmotions, onEmotionSelect }) => {
  const [activeTab, setActiveTab] = useState('emoji'); // 기본값을 이모지 탭으로 변경
  const [localSelectedEmotions, setLocalSelectedEmotions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 중 상태
  const [analysisComplete, setAnalysisComplete] = useState(false); // 분석 완료 상태
  
  // 탭 데이터 변경 - 음악과 사진 탭 제거
  const tabs = [
    { id: 'emoji', label: '이모지', icon: <FaSmile /> },
    { id: 'color', label: '컬러카드', icon: <FaPalette /> },
    { id: 'text', label: '텍스트', icon: <FaFont /> }
  ];

  // 컬러 카드 데이터
  const colorCards = [
    { color: 'bg-mint', label: '고요함', emotion: 'calm' },
    { color: 'bg-pink', label: '설렘', emotion: 'excitement' },
    { color: 'bg-purple', label: '위로', emotion: 'comfort' },
    { color: 'bg-amber', label: '기쁨', emotion: 'joy' },
    { color: 'bg-purple-light', label: '리프레시', emotion: 'refresh' }
  ];

  // 이모지 데이터 업데이트 - emotion 속성 추가하여 Supabase 감정과 매핑
  const emojis = [
    { emoji: '😊', label: '행복', emotion: 'joy' },         // 기쁨(컬러카드와 매핑)
    { emoji: '😌', label: '편안', emotion: 'calm' },        // 고요함(컬러카드와 매핑)
    { emoji: '😍', label: '설렘', emotion: 'excitement' },  // 설렘(컬러카드와 매핑)
    { emoji: '🥲', label: '위로', emotion: 'comfort' },     // 위로(컬러카드와 매핑)
    { emoji: '🌀', label: '리프레시', emotion: 'refresh' }, // 리프레시(컬러카드와 매핑)
    { emoji: '🤔', label: '호기심', emotion: 'curiosity' }, // 추가 감정
    { emoji: '😤', label: '활력', emotion: 'energy' },      // 추가 감정
    { emoji: '🧘', label: '평화', emotion: 'peace' }         // 추가 감정
  ];

  // 외부에서 전달된 감정 상태 동기화
  useEffect(() => {
    if (externalSelectedEmotions) {
      setLocalSelectedEmotions(externalSelectedEmotions);
    }
  }, [externalSelectedEmotions]);

  // 감정 선택 핸들러 수정
  const handleEmotionSelect = (emotion) => {
    // 이미 선택된 감정인지 확인
    const isAlreadySelected = localSelectedEmotions.some(
      item => item.emotion === emotion.emotion
    );
    
    let newSelectedEmotions;
    if (isAlreadySelected) {
      // 이미 선택된 감정이면 제거
      newSelectedEmotions = localSelectedEmotions.filter(item => item.emotion !== emotion.emotion);
    } else {
      // 선택되지 않은 감정이면 추가
      newSelectedEmotions = [...localSelectedEmotions, emotion];
    }
    
    // 로컬 상태 업데이트
    setLocalSelectedEmotions(newSelectedEmotions);
    
    // 부모 컴포넌트에 상태 전달
    if (onEmotionSelect) {
      onEmotionSelect(newSelectedEmotions);
    }
  };
  
  // 분석 시작 함수
  const startAnalysis = () => {
    if (localSelectedEmotions.length > 0) {
      setIsAnalyzing(true);
      
      // AI 분석 시뮬레이션 (실제로는 API 호출)
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        // 분석 완료 후 자동으로 코스 섹션으로 스크롤
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
          setTimeout(() => {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
            
            // 코스 로드 이벤트 발생
            const courseLoadEvent = new CustomEvent('loadCourseData', { 
              detail: { emotions: localSelectedEmotions } 
            });
            document.dispatchEvent(courseLoadEvent);
            console.log('코스 로드 이벤트 발생:', localSelectedEmotions);
          }, 500);
        }
      }, 2000);
    }
  };

  // 분석 재시작
  const resetAnalysis = () => {
    setLocalSelectedEmotions([]);
    setAnalysisComplete(false);
    
    // 부모 컴포넌트에 빈 배열 전달
    if (onEmotionSelect) {
      onEmotionSelect([]);
    }
  };

  // 현재 선택된 탭의 가이드 문구 가져오기 - 제거된 가이드 문구 대신 기본 텍스트 반환
  const getCurrentGuide = () => {
    return '당신의 감정을 선택해주세요';
  };

  // 렌더링할 탭 컨텐츠 결정
  const renderTabContent = () => {
    if (isAnalyzing) {
      return renderAnalyzing();
    }
    
    if (analysisComplete) {
      return renderAnalysisResult();
    }
    
    switch (activeTab) {
      case 'color':
        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-8">
              {colorCards.map((card, index) => {
                // 현재 카드가 선택되었는지 확인
                const isSelected = localSelectedEmotions.some(
                  item => item.emotion === card.emotion
                );
                
                return (
                  <motion.button
                    key={index}
                    className={`${card.color} rounded-2xl shadow-md p-6 md:p-8 text-white text-center transition-all hover:shadow-lg relative overflow-hidden group ${isSelected ? 'ring-4 ring-offset-2 ring-white' : ''}`}
                    whileHover={{ y: -8, scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    onClick={() => handleEmotionSelect(card)}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full bg-white/10 animate-emotion-wave"></div>
                      <div className="absolute -bottom-2 -left-2 w-10 h-10 rounded-full bg-white/10 animate-emotion-wave" style={{ animationDelay: '1s' }}></div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple">
                          <FaCheck size={14} />
                        </div>
                      )}
                      <div className="text-2xl font-scdream font-medium mb-2">{card.label}</div>
                      <div className="text-sm font-light opacity-90">Click to select</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* 선택된 감정들 표시 및 분석 시작 버튼 */}
            {localSelectedEmotions.length > 0 && (
              <div className="mt-8 flex flex-col items-center">
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {localSelectedEmotions.map((emotion, index) => (
                    <div 
                      key={index} 
                      className={`${emotion.color} text-white px-4 py-2 rounded-full text-sm flex items-center`}
                    >
                      {emotion.label}
                      <button 
                        className="ml-2 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmotionSelect(emotion);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={startAnalysis}
                  className="bg-purple hover:bg-purple/90 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors inline-flex items-center shadow-md"
                >
                  감정 분석하기
                  <FaKeyboard className="ml-2" />
                </button>
              </div>
            )}
          </>
        );
      case 'emoji':
        return (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 mt-8">
              {emojis.map((item, index) => {
                // 이모지를 감정 객체로 변환
                const emojiEmotion = { 
                  label: item.label, 
                  emotion: item.emotion, 
                  color: 'bg-purple-light' 
                };
                // 현재 이모지가 선택되었는지 확인
                const isSelected = localSelectedEmotions.some(
                  emotion => emotion.label === item.label
                );
                
                return (
                  <motion.button
                    key={index}
                    className={`bg-white rounded-xl shadow-sm p-4 text-center transition hover:shadow-lg border border-gray-light/20 ${isSelected ? 'ring-2 ring-purple' : ''}`}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmotionSelect(emojiEmotion)}
                  >
                    <div className="text-5xl mb-2 relative">
                      {item.emoji}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple rounded-full flex items-center justify-center text-white text-xs">
                          <FaCheck size={10} />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-lighter font-medium">{item.label}</div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* 선택된 감정들 표시 및 분석 시작 버튼 */}
            {localSelectedEmotions.length > 0 && (
              <div className="mt-8 flex flex-col items-center">
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {localSelectedEmotions.map((emotion, index) => (
                    <div 
                      key={index} 
                      className={`${emotion.color || 'bg-purple-light'} text-white px-4 py-2 rounded-full text-sm flex items-center`}
                    >
                      {emotion.label}
                      <button 
                        className="ml-2 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmotionSelect(emotion);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={startAnalysis}
                  className="bg-purple hover:bg-purple/90 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors inline-flex items-center shadow-md"
                >
                  감정 분석하기
                  <FaKeyboard className="ml-2" />
                </button>
              </div>
            )}
          </>
        );
      case 'text':
        return (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mt-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-text mb-4">나의 감정을 자유롭게 적어보세요</h3>
              <textarea 
                className="w-full h-40 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple/50 resize-none"
                placeholder="오늘 어떤 감정을 느끼셨나요? 자유롭게 적어주세요..."
              ></textarea>
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-lighter">AI가 분석하여 최적의 자전거 코스를 추천해드립니다</p>
                <button 
                  className="bg-purple hover:bg-purple/90 text-white px-4 py-2 rounded-full text-xs font-medium transition-colors inline-flex items-center"
                >
                  <FaUpload className="mr-1" /> 전송하기
                </button>
              </div>
            </div>
            
            {/* 감정 직접 선택 옵션 */}
            <div className="mt-10 text-center">
              <div className="text-sm text-gray-lighter mb-4">
                또는 직접 감정을 선택해 주세요
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {emojis.map((emotion, index) => {
                  const isSelected = localSelectedEmotions.some(
                    item => item.emotion === emotion.emoji
                  );
                  
                  // 감정 객체 생성
                  const emotionObj = { 
                    label: emotion.label, 
                    emotion: emotion.emoji, 
                    color: 'bg-purple-light' 
                  };
                  
                  return (
                    <button
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm flex items-center transition-colors ${
                        isSelected 
                          ? `${emotion.color} text-white` 
                          : 'bg-gray-light text-gray-lighter hover:bg-gray-200'
                      }`}
                      onClick={() => handleEmotionSelect(emotionObj)}
                    >
                      {emotion.emoji} <span className="ml-1">{emotion.label}</span>
                      {isSelected && (
                        <span className="ml-2 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center">
                          <FaCheck size={10} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* 선택된 감정들 표시 및 분석 시작 버튼 */}
              {localSelectedEmotions.length > 0 && (
                <button 
                  onClick={startAnalysis}
                  className="bg-purple hover:bg-purple/90 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors inline-flex items-center shadow-md"
                >
                  감정 분석하기
                  <FaKeyboard className="ml-2" />
                </button>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };
  
  // 분석 중 UI
  const renderAnalyzing = () => {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative w-28 h-28 mb-8">
          <motion.div 
            className="absolute inset-0 rounded-full bg-purple/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.div 
            className="absolute inset-2 rounded-full bg-purple/30"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          >
            <FaRobot className="text-5xl text-purple" />
          </motion.div>
        </div>
        <motion.h3 
          className="text-xl font-scdream font-medium text-text mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          당신의 감정을 분석하고 있어요
        </motion.h3>
        <motion.p 
          className="text-gray-lighter text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          선택하신 {localSelectedEmotions.map(e => e.label).join(', ')} 감정을 AI가 분석하여 
          <br />최적의 자전거 코스를 찾고 있습니다.
        </motion.p>
        
        {/* 분석 과정 시각화 - 비율 조정 */}
        <motion.div 
          className="mt-10 w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center mb-4">
            <motion.div 
              className="w-10 h-10 bg-purple text-white text-sm flex items-center justify-center rounded-full"
              animate={{ backgroundColor: ["#8572FF", "#BAB0F9", "#8572FF"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              1
            </motion.div>
            <div className="h-0.5 flex-grow mx-2 overflow-hidden bg-gray-100" style={{ flex: '1' }}>
              <motion.div 
                className="h-full bg-purple" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <motion.div 
              className="w-10 h-10 bg-purple/30 text-purple text-sm flex items-center justify-center rounded-full"
              animate={{ backgroundColor: ["#8572FF30", "#8572FF", "#8572FF30"] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              2
            </motion.div>
            <div className="h-0.5 flex-grow mx-2 overflow-hidden bg-gray-100" style={{ flex: '1.5' }}>
              <motion.div 
                className="h-full bg-purple" 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
              />
            </div>
            <motion.div 
              className="w-10 h-10 bg-purple/30 text-purple text-sm flex items-center justify-center rounded-full"
              animate={{ backgroundColor: ["#8572FF30", "#8572FF", "#8572FF30"] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            >
              3
            </motion.div>
          </div>
          <div className="flex justify-between text-xs text-gray-lighter px-2">
            <span>감정 분석</span>
            <span style={{ marginLeft: '15%' }}>코스 매칭</span>
            <span>경로 계산</span>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // 분석 결과 UI
  const renderAnalysisResult = () => {
    return (
      <motion.div
        className="flex flex-col items-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-purple/10 w-full max-w-2xl rounded-xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-purple/5 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 -ml-8 -mb-8 bg-purple/5 rounded-full"></div>
          
          <div className="flex items-start mb-6">
            <div className="bg-purple rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-md">
              <FaCheck className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-scdream font-medium text-text">감정 분석 완료</h3>
              <p className="text-gray-lighter text-sm">
                오늘의 감정: 
                {localSelectedEmotions.map((emotion, index) => (
                  <span key={index}>
                    {index > 0 && ', '}
                    <span className="font-medium text-purple">{emotion.label}</span>
                  </span>
                ))}
              </p>
            </div>
          </div>
          
          <div className="border-t border-purple/10 pt-6 mt-4">
            <h4 className="text-sm font-medium text-text mb-4 flex items-center">
              <FaRobot className="mr-2 text-purple" /> AI 분석 결과
            </h4>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-sm text-gray-lighter mb-2">
                {localSelectedEmotions.length > 1 ? (
                  <>당신의 <span className="text-purple font-medium">{localSelectedEmotions.map(e => e.label).join(', ')}</span> 감정에는 다양한 요소가 조화된 북한산 둘레길이 어울립니다. 자연의 평화로움과 아름다운 전망이 복합적인 감정에 균형을 가져다 줄 것입니다.</>
                ) : (
                  <>당신의 <span className="text-purple font-medium">{localSelectedEmotions[0]?.label}</span> 감정에는 
                  {localSelectedEmotions[0]?.emotion === 'calm' && " 고요하고 평화로운 한강 야경 코스가 어울립니다. 잔잔한 물결과 도시의 불빛이 마음을 진정시켜 줄 거예요."}
                  {localSelectedEmotions[0]?.emotion === 'excitement' && " 활기차고 새로운 남산 벚꽃길이 어울립니다. 화려한 풍경이 당신의 설렘을 더해줄 거예요."}
                  {localSelectedEmotions[0]?.emotion === 'comfort' && " 부드럽고 아늑한 북한산 둘레길이 어울립니다. 자연 속에서 위로를 느끼실 수 있을 거예요."}
                  {localSelectedEmotions[0]?.emotion === 'joy' && " 넓고 개방감 있는 올림픽공원 트랙이 어울립니다. 기분 좋은 라이딩을 즐기실 수 있을 거예요."}
                  {localSelectedEmotions[0]?.emotion === 'refresh' && " 상쾌하고 생기 넘치는 북한산 둘레길이 어울립니다. 맑은 공기가 당신을 리프레시해줄 거예요."}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-lighter border-t border-gray-100 pt-2 mt-2">
                <span className="font-medium text-text">추천 이유: </span>
                {localSelectedEmotions.length > 1 
                  ? "여러 감정이 복합적으로 느껴질 때는 다양한 요소가 조화된 코스가 마음의 균형을 찾는데 도움이 됩니다. 푸른 숲과 탁 트인 전망이 번갈아 나타나는 북한산 둘레길은 복합적인 감정에 대응할 수 있는 최적의 코스입니다." 
                  : (
                    ((localSelectedEmotions[0]?.emotion === 'calm') && "고요한 감정에는 평온한 수변 코스가 감정의 균형을 유지시켜 줍니다.") ||
                    ((localSelectedEmotions[0]?.emotion === 'excitement') && "설렘의 감정은 새로운 풍경과 만날 때 더욱 증폭됩니다.") ||
                    ((localSelectedEmotions[0]?.emotion === 'comfort') && "위로가 필요할 때는 자연의 품에 안기는 것이 좋습니다.") ||
                    ((localSelectedEmotions[0]?.emotion === 'joy') && "기쁨의 감정을 나눌 수 있는 활기찬 공간이 어울립니다.") ||
                    ((localSelectedEmotions[0]?.emotion === 'refresh') && "리프레시를 위해서는 맑은 공기와 울창한 자연이 최고입니다.")
                  )
                }
              </p>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={resetAnalysis}
              className="bg-purple text-white hover:bg-purple-light px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              다시 선택하기
            </button>
            <a 
              href="#courses" 
              className="bg-purple text-white px-5 py-2.5 rounded-full text-sm flex items-center hover:bg-purple/90 transition-colors"
              onClick={() => {
                // 추천 코스 섹션으로 스크롤
                const coursesSection = document.getElementById('courses');
                if (coursesSection) {
                  setTimeout(() => {
                    coursesSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // 데이터 로드 트리거를 위한 이벤트 발생
                    const loadDataEvent = new CustomEvent('loadCourseData', { 
                      detail: { emotions: localSelectedEmotions }
                    });
                    window.dispatchEvent(loadDataEvent);
                  }, 100);
                }
              }}
            >
              추천 코스 보기 <FaKeyboard className="ml-2" />
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-16 bg-gray-100" id="emotion">
      <div className="container mx-auto px-4">
        {/* 섹션 제목 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-scdream font-bold text-text mb-4">
            Emotion type
          </h2>
          <p className="text-lg text-gray-lighter max-w-2xl mx-auto">
            이제 당신이 느끼는 감정을 선택해서 맞춤형 라이딩 코스를 추천해 드립니다.
          </p>
        </motion.div>

        {/* 탭 메뉴 - 분석 중이거나 완료되었을 때는 숨김 */}
        {!isAnalyzing && !analysisComplete && (
          <div className="flex flex-wrap justify-center mb-6 w-full overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 mx-1 text-sm transition-all focus:outline-none flex items-center gap-2 rounded-full ${activeTab === tab.id 
                  ? 'bg-purple text-white font-medium shadow-md' 
                  : 'bg-white text-gray-lighter hover:text-text hover:bg-white/90'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* 현재 탭 가이드 - 분석 중이거나 완료되었을 때는 숨김 */}
        {!isAnalyzing && !analysisComplete && (
          <motion.div
            key={`guide-${activeTab}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-purple-light italic font-light">
              {getCurrentGuide()}
            </p>
          </motion.div>
        )}

        {/* 탭 컨텐츠 영역 */}
        <motion.div
          key={activeTab + (isAnalyzing ? '-analyzing' : '') + (analysisComplete ? '-complete' : '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </section>
  );
};

export default EmotionInputSection; 