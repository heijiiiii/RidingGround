import { supabase } from './supabaseClient';

/**
 * 감정 리스트 가져오기
 */
export async function getEmotions() {
  const { data, error } = await supabase
    .from('emotions')
    .select('*')
    .order('name_kr');
  
  if (error) throw new Error(error.message);
  return data;
}

/**
 * 감정별 코스 추천 (현재 위치 기반)
 * @param {string} emotionName - 감정 이름
 * @param {number} lat - 현재 위치 위도
 * @param {number} lng - 현재 위치 경도
 * @param {number} distance - 검색 반경 (km)
 */
export async function getCoursesByEmotion(emotionName, lat, lng, distance = 5) {
  try {
    console.log(`감정별 코스 검색 시작: ${emotionName}, 위치(${lat}, ${lng}), 거리 ${distance}km`);
    
    // 감정 ID 가져오기 (이름 기반)
    const { data: emotionsData, error: emotionsError } = await supabase
      .from('emotions')
      .select('id, name_en')
      .ilike('name_en', emotionName);
    
    if (emotionsError) {
      console.error('감정 ID 조회 오류:', emotionsError);
      return [];
    }
    
    const emotionId = emotionsData && emotionsData.length > 0 ? emotionsData[0].id : null;
    
    if (!emotionId && emotionName !== 'all') {
      console.log(`'${emotionName}' 감정에 해당하는 ID를 찾을 수 없습니다.`);
    }
    
    // 감정 필터링 쿼리 준비
    let query = supabase.from('emotion_courses').select('*');
    
    // 감정 ID로 필터링 (all이 아닌 경우만)
    if (emotionId && emotionName !== 'all') {
      console.log(`감정 ID '${emotionId}'으로 필터링 적용`);
      query = query.eq('emotion_id', emotionId);
    }
    
    // 거리 제한이 있는 경우 DB 함수 호출로 변경
    if (lat && lng && distance) {
      try {
        // DB 함수가 있으면, get_all_courses_by_distance 사용 시도
        console.log(`거리 기반 검색 시도(${distance}km)`);
        const { data: distanceData, error: distanceError } = await supabase.rpc(
          'get_all_courses_by_distance',
          {
            p_lat: lat,
            p_lng: lng,
            p_distance: distance
          }
        );
        
        if (distanceError) {
          console.log('거리 함수 호출 실패, 기본 쿼리로 대체:', distanceError);
          // 실패 시 기본 쿼리 계속 사용
        } else if (distanceData) {
          console.log(`거리 기반 검색으로 ${distanceData.length}개의 코스 찾음`);
          
          // 감정 필터링 (필요한 경우)
          if (emotionId && emotionName !== 'all') {
            // 디버깅을 위한 로그 추가
            console.log(`RPC 결과에서 감정 ID '${emotionId}'로 필터링 중, 데이터 샘플:`, 
              distanceData.length > 0 ? JSON.stringify(distanceData[0], null, 2) : '데이터 없음'
            );
            
            // 대소문자와 공백을 무시한 비교를 위해 영어 이름 소문자로 변환
            const emotionNameLower = emotionName.toLowerCase().trim();
            
            const filteredByEmotion = distanceData.filter(course => {
              // emotion_id로 필터링 시도
              if (course.emotion_id && course.emotion_id === emotionId) {
                return true;
              }
              
              // emotion 필드로 필터링 시도 (하위 호환성)
              if (course.emotion && typeof course.emotion === 'string') {
                const courseEmotionLower = course.emotion.toLowerCase().trim();
                return courseEmotionLower === emotionNameLower;
              }
              
              // emotion_name_kr 필드 비교 (emotionNameKr이 있는 경우)
              if (course.emotion_name_kr && emotionsData && emotionsData.length > 0) {
                // emotionsData에서 한글 이름 가져와 비교
                const matchingEmotion = emotionsData.find(e => 
                  e.name_kr && e.name_kr.toLowerCase().trim() === course.emotion_name_kr.toLowerCase().trim()
                );
                return matchingEmotion && matchingEmotion.id === emotionId;
              }
              
              // 위의 조건 모두 해당되지 않을 경우, 감정에 해당하지 않는 것으로 판단
              return false;
            });
            
            console.log(`감정 필터링 후 ${filteredByEmotion.length}개 코스 남음`);
            
            // 만약 필터링 결과가 없지만 전체 데이터가 있는 경우, 현재 위치에서 가장 가까운 코스 5개 반환
            if (filteredByEmotion.length === 0 && distanceData.length > 0) {
              console.log(`감정 '${emotionName}'에 해당하는 코스가 없어 가까운 코스 5개를 대신 반환합니다.`);
              // 거리순 정렬 (이미 정렬되어 있을 수 있으나, 확실히 하기 위해)
              const sortedByDistance = [...distanceData].sort((a, b) => 
                (a.distance_km || Infinity) - (b.distance_km || Infinity)
              );
              return sortedByDistance.slice(0, 5);
            }
            
            return filteredByEmotion;
          }
          
          return distanceData;
        }
      } catch (rpcError) {
        console.error('거리 기반 함수 호출 오류:', rpcError);
        // 실패 시 기본 쿼리 계속 사용
      }
    }
    
    // 기본 쿼리 실행
    const { data, error } = await query;
    
    if (error) {
      console.error('코스 조회 쿼리 오류:', error);
      return [];
    }
    
    // 거리 기반 클라이언트 측 필터링
    if (lat && lng && distance && data) {
      // 클라이언트에서 거리 계산하여 필터링
      const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // 지구 반경 (km)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };
      
      const filteredByDistance = data.filter(course => {
        if (!course.lat_start || !course.lng_start) return false;
        
        const dist = calculateDistance(
          lat, lng, 
          course.lat_start, course.lng_start
        );
        return dist <= distance;
      });
      
      console.log(`거리 기반 필터링 후 ${filteredByDistance.length}개의 코스 반환`);
      return filteredByDistance;
    }
    
    console.log(`총 ${data?.length || 0}개의 코스 데이터 반환`);
    return data || [];
  } catch (error) {
    console.error('코스 데이터 조회 중 예외 발생:', error);
    return [];
  }
}

