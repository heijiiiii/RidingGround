import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, X, Edit, Calendar, MapPin } from 'lucide-react';

// 감정 데이터
const emotionData = [
  { 
    id: 1, 
    emotion: "😊", 
    label: "설렘", 
    color: "#FFB6C1", 
    route: "남산 벚꽃길", 
    date: "4/1",
    day: 1,
    review: "벚꽃이 만개한 남산길을 달리며 봄의 설렘을 느꼈어요. 연인과 함께라면 더욱 특별한 시간이 될 거예요!",
    image: "/api/placeholder/400/250"
  },
  { 
    id: 2, 
    emotion: "😄", 
    label: "기쁨", 
    color: "#FFE066", 
    route: "뚝섬 자전거길", 
    date: "4/8",
    day: 8,
    review: "뚝섬 자전거길에서 시원한 강바람을 맞으며 달리니 모든 스트레스가 사라졌어요. 햇살이 반짝이는 한강은 언제나 최고!",
    image: "/api/placeholder/400/250"
  },
  { 
    id: 3, 
    emotion: "😢", 
    label: "위로", 
    color: "#A0C4FF", 
    route: "한강 야경길", 
    date: "4/15",
    day: 15,
    review: "힘든 하루를 보내고 야경이 아름다운 한강변을 달리니 마음이 진정되었어요. 때로는 혼자만의 시간도 필요하죠.",
    image: "/api/placeholder/400/250"
  },
  { 
    id: 4, 
    emotion: "😌", 
    label: "고요", 
    color: "#BDB2FF", 
    route: "양재천 숲길", 
    date: "4/22",
    day: 22,
    review: "양재천의 울창한 나무들 사이로 조용히 달리며 명상하는 시간을 가졌어요. 자연 속에서 내면의 평화를 찾을 수 있었습니다.",
    image: "/api/placeholder/400/250"
  }
];

// 5월 데이터 추가
const mayEmotionData = [
  { 
    id: 5, 
    emotion: "😎", 
    label: "리프레시", 
    color: "#43aa8b", 
    route: "올림픽공원 트랙", 
    date: "5/5",
    day: 5,
    review: "어린이날 올림픽공원에서 상쾌한 공기를 마시며 라이딩했어요. 몸과 마음이 모두 새로워지는 기분이었습니다.",
    image: "/api/placeholder/400/250"
  },
  { 
    id: 6, 
    emotion: "😊", 
    label: "설렘", 
    color: "#FFB6C1", 
    route: "서울숲 산책로", 
    date: "5/12",
    day: 12,
    review: "서울숲의 푸른 신록을 보며 라이딩! 봄이 완연히 느껴지는 코스였어요. 나무 그늘 아래 잠시 쉬어가는 시간도 좋았습니다.",
    image: "/api/placeholder/400/250"
  },
  { 
    id: 7, 
    emotion: "😄", 
    label: "기쁨", 
    color: "#FFE066", 
    route: "여의도 한강공원", 
    date: "5/20",
    day: 20,
    review: "주말 여의도에서 친구들과 함께한 라이딩! 맛있는 피크닉과 함께해서 더욱 즐거웠어요. 다음에도 꼭 다시 오고 싶어요.",
    image: "/api/placeholder/400/250"
  }
];

// 감정 데이터 월별 구성
const monthlyEmotionData = {
  1: [
    { day: 3, emotion: "😊", label: "설렘", color: "#FFB6C1" },
    { day: 10, emotion: "😄", label: "기쁨", color: "#FFE066" },
    { day: 17, emotion: "😌", label: "고요", color: "#BDB2FF" },
    { day: 24, emotion: "😎", label: "리프레시", color: "#43aa8b" }
  ],
  2: [
    { day: 1, emotion: "😌", label: "고요", color: "#BDB2FF" },
    { day: 8, emotion: "😊", label: "설렘", color: "#FFB6C1" },
    { day: 15, emotion: "😌", label: "고요", color: "#BDB2FF" },
    { day: 22, emotion: "😎", label: "리프레시", color: "#43aa8b" },
    { day: 28, emotion: "😌", label: "고요", color: "#BDB2FF" }
  ],
  3: [
    { day: 5, emotion: "😄", label: "기쁨", color: "#FFE066" },
    { day: 12, emotion: "😊", label: "설렘", color: "#FFB6C1" },
    { day: 19, emotion: "😢", label: "위로", color: "#A0C4FF" },
    { day: 26, emotion: "😄", label: "기쁨", color: "#FFE066" }
  ],
  4: emotionData,
  5: mayEmotionData
};

