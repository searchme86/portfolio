// /src/components/themeToggle/themeToggle.js

console.log('🎨 테마 토글 모듈 로드 완료');

// ============ THEME MANAGEMENT ============

function initializeThemeState() {
  const savedTheme = localStorage.getItem('github-theme') || 'light';
  const { body } = document;
  const themeToggleButton = document.getElementById('themeToggleButton');

  if (!body || !themeToggleButton) {
    console.error('⚠ 필수 DOM 요소를 찾을 수 없습니다');
    return { theme: savedTheme, isValid: false };
  }

  console.log('✅ 초기 테마 상태:', savedTheme);
  return { theme: savedTheme, isValid: true, body, themeToggleButton };
}

function updateThemeDisplay(theme, body, themeToggleButton) {
  const isDark = theme === 'dark';

  body.setAttribute('data-theme', theme);
  themeToggleButton.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  themeToggleButton.setAttribute(
    'aria-label',
    isDark ? '라이트 모드로 전환' : '다크 모드로 전환'
  );

  console.log('🎨 테마 업데이트:', theme);
}

function handleThemeToggle() {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  localStorage.setItem('github-theme', newTheme);

  const { isValid, body, themeToggleButton } = initializeThemeState();
  if (!isValid) return;

  updateThemeDisplay(newTheme, body, themeToggleButton);
  console.log('🔄 테마 전환:', currentTheme, '->', newTheme);
}

// 테마 토글 초기화 함수
function initializeThemeToggle() {
  const {
    isValid: themeValid,
    theme,
    body,
    themeToggleButton,
  } = initializeThemeState();

  if (themeValid) {
    updateThemeDisplay(theme, body, themeToggleButton);
    themeToggleButton.addEventListener('click', handleThemeToggle);
    console.log('✅ 테마 토글 초기화 완료');
  }
}

// 전역으로 내보내기
window.ThemeToggle = {
  initialize: initializeThemeToggle,
  handleToggle: handleThemeToggle,
  initializeState: initializeThemeState,
  updateDisplay: updateThemeDisplay,
};
