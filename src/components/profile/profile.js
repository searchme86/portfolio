// /src/components/profile/profile.js

console.log('🎯 프로필 모듈 로드 완료');

// ============ PROFILE FUNCTIONALITY ============

// 프로필 초기화 함수 (현재는 정적 컨텐츠만 있어서 별도 로직 없음)
function initializeProfile() {
  console.log('✅ 프로필 컴포넌트 초기화 완료');

  // 향후 프로필 관련 기능 추가 시 여기에 구현
  // 예: 프로필 이미지 로딩, 연락처 정보 동적 로딩 등
}

// 전역으로 내보내기
window.ProfileComponent = {
  initialize: initializeProfile,
};