// 감정 일기 샘플 데이터
const emotionDiaries = [
  {
    id: 1,
    date: "5/20",
    emotion: "😄",
    title: "친구들과 한강 라이딩",
    content: "오랜만에 친구들과 함께한 라이딩. 날씨도 좋고 한강변 벚꽃도 예뻐서 기분 최고! 저녁에는 치맥도 함께해서 완벽한 하루였다.",
    route: "여의도 한강공원"
  },
  {
    id: 2,
    date: "5/12",
    emotion: "😊",
    title: "서울숲 산책로 탐험",
    content: "오늘은 새로운 코스를 시도해봤다. 서울숲의 나무들이 정말 싱그럽고 공기도 맑아서 기분이 좋았다. 중간에 벤치에 앉아 가져간 간식도 먹고 여유로운 시간을 보냈다.",
    route: "서울숲 산책로"
  },
  {
    id: 3,
    date: "5/5",
    emotion: "😎",
    title: "올림픽공원 휴일 라이딩",
    content: "어린이날 연휴, 올림픽공원에서 혼자만의 시간을 가졌다. 사람들은 많았지만 자전거를 타는 순간만큼은 모든 고민을 잊을 수 있었다. 체력이 좋아지는 느낌이다!",
    route: "올림픽공원 트랙"
  }
];

// 부드러운 베지어 곡선 트랙 생성 함수 
const generateTrackPath = (points) => {
  if (points.length < 2) return "";
  
  // SVG 경로 문자열 시작
  let path = `M ${points[0].x} ${points[0].y}`;
  
  // 부드러운 곡선을 위한 베지어 곡선 명령어
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    // 현재 점과 다음 점 사이의 중간점 계산
    const midX = (curr.x + next.x) / 2;
    
    // 제어점 계산 (부드러운 곡선을 위해)
    const cp1x = midX + (curr.x - midX) / 2;
    const cp1y = curr.y;
    const cp2x = midX + (next.x - midX) / 2;
    const cp2y = next.y;
    
    // 3차 베지어 곡선으로 연결
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return path;
};

// 경로에서 특정 지점의 좌표를 구하는 함수 (자전거 애니메이션에 사용)
const getPointOnPath = (path, progress) => {
  try {
    if (!path || typeof path !== 'object' || !path.getTotalLength) {
      return { x: 0, y: 0 };
    }
    
    const pathLength = path.getTotalLength();
    const point = path.getPointAtLength(pathLength * progress);
    return { x: point.x, y: point.y };
  } catch (error) {
    console.error("경로 좌표 계산 오류:", error);
    return { x: 0, y: 0 };
  }
};

