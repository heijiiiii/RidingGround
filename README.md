# Riding Ground 배포 가이드

이 프로젝트는 두 가지 환경에 배포할 수 있습니다:
1. 닷홈 웹호스팅 (PHP 환경)
2. Vercel (Node.js 환경)

## 1. 닷홈 배포 방법

닷홈 배포는 PHP 환경을 활용하며, `.htaccess` 파일과 환경 변수 설정을 사용합니다.

### 빌드 방법
```bash
# 닷홈용 빌드 생성
npm run build:dothome
```

### 파일 업로드
1. `build` 폴더 내 모든 파일을 닷홈 서버에 업로드합니다.
2. `.htaccess` 파일을 업로드합니다.
3. `env-config.php` 파일이 올바르게 설정되었는지 확인합니다.

## 2. Vercel 배포 방법

Vercel 배포는 Node.js 환경을 활용하며, 환경 변수는 Vercel 대시보드에서 설정합니다.

### 배포 방법
1. Vercel CLI를 사용하는 경우:
   ```bash
   cd vercel-deploy
   vercel
   ```

2. GitHub 연동을 사용하는 경우:
   - GitHub 저장소의 `vercel-deploy` 폴더를 배포 루트로 설정합니다.
   - Framework Preset: "Create React App"
   - Root Directory: "vercel-deploy"

### 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정합니다:

- `REACT_APP_SUPABASE_URL` = "https://stvccensiwrzvgwhnfnm.supabase.co"
- `REACT_APP_SUPABASE_ANON_KEY` = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dmNjZW5zaXdyenZnd2huZm5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgzOTIyOCwiZXhwIjoyMDYyNDE1MjI4fQ.d2vGzKav_tQz_VARL_rg0GcHUZe2RAL4a8MTfjWhh9E"
- `REACT_APP_KAKAO_MAP_API_KEY` = "14f8f44a515998883eba13ef308e5bec"
- `REACT_APP_WEATHER_API_KEY` = "7f111eb21aaf2127ac1cccdd553e8ee0"

## 코드 유지보수

두 환경 간의 코드 동기화가 필요한 경우:

1. 공통 컴포넌트 수정 시 양쪽 모두 업데이트합니다.
2. 환경별 특정 기능은 조건부 코드로 처리합니다.
   ```javascript
   if (window.location.hostname.includes('vercel.app')) {
     // Vercel 환경일 때 코드
   } else {
     // 닷홈 환경일 때 코드
   }
   ```

## 주의 사항

1. `.env` 파일과 API 키는 Git에 커밋하지 않도록 주의합니다.
2. Vercel은 서버리스 환경이므로 PHP 파일을 실행할 수 없습니다.
3. 닷홈 환경에서는 `.htaccess`를 통한 환경 변수와 리다이렉트 규칙이 적용됩니다. 