/**
 * 감정 로그 저장
 * @param {object} logData - 로그 데이터
 */
export async function saveEmotionLog(logData) {
  const { data, error } = await supabase
    .from('emotion_logs')
    .insert([logData]);
  
  if (error) throw new Error(error.message);
  return data;
}

/**
 * 사용자 감정 히스토리 가져오기
 * @param {string} userId - 사용자 ID
 */
export async function getUserEmotionHistory(userId) {
  const { data, error } = await supabase
    .from('emotion_logs')
    .select(`
      id,
      input_type,
      input_value,
      created_at,
      emotions (
        name_kr,
        emoji,
        color
      ),
      emotion_courses (
        route_name,
        city,
        district
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data;
}

/**
 * 사용자 설정 저장/업데이트
 * @param {string} userId - 사용자 ID
 * @param {object} preferences - 사용자 설정
 */
export async function saveUserPreferences(userId, preferences) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert([{
      user_id: userId,
      ...preferences,
      updated_at: new Date()
    }]);
  
  if (error) throw new Error(error.message);
  return data;
}

/**
 * 사용자 설정 가져오기
 * @param {string} userId - 사용자 ID
 */
export async function getUserPreferences(userId) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || { preferred_distance: 5 }; // 기본값 설정
}

/**
 * 한글 감정 이름으로 감정 정보 조회
 * @param {string} name_kr - 감정 한글 이름
 */
export async function getEmotionByKrName(name_kr) {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('name_kr', name_kr)
      .single();
    
    if (error) {
      console.error('감정 조회 오류:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('감정 조회 중 예외 발생:', error);
    return null;
  }
} 