import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaBiking, FaMapMarkerAlt } from 'react-icons/fa';
// Supabase 클라이언트 임포트
import { supabase } from '../supabaseClient';
import { getCoursesByEmotion } from '../supabase_queries';
// 로컬 이미지 import
import HangangImg from '../image/1_hangang.jpg';
import SanImg from '../image/2_san.jpg';
import ParkImg from '../image/3_park.jpg';
import FlowerImg from '../image/4_flower.jpg';

// 하드코딩 모드를 제어하는 플래그 (true: DB만 사용, false: 1-4월은 하드코딩 데이터 사용)
const USE_DB_ONLY = false;

// OpenWeather API 키
const WEATHER_API_KEY = typeof window !== 'undefined' && window.ENV_VARS && window.ENV_VARS.WEATHER_API_KEY 
  ? window.ENV_VARS.WEATHER_API_KEY 
  : "7f111eb21aaf2127ac1cccdd553e8ee0"; // .htaccess에 설정된 키 사용

// 이미지 배열 생성
const courseImages = [
  HangangImg,
  SanImg,
  ParkImg,
  FlowerImg
];

// 이미지를 더 다양하게 만들기 위한 추가 이미지 배열 (실제 이미지와 동일하지만 다른 변수로 사용)
const additionalImages = [
  HangangImg, // 한강
  SanImg,     // 산
  ParkImg,    // 공원
  FlowerImg,  // 꽃길
];

// 전체 이미지 배열 (기본 + 추가)
const allImages = [...courseImages, ...additionalImages];

// 감정별 이미지 매핑
const emotionImages = {
  'excitement': [FlowerImg, ParkImg], // 설렘 - 꽃 이미지, 공원 이미지
  'calm': [HangangImg, SanImg],       // 고요함 - 한강 이미지, 산 이미지
  'refresh': [SanImg, HangangImg],    // 리프레시 - 산 이미지, 한강 이미지
  'joy': [ParkImg, FlowerImg],        // 기쁨 - 공원 이미지, 꽃 이미지
  'comfort': [ParkImg, SanImg],       // 위로 - 공원 이미지, 산 이미지
  'curiosity': [FlowerImg, SanImg],   // 호기심 - 꽃 이미지, 산 이미지
  'energy': [SanImg, ParkImg],        // 활력 - 산 이미지, 공원 이미지
  'peace': [HangangImg, FlowerImg],   // 평화 - 한강 이미지, 꽃 이미지
};

// 감정 이름과 UUID 매핑 테이블
const EMOTION_ID_MAP = {
  'calm': '5c7dc60d-160c-4e24-be3d-7a05dcaa9031',
  'excitement': 'a7d090e0-1818-476a-b38d-362c4ac038df',
  'comfort': '2285968c-de48-4f7e-ae9e-5e1980c36e67',
  'joy': '2180739c-f604-478a-ada8-229ae4741992',
  'refresh': '3a37910c-1254-4a7e-bac7-1d32f344a7d3',
  'curiosity': 'ba21dfc1-913e-4ea4-ad8b-56fcc7c8594f', 
  'energy': '1461a884-2b53-44e0-a81f-818e6aa417d6',
  'peace': '5cde16c6-d1ce-4a60-ba4c-d8983071a7c0'
};

// 감정 UUID로 이름 찾기
const getEmotionNameById = (emotionId) => {
  for (const [name, id] of Object.entries(EMOTION_ID_MAP)) {
    if (id === emotionId) return name;
  }
  return null;
};

// 감정 이름으로 UUID 찾기
const getEmotionIdByName = (emotionName) => {
  return EMOTION_ID_MAP[emotionName.toLowerCase()] || null;
};

// 하드코딩된 코스 데이터에 emotion_id 추가하는 어댑터 함수
const adaptHardcodedCourse = (course) => {
  return {
    ...course,
    emotion_id: EMOTION_ID_MAP[course.emotion] || null,
    // emotion 필드는 그대로 유지 (하위 호환성)
  };
};

// 현재 월 구하기
const currentMonth = new Date().getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 +1

// 하드코딩된 1,2,3,4월 코스 데이터
const hardcodedMonthCourses = {
  1: [
    { id: 'h1_1', route_name: '1월 한강 겨울 라이딩', emotion: 'calm', distance_km: 8.2, city: '서울시', district: '마포구', start_point: '여의도 한강공원', lat_start: 37.5256, lng_start: 126.9272, lat_end: 37.5410, lng_end: 126.9693 },
    { id: 'h1_2', route_name: '1월 북악산 겨울숲길', emotion: 'refresh', distance_km: 5.4, city: '서울시', district: '종로구', start_point: '북악산 주차장', lat_start: 37.5929, lng_start: 126.9783, lat_end: 37.5863, lng_end: 126.9681 },
    { id: 'h1_3', route_name: '1월 서울숲 산책로', emotion: 'comfort', distance_km: 3.1, city: '서울시', district: '성동구', start_point: '서울숲 공원', lat_start: 37.5446, lng_start: 127.0379, lat_end: 37.5512, lng_end: 127.0416 }
  ],
  2: [
    { id: 'h2_1', route_name: '2월 남산 설경 트랙', emotion: 'excitement', distance_km: 6.7, city: '서울시', district: '중구', start_point: '남산 케이블카역', lat_start: 37.5559, lng_start: 126.9764, lat_end: 37.5514, lng_end: 126.9880 },
    { id: 'h2_2', route_name: '2월 올림픽공원 외곽길', emotion: 'joy', distance_km: 7.2, city: '서울시', district: '송파구', start_point: '올림픽공원 남문', lat_start: 37.5121, lng_start: 127.1177, lat_end: 37.5218, lng_end: 127.1313 },
    { id: 'h2_3', route_name: '2월 어린이대공원 코스', emotion: 'peace', distance_km: 4.3, city: '서울시', district: '광진구', start_point: '어린이대공원 정문', lat_start: 37.5479, lng_start: 127.0743, lat_end: 37.5412, lng_end: 127.0779 }
  ],
  3: [
    { id: 'h3_1', route_name: '3월 양재천 벚꽃길', emotion: 'excitement', distance_km: 9.1, city: '서울시', district: '강남구', start_point: '양재시민의숲역', lat_start: 37.4701, lng_start: 127.0412, lat_end: 37.4887, lng_end: 127.0534 },
    { id: 'h3_2', route_name: '3월 북한산 산책로', emotion: 'refresh', distance_km: 5.9, city: '서울시', district: '은평구', start_point: '북한산 둘레길 입구', lat_start: 37.6216, lng_start: 126.9523, lat_end: 37.6307, lng_end: 126.9601 },
    { id: 'h3_3', route_name: '3월 호수공원 둘레길', emotion: 'calm', distance_km: 6.3, city: '일산시', district: '고양구', start_point: '호수공원 주차장', lat_start: 37.6548, lng_start: 126.7674, lat_end: 37.6492, lng_end: 126.7726 }
  ],
  4: [
    { id: 'h4_1', route_name: '4월 안양천 벚꽃로드', emotion: 'joy', distance_km: 8.5, city: '서울시', district: '영등포구', start_point: '신정교', lat_start: 37.5179, lng_start: 126.8807, lat_end: 37.5398, lng_end: 126.8882 },
    { id: 'h4_2', route_name: '4월 중랑천 라이딩', emotion: 'energy', distance_km: 7.8, city: '서울시', district: '중랑구', start_point: '중랑교', lat_start: 37.5864, lng_start: 127.0608, lat_end: 37.6052, lng_end: 127.0766 },
    { id: 'h4_3', route_name: '4월 석촌호수 봄길', emotion: 'excitement', distance_km: 4.9, city: '서울시', district: '송파구', start_point: '석촌호수 공원', lat_start: 37.5097, lng_start: 127.0798, lat_end: 37.5034, lng_end: 127.0856 }
  ]
};