export default function EmotionRidingTrack() {
  const [selectedMonth, setSelectedMonth] = useState(5); // 기본값 5월(최신)로 변경
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [trackData, setTrackData] = useState([]);
  const [bikePosition, setBikePosition] = useState({ x: 0, y: 0 });
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('forward'); // 애니메이션 방향 상태 추가
  const trackRef = useRef(null);
  const svgPathRef = useRef(null);
  const animationRef = useRef(null);
  
  // 월 선택 시 트랙 데이터 업데이트
  useEffect(() => {
    // 선택된 월의 감정 데이터 가져오기
    const monthData = monthlyEmotionData[selectedMonth] || [];
    
    // 트랙 포인트 계산
    const graphWidth = trackRef.current ? trackRef.current.clientWidth - 80 : 1000;
    const graphHeight = 250;
    const paddingLeft = 40;
    
    // 각 감정 데이터 포인트의 좌표 계산
    const pointsData = monthData.map((item, index) => {
      // X 좌표는 날짜에 비례
      const x = paddingLeft + (item.day / 31) * graphWidth;
      
      // Y 좌표는 고정된 트랙 높이에 약간의 변동을 줌
      // 감정별로 Y 위치를 조금씩 다르게 하여 롤러코스터 느낌 주기
      let y = graphHeight / 2;
      
      switch (item.emotion) {
        case "😊": // 설렘
          y = graphHeight / 2 - 40;
          break;
        case "😄": // 기쁨
          y = graphHeight / 2 - 60;
          break;
        case "😢": // 위로
          y = graphHeight / 2 + 30;
          break;
        case "😌": // 고요
          y = graphHeight / 2;
          break;
        case "😎": // 리프레시
          y = graphHeight / 2 - 50;
          break;
        default:
          y = graphHeight / 2;
      }
      
      return {
        ...item,
        x,
        y
      };
    });
    
    setTrackData(pointsData);
    
    // 애니메이션 상태 초기화
    setAnimationComplete(false);
    
    // 자전거 위치 초기화
    if (pointsData.length > 0) {
      setBikePosition({ x: pointsData[0].x, y: pointsData[0].y });
    }
  }, [selectedMonth]);

  // 트랙 데이터 변경 또는 마운트 시 애니메이션 시작
  useEffect(() => {
    if (trackData.length <= 1) return;
    
    // 애니메이션 진행 상태 
    let animationProgress = 0;
    
    // 애니메이션 시작 시 첫 번째 이모지 위치로 설정
    if(trackData.length > 0) {
      const firstPoint = trackData[0];
      setBikePosition({ x: firstPoint.x, y: firstPoint.y });
    }
    
    const animateBike = () => {
      // 애니메이션 속도 (현재의 1/10로 감소)
      if (animationDirection === 'forward') {
        animationProgress += 0.0003; // 0.003 → 0.0003로 감소
      } else {
        animationProgress -= 0.0003;
      }
      
      // 애니메이션 방향에 따른 종료 조건 처리
      if (animationDirection === 'forward' && animationProgress >= 1) {
        // 끝점에 도달하면 애니메이션 방향을 반대로 전환
        setAnimationDirection('backward');
      } else if (animationDirection === 'backward' && animationProgress <= 0) {
        // 시작점에 도달하면 다시 정방향으로 전환
        setAnimationDirection('forward');
      }
      
      // SVG 경로 상의 현재 위치 계산
      if (svgPathRef.current) {
        const point = getPointOnPath(svgPathRef.current, animationProgress);
        setBikePosition(point);
      }
      
      animationRef.current = requestAnimationFrame(animateBike);
    };
    
    // 애니메이션 시작 전 짧은 딜레이
    const timer = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animateBike);
    }, 500);
    
    // 컴포넌트 언마운트 시 애니메이션 정리
    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trackData, animationDirection]);

  // 달 선택 핸들러
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setAnimationDirection('forward'); // 방향 초기화
  };
  
  return (
    <div className="w-full max-w-full mx-auto p-6 bg-gray-100 rounded-lg">
      {/* 제목 섹션 */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          My Emotional Riding Track
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          지난 달, 나의 감정은 어떤 길을 달려왔을까요?
        </p>
        
        {/* 월 선택 탭 */}
        <div className="inline-flex rounded-full bg-white shadow-sm p-1 border">
          {[1, 2, 3, 4, 5].map((month) => (
            <button
              key={month}
              className={`px-8 py-3 rounded-full text-base transition-all ${
                selectedMonth === month
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => handleMonthSelect(month)}
            >
              {month}월
            </button>
          ))}
        </div>
      </div>

      {/* 감정 트랙 뷰 (그래프 대신 트랙으로 표현) */}
      <div className="mb-10 bg-white rounded-lg p-8 shadow-md border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="text-purple-500 text-2xl mr-3">📅</div>
          <h3 className="text-2xl font-bold text-gray-800">{selectedMonth}월 감정 흐름</h3>
        </div>

        {/* 감정 레이블 범례 */}
        <div className="flex flex-wrap gap-4 mt-2 mb-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-mint mr-2"></div>
            <span className="text-sm text-gray-600">고요함</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-pink mr-2"></div>
            <span className="text-sm text-gray-600">설렘</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple mr-2"></div>
            <span className="text-sm text-gray-600">위로</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
            <span className="text-sm text-gray-600">기쁨</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">리프레시</span>
          </div>
        </div>

        {/* 감정 트랙 (곡선형 그래프) */}
        <div 
          ref={trackRef}
          className="w-full h-80 relative bg-blue-50/30 rounded-lg overflow-hidden"
        >
          {/* X축 레이블 */}
          <div className="absolute bottom-4 w-full flex justify-between text-sm text-gray-500 px-8">
            <div>1일</div>
            <div>10일</div>
            <div>20일</div>
            <div>30일</div>
          </div>

          {/* 트랙 그리기 */}
          {trackData.length > 1 && (
            <svg className="absolute inset-0 w-full h-full">
              {/* 트랙 경로 - 부드러운 곡선 */}
              <defs>
                <linearGradient id="trackGradient" gradientUnits="userSpaceOnUse" 
                  x1="0%" y1="0%" x2="100%" y2="0%">
                  {trackData.map((point, i) => (
                    <stop 
                      key={`stop-${i}`} 
                      offset={`${(i / (trackData.length-1)) * 100}%`} 
                      stopColor={point.color} 
                    />
                  ))}
                </linearGradient>
              </defs>
              
              {/* 트랙 경로 배경 (그림자 효과) */}
              <path
                d={generateTrackPath(trackData)}
                fill="none"
                stroke="rgba(139, 92, 246, 0.15)"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="filter blur-md"
              />
              
              {/* 트랙 경로 메인 - 자전거 애니메이션을 위한 참조 추가 */}
              <path
                ref={svgPathRef}
                d={generateTrackPath(trackData)}
                fill="none"
                stroke="url(#trackGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="filter drop-shadow-lg"
              />
            </svg>
          )}
          
          {/* 자전거 아이콘 */}
          <div 
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ 
              left: bikePosition.x, 
              top: bikePosition.y,
            }}
          >
            <img 
              src="/RidingGround/bike.png"
              alt="자전거"
              className="w-14 h-14 object-contain"
            />
          </div>
          
          {/* 감정 이모지 노드 - 하단 텍스트 제거 */}
          {trackData.map((point, index) => (
            <div
              key={`emotion-${selectedMonth}-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform hover:scale-110"
              style={{ 
                left: point.x, 
                top: point.y,
              }}
              onClick={() => setSelectedEmotion({
                id: index + 1,
                emotion: point.emotion,
                label: point.label,
                color: point.color,
                date: `${selectedMonth}/${point.day}`,
                route: `${point.label} 추천 코스`,
                review: `${point.day}일에 느낀 ${point.label} 감정의 라이딩 기록입니다.`
              })}
            >
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-full text-xl shadow-lg border-2 border-white"
                style={{ backgroundColor: point.color }}
              >
                {point.emotion}
              </div>
            </div>
          ))}
          
          {/* 트랙 하단 물결 효과 (선택적) */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent opacity-50"></div>
        </div>
      </div>
      
      {/* 새로 추가: 감정 라이딩 일기 섹션 */}
      <div className="mt-16 mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Edit className="mr-2 text-purple-500" size={24} />
          감정 라이딩 일기
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emotionDiaries.map((diary) => (
            <div key={diary.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-5 border-b">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="text-2xl mr-2">{diary.emotion}</div>
                    <h4 className="font-bold text-lg text-gray-800">{diary.title}</h4>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  <span>{diary.date}</span>
                  <MapPin size={14} className="ml-3 mr-1" />
                  <span>{diary.route}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 leading-relaxed">{diary.content}</p>
              </div>
              <div className="px-5 py-3 bg-gray-50 text-right">
                <button className="text-purple-600 text-sm font-medium hover:text-purple-800">
                  더 읽기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 감정 세부 정보 팝업 */}
      {selectedEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span style={{ color: selectedEmotion.color }}>{selectedEmotion.emotion}</span> 
                {selectedEmotion.label} 라이딩
              </h3>
              <button 
                onClick={() => setSelectedEmotion(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 h-56 rounded-lg mb-5 flex items-center justify-center">
                <div className="text-7xl">{selectedEmotion.emotion}</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-base font-medium text-gray-500">날짜</span>
                  <p className="text-lg text-gray-800">{selectedEmotion.date}</p>
                </div>
                
                <div>
                  <span className="text-base font-medium text-gray-500">추천 코스</span>
                  <p className="text-lg text-gray-800 font-medium">{selectedEmotion.route}</p>
                </div>
                
                <div>
                  <span className="text-base font-medium text-gray-500">라이딩 후기</span>
                  <p className="text-lg text-gray-800">{selectedEmotion.review}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 flex justify-end">
              <button 
                onClick={() => setSelectedEmotion(null)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-base"
              >
                <ArrowLeft size={20} />
                돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}