// 두 지점 간의 거리 계산 함수 (하버사인 공식)
const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return Infinity;
  
  const toRadian = angle => (Math.PI / 180) * angle;
  const R = 6371; // 지구 반경 (km)
  
  const dLat = toRadian(point2.lat - point1.lat);
  const dLng = toRadian(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(point1.lat)) * Math.cos(toRadian(point2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

// 이미지 선택 함수 개선 - 랜덤 요소 강화
const getImageForCourse = (courseId, emotion) => {
  // 기본 이미지 (오류 발생 시 사용)
  const defaultImage = HangangImg;
  
  // 안전한 이미지 접근 함수
  const safeImageAccess = (img) => {
    try {
      // 이미지 URL이 유효한지 확인
      if (typeof img === 'string' && img.startsWith('http')) {
        return img;
      }
      // 로컬 이미지 객체 확인 (undefined나 null이 아닌지)
      if (img && typeof img === 'object') {
        return img;
      }
      // 기본 이미지 반환
      return defaultImage;
    } catch (error) {
      console.error("이미지 로드 오류:", error);
      return defaultImage; // 오류 시 기본 이미지 사용
    }
  };

  // 코스 ID를 해시값으로 변환 (더 강한 랜덤성 추가)
  const getHashFromId = (id) => {
    if (!id) return Date.now() % allImages.length; // ID가 없으면 현재 시간 기준 랜덤
    
    let hashValue;
    if (typeof id === 'string') {
      // 문자열 해시 생성 (더 강한 해시 함수)
      hashValue = id.split('').reduce((acc, char, idx) => {
        return acc + char.charCodeAt(0) * (idx + 1);
      }, 0);
    } else if (typeof id === 'number') {
      hashValue = id;
    } else {
      // 객체일 경우 문자열로 변환하여 해시 계산
      hashValue = JSON.stringify(id).split('').reduce((acc, char, idx) => {
        return acc + char.charCodeAt(0) * (idx + 1);
      }, 0);
    }
    
    // 현재 시간을 포함하여 약간의 무작위성 추가 (초 단위로 다름)
    const timeOffset = Math.floor(Date.now() / 1000) % 10;
    return (hashValue + timeOffset) % allImages.length;
  };

  // 감정에 맞는 이미지가 있으면 우선 사용
  if (emotion && emotionImages[emotion]) {
    // 감정별 이미지 배열
    const emotionImgArray = emotionImages[emotion];
    
    // 코스 ID와 현재 시간을 조합하여 선택
    const hashValue = getHashFromId(courseId);
    const imgIndex = hashValue % emotionImgArray.length;
    
    // 80% 확률로 감정별 이미지 사용, 20% 확률로 다른 랜덤 이미지 사용
    if (Math.random() < 0.8) {
      return safeImageAccess(emotionImgArray[imgIndex]);
    }
  }
  
  // 랜덤 이미지 선택 (감정별 이미지가 없거나 랜덤 선택이 발생한 경우)
  const randomIndex = getHashFromId(courseId);
  return safeImageAccess(allImages[randomIndex]);
};

// 이미지 로드 오류 처리 핸들러 추가
const handleImageError = (event) => {
  console.log("이미지 로드 실패, 대체 이미지 사용");
  
  // 대체 이미지를 랜덤으로 선택
  const fallbackImages = [HangangImg, SanImg, ParkImg, FlowerImg];
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  
  // 이미지 소스 업데이트
  event.target.src = fallbackImages[randomIndex];
  
  // 이벤트 핸들러 제거하여 무한 루프 방지
  event.target.onerror = null;
};

// Supabase에서 코스 데이터 가져오기
const fetchCourses = async (emotion = 'all', lat, lng, distance = 5) => {
  try {
    console.log(`코스 데이터 가져오기 시작: 감정=${emotion}, 위치=(${lat}, ${lng}), 거리=${distance}km`);
    
    // DB_ONLY 모드가 아니고, 현재 월이 1, 2, 3, 4월인 경우 하드코딩된 데이터 사용
    if (!USE_DB_ONLY && currentMonth >= 1 && currentMonth <= 4) {
      console.log(`${currentMonth}월 하드코딩된 데이터 사용`);
      
      // 해당 월의 하드코딩된 코스 데이터 가져오기
      let filteredCourses = hardcodedMonthCourses[currentMonth] || [];
      console.log(`${currentMonth}월 하드코딩된 코스 데이터 수: ${filteredCourses.length}개`);
      
      // 어댑터 적용: 하드코딩 데이터에 emotion_id 추가
      filteredCourses = filteredCourses.map(adaptHardcodedCourse);
      console.log('하드코딩된 데이터 적용 후:', JSON.stringify(filteredCourses[0], null, 2));
      
      // 감정 필터링
      if (emotion !== 'all') {
        // emotion_id 기반 필터링 (DB 스타일)
        const emotionId = getEmotionIdByName(emotion);
        if (emotionId) {
          filteredCourses = filteredCourses.filter(course => course.emotion_id === emotionId);
          console.log(`감정 ID 필터(${emotionId}) 적용 후 코스 수: ${filteredCourses.length}개`);
        } else {
          // 이전 방식 호환성 유지 (emotion 필드 기반)
          filteredCourses = filteredCourses.filter(course => course.emotion === emotion);
          console.log(`감정 필터(${emotion}) 적용 후 코스 수: ${filteredCourses.length}개`);
        }
      }
      
      // 거리 필터링 (현재 위치에서 시작점까지의 거리 계산)
      if (lat && lng && distance) {
        filteredCourses = filteredCourses.filter(course => {
          // 현재 위치와 코스 시작점 사이의 거리 계산
          const courseDistance = calculateDistance(
            { lat, lng },
            { lat: course.lat_start, lng: course.lng_start }
          );
          return courseDistance <= distance;
        });
        console.log(`거리 필터(${distance}km) 적용 후 코스 수: ${filteredCourses.length}개`);
      }
      
      console.log(`${currentMonth}월 데이터 중 ${filteredCourses.length}개의 코스 반환`);
      return filteredCourses;
    }
    
    // 1~4월이 아니거나 DB_ONLY 모드인 경우 Supabase에서 데이터 가져오기
    if (emotion === 'all') {
      // 모든 감정 데이터 가져오기
      console.log('모든 감정 데이터 요청 중...');
      
      // RPC 대신 직접 테이블 쿼리 사용
      const { data, error } = await supabase
        .from('emotion_courses')
        .select('*');
      
      if (error) {
        console.error('모든 코스 데이터 가져오기 실패:', error);
        throw error;
      }
      
      let filteredCourses = data || [];
      
      // 거리 필터링 (DB에서 거리 계산이 안 될 경우 클라이언트에서 수행)
      if (lat && lng && distance && filteredCourses.length > 0) {
        filteredCourses = filteredCourses.filter(course => {
          // 현재 위치와 코스 시작점 사이의 거리 계산
          const courseDistance = calculateDistance(
            { lat, lng },
            { lat: course.lat_start, lng: course.lng_start }
          );
          return courseDistance <= distance;
        });
      }
      
      console.log(`총 ${filteredCourses.length || 0}개의 코스 데이터를 가져왔습니다.`);
      return filteredCourses;
    } else {
      // 특정 감정 데이터 가져오기
      console.log(`${emotion} 감정의 코스 데이터 요청 중...`);
      const data = await getCoursesByEmotion(emotion, lat, lng, distance);
      console.log(`총 ${data?.length || 0}개의 ${emotion} 감정 코스 데이터를 가져왔습니다.`);
      return data || [];
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    // 에러가 발생했을 때 빈 배열 반환
    return [];
  }
};

// 날씨 정보 가져오기 함수
const fetchWeatherData = async (lat, lng) => {
  try {
    console.log(`날씨 정보 가져오기: 위치=(${lat}, ${lng})`);
    // CORS 이슈를 피하기 위해 CORS 프록시 사용
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}&lang=kr`;
    // 개발 환경인 경우 CORS 프록시 사용
    const proxyUrl = process.env.NODE_ENV === 'development' 
      ? `https://corsproxy.io/?${encodeURIComponent(url)}`
      : url;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('날씨 정보를 가져오는데 실패했습니다');
    }
    
    const data = await response.json();
    console.log('날씨 데이터 수신 성공:', data.weather[0].description);
    return data;
  } catch (error) {
    console.error('날씨 API 호출 중 오류:', error);
    return null;
  }
};

// 미세먼지 정보 가져오기 함수
const fetchAirPollutionData = async (lat, lng) => {
  try {
    console.log(`미세먼지 정보 가져오기: 위치=(${lat}, ${lng})`);
    // CORS 이슈를 피하기 위해 CORS 프록시 사용
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}`;
    // 개발 환경인 경우 CORS 프록시 사용
    const proxyUrl = process.env.NODE_ENV === 'development' 
      ? `https://corsproxy.io/?${encodeURIComponent(url)}`
      : url;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('미세먼지 정보를 가져오는데 실패했습니다');
    }
    
    const data = await response.json();
    
    // AQI 값 확인 및 로깅
    const aqi = data.list[0].main.aqi;
    console.log(`미세먼지 데이터 수신 성공: AQI=${aqi} (${getAqiText(aqi)})`);
    
    return data;
  } catch (error) {
    console.error('미세먼지 API 호출 중 오류:', error);
    return null;
  }
};

// 미세먼지 AQI에 따른 색상 반환
const getAqiColor = (aqi) => {
  switch(aqi) {
    case 1: return '#9ed8d5'; // 좋음
    case 2: return '#7dd6a0'; // 보통
    case 3: return '#ffc285'; // 보통
    case 4: return '#ff8a7a'; // 나쁨
    case 5: return '#d81159'; // 매우 나쁨
    default: return '#a1d6f7'; // 정보 없음
  }
};

// 미세먼지 AQI에 따른 텍스트 반환
const getAqiText = (aqi) => {
  switch(aqi) {
    case 1: return '좋음';
    case 2: return '보통';
    case 3: return '보통';
    case 4: return '나쁨';
    case 5: return '매우 나쁨';
    default: return '정보 없음';
  }
};

// 날씨 아이콘 URL 생성
const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return 'https://openweathermap.org/img/wn/01d@2x.png'; // 기본 아이콘
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// 지도에 마커 추가 함수 - 먼저 선언되도록 위치 이동
const addMarkersToMap = (coursesToShow, kakaoMapRef, markersRef, emotions) => {
  if (!kakaoMapRef.current || !window.kakao || !window.kakao.maps) {
    console.error("마커 추가 실패: 카카오맵이 초기화되지 않았습니다.");
    return;
  }
  
  try {
    const bounds = new window.kakao.maps.LatLngBounds();
    
    coursesToShow.forEach(course => {
      // emotion_id 또는 emotion 사용 (두 필드 중 하나 선택)
      const emotionIdentifier = course.emotion_id || course.emotion || 'default';
      
      try {
        // 위치 정보가 없을 경우 lat_start, lng_start 값을 사용하여 위치 설정
        const location = course.location || {
          lat: course.lat_start || 37.5642, // 기본값 서울 중심
          lng: course.lng_start || 127.0016
        };
          
        const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
      
        // 마커 이미지 대신 더 심플하고 미적인 커스텀 오버레이 사용
        const content = document.createElement('div');
        // 심플한 원형 디자인으로 변경
        content.className = `w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110`;
        content.style.background = getEmotionColor(emotionIdentifier); // 감정별 색상 적용
        content.style.border = '2px solid white';
        content.style.transition = 'all 0.2s ease';
      
        // 감정별 이모지 대신 심플한 숫자나 아이콘 사용
        let markerContent = '';
        if (course.route_name) {
          // 코스명 첫 글자 사용
          markerContent = `<span style="color: white; font-size: 11px; font-weight: bold;">${course.route_name.substring(0, 1)}</span>`;
        } else {
          // 기본 아이콘 (작은 원)
          markerContent = `<div style="width: 4px; height: 4px; background: white; border-radius: 50%;"></div>`;
        }
        
        content.innerHTML = markerContent;
      
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: content,
          map: kakaoMapRef.current,
          yAnchor: 1,
          zIndex: 3 // 마커가 라인 위에 표시되도록 z-index 설정
        });
      
        // 마커에 호버 효과 추가
        content.addEventListener('mouseover', () => {
          content.style.transform = 'scale(1.2)';
          content.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
        
        content.addEventListener('mouseout', () => {
          content.style.transform = 'scale(1)';
          content.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
      
        // 클릭 이벤트 추가
        content.addEventListener('click', () => {
          // 해당 코스 카드로 스크롤
          const courseElement = document.getElementById(`course-${course.id}`);
          if (courseElement) {
            courseElement.scrollIntoView({ behavior: 'smooth' });
            // 클릭한 코스 카드 강조 효과
            courseElement.classList.add('ring-2', 'ring-purple', 'ring-offset-2');
            setTimeout(() => {
              courseElement.classList.remove('ring-2', 'ring-purple', 'ring-offset-2');
            }, 1500);
          }
        });
      
        markersRef.current.push(customOverlay);
        bounds.extend(markerPosition);
      
        // 코스 경로 표시 - DB 데이터에 path가 없으므로 출발점과 도착점으로 경로 생성
        try {
          // 경로 포인트 설정 (path가 있으면 사용, 없으면 출발점과 도착점으로 생성)
          const linePath = course.path || [
            { lat: course.lat_start, lng: course.lng_start },
            { lat: course.lat_end, lng: course.lng_end }
          ];

          // 실제 경로 생성 (최소 2개 이상의 포인트 필요)
          if (linePath && linePath.length > 1) {
            const pathPoints = linePath.map(point => 
              new window.kakao.maps.LatLng(point.lat, point.lng)
            );
          
            // 감정별 코스 색상 설정 - 더 부드럽고 미적인 색상으로 변경
            const lineColor = getEmotionColor(emotionIdentifier);
          
            const polyline = new window.kakao.maps.Polyline({
              path: pathPoints,
              strokeWeight: 3, // 선 두께 감소로 더 심플하게
              strokeColor: lineColor, // 감정별 색상 적용
              strokeOpacity: 0.7, // 투명도 조정
              strokeStyle: 'solid', // 실선 유지
              strokeLineCap: 'round', // 라인 끝부분 둥글게
              strokeLineJoin: 'round' // 꺾인 부분 둥글게
            });
          
            polyline.setMap(kakaoMapRef.current);
          }
        } catch (lineError) {
          console.error("경로 생성 오류:", lineError);
        }
      } catch (markerError) {
        console.error("마커 생성 오류:", markerError);
      }
    });
    
    // 모든 마커가 보이도록 지도 영역 설정
    // bounds가 비어있지 않은지 먼저 확인
    if (coursesToShow.length > 0 && bounds && !bounds.isEmpty()) {
      kakaoMapRef.current.setBounds(bounds);
    }
  } catch (error) {
    console.error("마커 추가 오류:", error);
  }
};

// 감정 색상 조회 함수 (emotion_id 또는 emotion 이름으로 조회)
const getEmotionColor = (emotionIdOrName) => {
  // 기본 색상 (오류 처리용)
  const defaultColor = "#777777";
  
  if (!emotionIdOrName) return defaultColor;
  
  // UUID 패턴 확인 (emotion_id인 경우)
  const isUUID = typeof emotionIdOrName === 'string' && 
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(emotionIdOrName);
  
  if (isUUID) {
    // emotion_id인 경우 해당하는 감정 이름 찾기
    const emotionName = getEmotionNameById(emotionIdOrName);
    if (!emotionName) return defaultColor;
    
    // 찾은 감정 이름으로 색상 매핑
    switch (emotionName) {
      case 'calm': return "#4A90E2";       // 고요함 - 푸른색
      case 'excitement': return "#D0021B"; // 설렘 - 빨간색
      case 'refresh': return "#7ED321";    // 상쾌함 - 초록색
      case 'joy': return "#F5A623";        // 기쁨 - 주황색
      case 'comfort': return "#9B59B6";    // 위로 - 보라색
      case 'curiosity': return "#F8E71C";  // 호기심 - 노란색
      case 'energy': return "#E74C3C";     // 활력 - 주홍색
      case 'peace': return "#3498DB";      // 평화 - 하늘색
      default: return defaultColor;
    }
  } else {
    // emotion 이름인 경우 직접 색상 매핑
    switch (emotionIdOrName) {
      case 'calm': return "#4A90E2";
      case 'excitement': return "#D0021B";
      case 'refresh': return "#7ED321";
      case 'joy': return "#F5A623";
      case 'comfort': return "#9B59B6";
      case 'curiosity': return "#F8E71C";
      case 'energy': return "#E74C3C";
      case 'peace': return "#3498DB";
      default: return defaultColor;
    }
  }
};

// 감정 라벨 조회 함수 (emotion_id 또는 emotion 이름으로 조회)
const getEmotionLabel = (emotionIdOrName, emotions) => {
  // 기본 라벨 (오류 처리용)
  const defaultLabel = "알 수 없음";
  
  if (!emotionIdOrName) return defaultLabel;
  
  // UUID 패턴 확인 (emotion_id인 경우)
  const isUUID = typeof emotionIdOrName === 'string' && 
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(emotionIdOrName);
  
  if (isUUID) {
    // emotions 배열에서 찾기
    if (emotions && emotions.length > 0) {
      const emotion = emotions.find(e => e.id === emotionIdOrName);
      if (emotion) return emotion.name_kr;
    }
    
    // emotions 배열에 없으면 미리 정의된 매핑에서 찾기
    const emotionName = getEmotionNameById(emotionIdOrName);
    if (emotionName) {
      // 영문 이름을 한글로 변환
      switch (emotionName) {
        case 'calm': return "고요함";
        case 'excitement': return "설렘";
        case 'refresh': return "상쾌함";
        case 'joy': return "기쁨";
        case 'comfort': return "위로";
        case 'curiosity': return "호기심";
        case 'energy': return "활력";
        case 'peace': return "평화";
        default: return defaultLabel;
      }
    }
  } else {
    // emotion 이름인 경우 직접 한글로 변환
    switch (emotionIdOrName) {
      case 'calm': return "고요함";
      case 'excitement': return "설렘";
      case 'refresh': return "상쾌함";
      case 'joy': return "기쁨";
      case 'comfort': return "위로";
      case 'curiosity': return "호기심";
      case 'energy': return "활력";
      case 'peace': return "평화";
      default: return defaultLabel;
    }
  }
  
  return defaultLabel;
};

// 인기 라이딩 코스 하드코딩 (3개)
const popularCourses = useMemo(() => [
  {
    id: 'popular-1',
    title: '한강 자전거 도로',
    description: '서울의 대표적인 라이딩 코스로, 한강을 따라 이어지는 아름다운 라이딩 경로입니다. 시원한 강바람과 함께 도심 속 여유를 만끽해보세요.',
    distance: '8.5km',
    location: '서울시 마포구',
    emotion: 'refresh',
    image: HangangImg
  },
  {
    id: 'popular-2',
    title: '북한산 둘레길',
    description: '북한산의 아름다운 자연 경관을 감상할 수 있는 코스로, 산림욕과 함께 건강한 라이딩을 즐길 수 있습니다.',
    distance: '5.2km',
    location: '서울시 은평구',
    emotion: 'peace',
    image: SanImg
  },
  {
    id: 'popular-3',
    title: '양재천 꽃길',
    description: '도심 속 작은 휴식처, 양재천을 따라 이어지는 꽃길 코스입니다. 계절마다 다른 꽃들로 화사한 풍경을 즐길 수 있습니다.',
    distance: '4.7km',
    location: '서울시 강남구',
    emotion: 'joy',
    image: FlowerImg
  }
], [HangangImg, SanImg, FlowerImg]);

const EmotionMapSection = ({ selectedEmotions }) => {
  // 감정별 코스 데이터
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [userLocation, setUserLocation] = useState(null); // 사용자 위치
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [scriptLoaded] = useState(false);
  const [coursesData, setCoursesData] = useState([]); // Supabase에서 불러온 코스 데이터
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [weatherData, setWeatherData] = useState({}); // 코스별 날씨 데이터
  const [airPollutionData, setAirPollutionData] = useState({}); // 코스별 미세먼지 데이터
  const [selectedCourse, setSelectedCourse] = useState(null); // 선택된 코스
  // 자전거 도로 레이어 상태 관리
  const [bikeLayerVisible, setBikeLayerVisible] = useState(false);
  // 현재 지도 범위 내 코스만 보기 상태
  const [showCoursesInMapBounds, setShowCoursesInMapBounds] = useState(false);
  // 현재 지도 경계 상태
  const [mapBounds, setMapBounds] = useState(null);
  // 팝업 표시 여부
  const [showPopup, setShowPopup] = useState(false);
  // 팝업에 표시할 코스 정보
  const [popupCourse, setPopupCourse] = useState(null);
  
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const markersRef = useRef([]);
  const bikeLayerRef = useRef(null); // 자전거 도로 레이어 참조

  // 감정 필터 데이터
  const emotions = useMemo(() => [
    { id: 'all', label: '전체', color: 'bg-gray-lighter' },
    { id: 'calm', label: '고요함', color: 'bg-mint' },
    { id: 'excitement', label: '설렘', color: 'bg-pink' },
    { id: 'comfort', label: '위로', color: 'bg-purple' },
    { id: 'joy', label: '기쁨', color: 'bg-purple-light' },
    { id: 'refresh', label: '리프레시', color: 'bg-green-500' },
    { id: 'curiosity', label: '호기심', color: 'bg-amber-400' },
    { id: 'energy', label: '활력', color: 'bg-red-500' },
    { id: 'peace', label: '평화', color: 'bg-blue-300' }
  ], []);

  // 기본 거리값 설정 (거리 필터 옵션 삭제)
  const defaultDistance = 5; // 5km로 고정

  // 인기 코스 - Supabase에서 가져온 데이터에서 첫 3개를 사용
  const popularCourses = useMemo(() => {
    // 데이터가 있을 경우 처음 3개만 사용
    return coursesData.slice(0, 3);
  }, [coursesData]);

  // 부모 컴포넌트에서 전달된 감정 데이터 처리
  useEffect(() => {
    if (selectedEmotions && selectedEmotions.length > 0) {
      console.log('상위 컴포넌트에서 전달받은 감정:', selectedEmotions);
      
      // 첫 번째 감정을 사용하여 코스 필터링
      const firstEmotion = selectedEmotions[0]?.emotion;
      if (firstEmotion && firstEmotion !== selectedEmotion) {
        console.log(`감정 선택 필터 '${firstEmotion}'으로 변경`);
        setSelectedEmotion(firstEmotion);
      }
    }
  }, [selectedEmotions, selectedEmotion]);

  // 자전거 도로 레이어 토글 함수
  const toggleBikeLayer = useCallback(() => {
    if (!kakaoMapRef.current || !window.kakao || !window.kakao.maps) {
      console.error("카카오맵이 초기화되지 않았습니다.");
      return;
    }
    
    try {
      // 레이어가 없으면 생성
      if (!bikeLayerRef.current) {
        bikeLayerRef.current = new window.kakao.maps.BikeLayer();
      }
      
      // 토글 상태에 따라 레이어 표시/숨김
      if (bikeLayerVisible) {
        bikeLayerRef.current.setMap(null);
      } else {
        bikeLayerRef.current.setMap(kakaoMapRef.current);
      }
      
      // 상태 업데이트
      setBikeLayerVisible(prev => !prev);
      console.log(`자전거 도로 레이어 ${bikeLayerVisible ? '숨김' : '표시'}`);
    } catch (error) {
      console.error("자전거 도로 레이어 토글 오류:", error);
    }
  }, [bikeLayerVisible]);
  
  // 지도 범위 내 코스 필터링 함수
  const toggleCoursesInMapBounds = useCallback(() => {
    if (!kakaoMapRef.current) {
      console.error("카카오맵이 초기화되지 않았습니다.");
      return;
    }
    
    // 상태 토글
    setShowCoursesInMapBounds(prev => !prev);
    
    // 현재 지도 영역 가져오기
    if (!showCoursesInMapBounds) {
      try {
        const bounds = kakaoMapRef.current.getBounds();
        setMapBounds(bounds);
        
        // 지도 영역이 변경될 때마다 바운드 업데이트
        window.kakao.maps.event.addListener(
          kakaoMapRef.current, 
          'bounds_changed', 
          function() {
            setMapBounds(kakaoMapRef.current.getBounds());
          }
        );
        
        console.log("지도 범위 내 코스 필터링 활성화");
      } catch (error) {
        console.error("지도 범위 가져오기 오류:", error);
      }
    } else {
      console.log("모든 코스 표시");
    }
  }, [showCoursesInMapBounds]);
  
  // 현재 맵 범위에 있는 코스만 필터링하는 함수
  const filterCoursesByMapBounds = useCallback((courses) => {
    if (!showCoursesInMapBounds || !mapBounds || !window.kakao || !window.kakao.maps) {
      return courses; // 필터링 비활성화 시 모든 코스 반환
    }
    
    return courses.filter(course => {
      // 코스의 시작점 LatLng 객체 생성
      const coursePoint = new window.kakao.maps.LatLng(
        course.lat_start || 37.5145, // 기본값 송파구 중심
        course.lng_start || 127.1007
      );
      
      // 현재 맵 범위에 포함되는지 확인
      return mapBounds.contain(coursePoint);
    });
  }, [showCoursesInMapBounds, mapBounds]);

  // 필터링된 코스 - 통합 버전
  const filteredCourses = useMemo(() => {
    // 기본 감정 필터링된 코스
    const emotionFilteredCourses = coursesData.filter(course => {
      if (selectedEmotion === 'all') return true;
      
      // emotion_id로 필터링 (DB 데이터)
      if (course.emotion_id) {
        const emotionUUID = getEmotionIdByName(selectedEmotion);
        console.log(`감정 비교: ${selectedEmotion} (ID: ${emotionUUID}) vs 코스 감정 ID: ${course.emotion_id}`);
        if (emotionUUID && course.emotion_id === emotionUUID) return true;
      }
      
      // 하위 호환성: emotion으로 필터링 (하드코딩 데이터)
      if (course.emotion && course.emotion.toLowerCase() === selectedEmotion.toLowerCase()) {
        return true;
      }
      
      return false;
    });
    
    // 필요시 지도 범위로 추가 필터링
    return filterCoursesByMapBounds(emotionFilteredCourses);
  }, [coursesData, selectedEmotion, filterCoursesByMapBounds]);

  // 지도 범위가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (kakaoMapRef.current && mapLoaded && showCoursesInMapBounds) {
      // 기존 마커 제거
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
      
      // 필터링된 마커 추가
      addMarkersToMap(filteredCourses, kakaoMapRef, markersRef, emotions);
    }
  }, [mapBounds, showCoursesInMapBounds, filteredCourses, mapLoaded, emotions]);

  // 감정 필터 변경 시 마커 업데이트
  useEffect(() => {
    if (kakaoMapRef.current && mapLoaded) {
      // 기존 마커 제거
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
      
      // 필터링된 마커 추가
      addMarkersToMap(filteredCourses, kakaoMapRef, markersRef, emotions);
    }
  }, [selectedEmotion, filteredCourses, mapLoaded, emotions]);

  // 카카오맵 초기화 (단순화된 버전)
  useEffect(() => {
    if (!mapRef.current || kakaoMapRef.current) return;

    // 카카오맵 API가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.error("카카오맵 API가 로드되지 않았습니다.");
      setMapError(true);
      return;
    }

    try {
      // 지도 생성
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 기본 위치
        level: 6
      };
      
      const map = new window.kakao.maps.Map(mapRef.current, options);
      kakaoMapRef.current = map;
      
      // 지도 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      
      setMapLoaded(true);
      console.log("카카오맵이 성공적으로 로드되었습니다.");
      
      // 사용자 위치 요청
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          { enableHighAccuracy: true }
        );
      } else {
        console.log("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      }
    } catch (error) {
      console.error("카카오맵 초기화 오류:", error);
      setMapError(true);
    }
  }, []);

  // 현재 위치 가져오기
  useEffect(() => {
    // 위치 정보 가져오기 실패 시 기본 위치
    const defaultLocation = { lat: 37.5145, lng: 127.1007 }; // 송파구 좌표
    
    // 위치 정보 접근 오류 처리 함수
    const handleLocationError = (error) => {
      console.error("위치 정보 가져오기 오류:", error.message);
      
      // 기본 위치(송파구) 설정
      setUserLocation(defaultLocation);
      
      // 오류 타입별 처리
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.log("위치 정보 접근 권한이 거부되었습니다. HTTP 환경이나 권한 설정을 확인하세요.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.log("위치 정보를 사용할 수 없습니다.");
          break;
        case error.TIMEOUT:
          console.log("위치 정보 요청 시간이 초과되었습니다.");
          break;
        case error.UNKNOWN_ERROR:
        default:
          console.log("알 수 없는 위치 정보 오류가 발생했습니다.");
          break;
      }
    };
    
    // 위치 정보 접근 성공 처리 함수
    const handleLocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`현재 위치 가져오기 성공: 위도(${latitude}), 경도(${longitude})`);
      setUserLocation({ lat: latitude, lng: longitude });
    };
    
    // 프로토콜이 http인 경우 보안 제약으로 geolocation API 접근이 제한될 수 있음
    const isHttpProtocol = typeof window !== 'undefined' && window.location.protocol === 'http:';
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
    
    // 로컬호스트는 http에서도 위치 정보 접근 가능
    if (isHttpProtocol && !isLocalhost) {
      console.log("HTTP 환경에서는 위치 정보 접근이 제한될 수 있습니다. 기본 위치(송파구)를 사용합니다.");
      setUserLocation(defaultLocation);
    } else if (navigator.geolocation) {
      try {
        console.log("위치 정보 요청 중...");
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
          }
        );
      } catch (err) {
        console.error("위치 정보 요청 예외 발생:", err);
        setUserLocation(defaultLocation);
      }
    } else {
      console.log("이 브라우저에서는 위치 정보 기능을 지원하지 않습니다. 기본 위치(송파구)를 사용합니다.");
      setUserLocation(defaultLocation);
    }
  }, []);

  // 코스 데이터 로드 함수 선언을 이벤트 리스너보다 먼저 정의
  const loadCourses = useCallback(async () => {
    if (!userLocation) return;
    
    setIsLoading(true);
    try {
      const data = await fetchCourses(
        selectedEmotion, 
        userLocation.lat, 
        userLocation.lng, 
        defaultDistance
      );
      
      if (data && data.length > 0) {
        setCoursesData(data);
        
        // 기존 마커 제거
        if (markersRef.current.length > 0) {
          markersRef.current.forEach(marker => {
            marker.setMap(null);
          });
          markersRef.current = [];
        }
        
        // 새 마커 추가
        if (kakaoMapRef.current && mapLoaded) {
          addMarkersToMap(data, kakaoMapRef, markersRef, emotions);
        }
      } else {
        console.log('서버에서 코스 데이터를 가져오지 못했습니다.');
        setCoursesData([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCoursesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedEmotion, defaultDistance, userLocation, mapLoaded, emotions]);

  // 외부 이벤트에 의한 데이터 로드 트리거
  useEffect(() => {
    // 추천 코스 버튼 클릭 이벤트 리스너
    const handleLoadCourseData = (event) => {
      console.log("loadCourseData 이벤트 감지됨:", event.detail);
      
      // 전달받은 감정 데이터가 있으면 적용
      if (event.detail && event.detail.emotions && event.detail.emotions.length > 0) {
        // 첫 번째 감정으로 필터링
        const firstEmotion = event.detail.emotions[0]?.emotion;
        if (firstEmotion) {
          console.log(`이벤트로부터 감정 필터 설정: ${firstEmotion}`);
          setSelectedEmotion(firstEmotion);
          
          // 감정 변경 후 즉시 코스 데이터 로드
          setTimeout(() => {
            if (userLocation) {
              console.log("이벤트에 의한 코스 데이터 로드 시작");
              loadCourses();
            }
          }, 300);
        }
      }
    };

    // 이벤트 리스너 등록 - 두 가지 방식 모두 지원
    document.addEventListener('loadCourseData', handleLoadCourseData);
    window.addEventListener('loadCourseData', handleLoadCourseData);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('loadCourseData', handleLoadCourseData);
      window.removeEventListener('loadCourseData', handleLoadCourseData);
    };
  }, [userLocation, loadCourses]);

  // 기존 useEffect에서는 loadCourses 함수를 직접 호출하지 않고 loadCourses 함수를 사용하도록 수정
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // 코스 데이터 로드 시 날씨 정보도 같이 가져오기
  useEffect(() => {
    const loadWeatherForCourses = async () => {
      if (coursesData.length === 0) return;

      const weatherPromises = coursesData.map(course => 
        fetchWeatherData(course.lat_start, course.lng_start)
      );
      
      const airPollutionPromises = coursesData.map(course => 
        fetchAirPollutionData(course.lat_start, course.lng_start)
      );
      
      try {
        const weatherResults = await Promise.all(weatherPromises);
        const airPollutionResults = await Promise.all(airPollutionPromises);
        
        // 코스 ID를 키로 하는 날씨 데이터 객체 생성
        const weatherObj = {};
        coursesData.forEach((course, index) => {
          if (weatherResults[index]) {
            weatherObj[course.id] = weatherResults[index];
          }
        });
        
        // 코스 ID를 키로 하는 미세먼지 데이터 객체 생성
        const airPollutionObj = {};
        coursesData.forEach((course, index) => {
          if (airPollutionResults[index]) {
            airPollutionObj[course.id] = airPollutionResults[index];
          }
        });
        
        setWeatherData(weatherObj);
        setAirPollutionData(airPollutionObj);
      } catch (error) {
        console.error('날씨 및 미세먼지 데이터 로드 실패:', error);
      }
    };
    
    loadWeatherForCourses();
  }, [coursesData]);

  // 코스 클릭 핸들러 함수
  const handleCourseClick = (course) => {
    if (!course) return;
    
    // 선택된 코스 업데이트
    setSelectedCourse(course);
    
    // 팝업에 표시할 코스 정보 설정
    setPopupCourse(course);
    setShowPopup(true);
    
    // 지도에서 해당 코스 위치로 이동
    if (kakaoMapRef.current && course.lat_start && course.lng_start) {
      const moveLatLng = new window.kakao.maps.LatLng(course.lat_start, course.lng_start);
      kakaoMapRef.current.setCenter(moveLatLng);
      kakaoMapRef.current.setLevel(3); // 지도 줌 레벨 설정
    }
  };
  
  // 팝업 닫기 함수
  const closePopup = () => {
    setShowPopup(false);
    setPopupCourse(null);
  };

  return (
    <section className="py-20 bg-light" id="courses">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-scdream font-bold text-text">감정별 자전거 코스</h2>
          <p className="text-gray-lighter mt-4 max-w-2xl mx-auto">
            당신의 감정에 맞춘 최적의 자전거 코스를 추천해드립니다
          </p>
          
          {/* 검색 기준 정보 추가 */}
          {userLocation && (
            <div className="mt-2 text-sm text-purple">
              <span>현재 위치에서 {defaultDistance}km 이내의 코스를 우선 검색합니다</span>
            </div>
          )}
          
          {/* 현재 날씨 정보 (심플하게 표시) */}
          {userLocation && (
            <div className="mt-4 inline-flex items-center justify-center bg-white/90 px-4 py-2 rounded-full shadow-sm">
              {isLoading ? (
                <div className="animate-pulse flex items-center">
                  <div className="h-6 w-6 bg-gray-200 rounded-full mr-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mr-3">
                    <div className="text-sm font-medium text-gray-600">현재 날씨:</div>
                    {Object.keys(weatherData).length > 0 ? (
                      <div className="flex items-center ml-2">
                        <img 
                          src={getWeatherIconUrl(Object.values(weatherData)[0]?.weather[0].icon)} 
                          alt="날씨" 
                          className="w-8 h-8"
                        />
                        <span className="ml-1 text-sm font-medium">
                          {Object.values(weatherData)[0]?.main.temp.toFixed(1)}°C
                        </span>
                        <span className="ml-1 text-xs text-gray-600">
                          {Object.values(weatherData)[0]?.weather[0].description}
                        </span>
                      </div>
                    ) : (
                      <span className="ml-2 text-sm text-gray-500">정보 로딩 중...</span>
                    )}
                  </div>
                  
                  {Object.keys(airPollutionData).length > 0 && (
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-600">미세먼지:</div>
                      <div 
                        className="ml-2 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: getAqiColor(Object.values(airPollutionData)[0]?.list[0].main.aqi) }}
                      >
                        {Object.values(airPollutionData)[0]?.list[0].main.aqi}
                      </div>
                      <span className="ml-1 text-xs">
                        {getAqiText(Object.values(airPollutionData)[0]?.list[0].main.aqi)}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* 필터 컨트롤 */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {/* 감정 필터 */}
            <div className="bg-white shadow-sm rounded-full p-1 flex">
              {emotions.map(emotion => (
                <button
                  key={emotion.id}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedEmotion === emotion.id
                      ? `${emotion.color} text-white`
                      : 'text-gray-lighter hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedEmotion(emotion.id)}
                >
                  {emotion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 지도 컨트롤 버튼 추가 */}
        <div className="mb-4 flex flex-wrap gap-3 justify-center">
          <button
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              bikeLayerVisible 
                ? 'bg-purple text-white' 
                : 'bg-white text-purple border border-purple hover:bg-purple/10'
            }`}
            onClick={toggleBikeLayer}
          >
            {bikeLayerVisible ? '자전거 도로 숨기기' : '자전거 도로 보기'}
          </button>
          
          <button
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              showCoursesInMapBounds 
                ? 'bg-purple text-white' 
                : 'bg-white text-purple border border-purple hover:bg-purple/10'
            }`}
            onClick={toggleCoursesInMapBounds}
          >
            {showCoursesInMapBounds ? '모든 코스 보기' : '현재 지도에서 검색'}
          </button>
          
          <button
            className="px-4 py-2 rounded-full text-sm transition-colors bg-white text-purple border border-purple hover:bg-purple/10"
            onClick={() => {
              if (kakaoMapRef.current) {
                // 지도 확대 레벨 조정해서 더 넓은 범위 보기
                let newLevel = kakaoMapRef.current.getLevel() + 2;
                kakaoMapRef.current.setLevel(newLevel > 14 ? 14 : newLevel);
                
                // 5초 후 자동으로 검색 결과 업데이트 알림
                if (!showCoursesInMapBounds) {
                  setTimeout(() => {
                    setShowCoursesInMapBounds(true);
                  }, 500);
                }
              }
            }}
          >
            검색 범위 확장하기
          </button>
        </div>

        {/* 5km 이내 검색 강조 메시지 */}
        <div className="mb-6 text-center">
          <div className="inline-block bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            <span className="font-bold">현재 위치</span>에서 
            <span className="font-bold text-purple mx-1">{defaultDistance}km</span> 
            이내의 코스를 찾고 있습니다. 
            <span className="block mt-1 text-xs text-gray-500">
              더 먼 코스를 찾으려면 '검색 범위 확장하기'를 클릭하세요.
            </span>
          </div>
        </div>
        
        {/* 지도 컨테이너 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* 지도 */}
          <motion.div 
            className="w-full lg:w-2/3 h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-md relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {(!mapLoaded || !scriptLoaded) && !mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-purple/50 border-t-purple rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-lighter">지도를 불러오는 중...</p>
                </div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-12 h-12 text-red-500 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">지도 로드 실패</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    현재 카카오맵 서비스에 연결할 수 없습니다.<br/>
                    잠시 후 다시 시도해 주세요.
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    새로고침
                  </button>
                </div>
              </div>
            )}
            
            {/* 지도 범위 내 코스 필터링 알림 */}
            {showCoursesInMapBounds && mapLoaded && (
              <div className="absolute top-3 left-3 right-3 z-30 bg-purple/90 text-white text-sm px-4 py-2 rounded-lg shadow-md">
                <p>현재 지도 영역 내 코스만 표시 중입니다. 지도를 이동하거나 확대/축소하여 더 많은 코스를 찾아보세요.</p>
              </div>
            )}
            
            <div 
              ref={mapRef} 
              id="kakao-map"
              className="w-full h-full absolute top-0 left-0 z-10"
            ></div>
          </motion.div>

          {/* 추천 코스 목록 - 사진 삭제하고 간결한 디자인으로 변경 */}
          <motion.div 
            className="w-full lg:w-1/3 overflow-y-auto h-[500px] pr-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-scdream font-bold text-text mb-4">
              추천 코스
              {showCoursesInMapBounds && (
                <span className="ml-2 text-sm font-normal text-purple">(현재 지도 영역 내)</span>
              )}
            </h3>
            
            <div className="space-y-4" id="course-list">
              {isLoading ? (
                // 로딩 상태 표시
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
                </div>
              ) : filteredCourses.length > 0 ? (
                // 코스 데이터 표시 - 사진 없는 간결한 카드
                <div className="grid grid-cols-1 gap-3">
                  {filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      id={`course-${course.id}`}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all ${selectedCourse?.id === course.id ? 'ring-2 ring-purple ring-offset-2' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-md font-scdream font-medium text-text">{course.route_name}</h3>
                          <div className={`text-xs font-medium px-2 py-1 ${course.distance_km <= 2 ? 'bg-green-500 text-white' : course.distance_km <= 5 ? 'bg-purple text-white' : 'bg-amber-400 text-white'} rounded-full`}>
                            {course.distance_km ? course.distance_km.toFixed(1) : '0.0'}km
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getEmotionColor(course.emotion_id || course.emotion) }}></span>
                            <span className="text-xs text-gray-600">{getEmotionLabel(course.emotion_id || course.emotion, emotions)}</span>
                          </div>
                          <div className="text-xs text-gray-600 flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" size={12} />
                            <span>{course.city} {course.district}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // 데이터가 없을 때 표시 (개선된 메시지)
                <div className="py-20 text-center">
                  {showCoursesInMapBounds ? (
                    <div>
                      <p className="text-gray-lighter">현재 지도 영역에서 코스를 찾을 수 없습니다.</p>
                      <p className="mt-2 text-sm text-purple">지도를 이동하거나 확대/축소하여 다른 지역의 코스를 찾아보세요.</p>
                      <button 
                        className="mt-4 px-6 py-2 bg-purple text-white rounded-full text-sm shadow-sm"
                        onClick={() => setShowCoursesInMapBounds(false)}
                      >
                        모든 코스 보기
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-lighter mb-2">선택한 감정 '{getEmotionLabel(selectedEmotion, emotions)}'에 맞는 코스를 찾을 수 없습니다.</p>
                      <p className="text-sm text-purple mb-4">현재 위치에서 {defaultDistance}km 내에 해당 감정의 코스가 없습니다.</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button 
                          className="px-6 py-2 bg-purple text-white rounded-full text-sm shadow-sm"
                          onClick={() => {
                            setSelectedEmotion('all');
                          }}
                        >
                          모든 감정 코스 보기
                        </button>
                        <button 
                          className="px-6 py-2 border border-purple text-purple bg-white rounded-full text-sm shadow-sm hover:bg-purple/10"
                          onClick={() => {
                            if (kakaoMapRef.current) {
                              // 지도 확대 레벨 조정하여 더 넓은 범위 보기
                              let newLevel = kakaoMapRef.current.getLevel() + 2;
                              kakaoMapRef.current.setLevel(newLevel > 14 ? 14 : newLevel);
                              
                              // 자동으로 지도 범위 내 코스 검색 활성화
                              setTimeout(() => {
                                setShowCoursesInMapBounds(true);
                              }, 500);
                            }
                          }}
                        >
                          검색 범위 확장하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* 코스 상세 팝업 */}
        {showPopup && popupCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col">
              {/* 팝업 헤더 */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={getImageForCourse(popupCourse.id, popupCourse.emotion)} 
                  alt={popupCourse.route_name} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-0 right-0 p-2">
                  <button 
                    onClick={closePopup}
                    className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h2 className="text-white text-xl font-bold">{popupCourse.route_name}</h2>
                </div>
              </div>
              
              {/* 팝업 내용 */}
              <div className="p-5 overflow-y-auto">
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getEmotionColor(popupCourse.emotion_id || popupCourse.emotion) }}></span>
                    <span>{getEmotionLabel(popupCourse.emotion_id || popupCourse.emotion, emotions)}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <FaBiking className="mr-1" />
                    <span>{popupCourse.distance_km ? popupCourse.distance_km.toFixed(1) : '0.0'}km</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">코스 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">위치</p>
                    <p className="font-medium">{popupCourse.city} {popupCourse.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">출발점</p>
                    <p className="font-medium">{popupCourse.start_point}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">도착점</p>
                    <p className="font-medium">{popupCourse.end_point || '정보 없음'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">코스 유형</p>
                    <p className="font-medium">{getEmotionLabel(popupCourse.emotion_id || popupCourse.emotion, emotions)} 추천 코스</p>
                  </div>
                </div>
                
                {weatherData[popupCourse.id] && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">현재 날씨</h3>
                    <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <img 
                        src={getWeatherIconUrl(weatherData[popupCourse.id].weather[0].icon)} 
                        alt={weatherData[popupCourse.id].weather[0].description}
                        className="w-16 h-16 mr-3"
                      />
                      <div>
                        <p className="text-xl font-bold">{Math.round(weatherData[popupCourse.id].main.temp)}°C</p>
                        <p className="text-gray-600">{weatherData[popupCourse.id].weather[0].description}</p>
                        <p className="text-sm text-gray-500">
                          습도: {weatherData[popupCourse.id].main.humidity}% • 
                          바람: {Math.round(weatherData[popupCourse.id].wind.speed * 3.6)}km/h
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 팝업 푸터 */}
              <div className="bg-gray-50 p-4 flex justify-end">
                <button 
                  className="bg-purple text-white px-6 py-2 rounded-full shadow-sm hover:bg-purple-700 transition-colors"
                  onClick={closePopup}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 인기 라이딩 코스 섹션 (하드코딩 데이터 사용) */}
        <div className="mt-20">
          <h3 className="text-2xl font-scdream font-bold text-text mb-6 text-center">인기 라이딩 코스</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularCourses.map((course, index) => (
              <motion.div
                key={`popular-${index}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="relative h-48">
                  <img 
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                    <FaBiking className="inline mr-1 text-purple" />
                    {course.distance}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-text mb-2">{course.title}</h4>
                  <p className="text-xs text-gray-lighter mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{course.location}</span>
                    <div className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: getEmotionColor(course.emotion) }}></span>
                      <span>{getEmotionLabel(course.emotion, emotions)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionMapSection;