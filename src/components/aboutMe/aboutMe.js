// /src/components/aboutMe/aboutMe.js - 모바일 더보기 버튼 추가

window.AboutMeComponent = (function () {
  'use strict';

  let masonryInstance = null;
  let isInitialized = false;
  let currentBreakpoint = 'mobile';
  let isCollapsed = true; // 토글 상태 (기본: 축약)

  // DOM 요소들
  let contentElement = null;
  let toggleButton = null;
  let toggleText = null;
  let toggleIcon = null;
  let aboutMeSection = null;

  // 브레이크포인트 감지 함수
  const getCurrentBreakpoint = () => {
    const width = window.innerWidth;

    if (width < 480) return 'mobile';
    if (width >= 480 && width < 768) return 'mobile-large';
    if (width >= 768 && width < 1024) return 'tablet';
    if (width >= 1024) return 'desktop';

    return 'mobile';
  };

  // DOM 요소 찾기 및 캐시
  const findDOMElements = () => {
    contentElement = document.querySelector('.about-me-content');
    toggleButton = document.getElementById('aboutMeToggleButton');
    toggleText = document.querySelector('.toggle-text');
    toggleIcon = document.querySelector('.toggle-icon');
    aboutMeSection = document.querySelector('.about-me-section');

    const foundElements = {
      content: contentElement !== null,
      button: toggleButton !== null,
      text: toggleText !== null,
      icon: toggleIcon !== null,
      section: aboutMeSection !== null,
    };

    console.log('DOM 요소 찾기 결과:', foundElements);

    return contentElement !== null; // 최소한 content 요소는 있어야 함
  };

  // 스크롤 이동 함수
  const scrollToAboutMe = () => {
    if (!aboutMeSection) {
      console.warn('About Me 섹션을 찾을 수 없어 스크롤할 수 없습니다');
      return;
    }

    const offsetTop =
      aboutMeSection.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: offsetTop - 20, // 약간의 여백 추가
      behavior: 'smooth',
    });

    console.log('About Me 섹션으로 스크롤 이동');
  };

  // 토글 상태 변경
  const toggleContent = () => {
    if (!contentElement) {
      console.warn('컨텐츠 요소를 찾을 수 없어 토글할 수 없습니다');
      return;
    }

    const breakpoint = getCurrentBreakpoint();

    // 모바일(480px 미만)에서만 토글 기능 작동
    if (breakpoint !== 'mobile') {
      console.log(`${breakpoint} 모드에서는 토글 기능이 비활성화됩니다`);
      return;
    }

    const wasCollapsed = isCollapsed;
    isCollapsed = !isCollapsed;

    console.log(`토글 상태 변경: ${isCollapsed ? '축약' : '확장'} 모드`);

    // CSS 클래스 토글
    if (isCollapsed) {
      contentElement.classList.remove('expanded');
      contentElement.classList.add('collapsed');
    } else {
      contentElement.classList.remove('collapsed');
      contentElement.classList.add('expanded');
    }

    // 버튼 텍스트 업데이트
    updateToggleButtonText();

    // 토글 시 항상 About Me 섹션으로 스크롤 이동
    setTimeout(() => {
      scrollToAboutMe();
    }, 100); // CSS 애니메이션 시작 후 스크롤
  };

  // 토글 버튼 텍스트 업데이트
  const updateToggleButtonText = () => {
    if (!toggleText || !toggleButton) return;

    const newText = isCollapsed ? '더보기' : '이전상태로 돌아가기';
    toggleText.textContent = newText;

    // 접근성 속성 업데이트
    toggleButton.setAttribute('aria-expanded', (!isCollapsed).toString());
    toggleButton.setAttribute('aria-label', `About Me 섹션 ${newText}`);

    console.log(`버튼 텍스트 업데이트: ${newText}`);
  };

  // 토글 기능 초기화
  const initializeToggle = () => {
    const breakpoint = getCurrentBreakpoint();

    // 모바일(480px 미만)에서만 토글 기능 활성화
    if (breakpoint === 'mobile') {
      console.log('토글 기능 활성화 (모바일 모드)');

      if (!findDOMElements()) {
        console.warn(
          '필수 DOM 요소를 찾을 수 없어 토글 기능을 활성화할 수 없습니다'
        );
        return false;
      }

      // 초기 축약 상태 설정
      isCollapsed = true;
      if (contentElement) {
        contentElement.classList.add('collapsed');
        contentElement.classList.remove('expanded');
      }

      // 버튼 이벤트 리스너 등록
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleContent); // 중복 방지
        toggleButton.addEventListener('click', toggleContent);
        updateToggleButtonText();
        console.log('토글 버튼 이벤트 리스너 등록 완료');
      }

      return true;
    } else {
      console.log(`${breakpoint} 모드: 토글 기능 비활성화`);

      // 토글 기능 비활성화 시 확장 상태로 설정
      if (contentElement) {
        contentElement.classList.remove('collapsed');
        contentElement.classList.add('expanded');
        isCollapsed = false;
      }

      // 이벤트 리스너 제거
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleContent);
      }

      return true;
    }
  };

  // Masonry 초기화 (데스크톱에서만)
  const initializeMasonry = () => {
    const grid = document.querySelector('.about-me-grid');

    if (!grid) {
      console.warn('About Me grid를 찾을 수 없습니다');
      return false;
    }

    const breakpoint = getCurrentBreakpoint();

    // 데스크톱(1024px+)에서만 Masonry 활성화
    if (breakpoint === 'desktop') {
      console.log('데스크톱 모드: Masonry 활성화');

      // 기존 인스턴스 정리
      if (masonryInstance) {
        masonryInstance.destroy();
        masonryInstance = null;
      }

      // 이미지 로드 완료 후 Masonry 초기화
      if (
        typeof imagesLoaded !== 'undefined' &&
        typeof Masonry !== 'undefined'
      ) {
        imagesLoaded(grid, function () {
          masonryInstance = new Masonry(grid, {
            itemSelector: '.about-me-card',
            columnWidth: 320, // CSS의 카드 너비와 일치
            gutter: 20,
            fitWidth: true,
            resize: true,
            transitionDuration: '0.3s',
          });

          console.log('Masonry 초기화 완료');
        });
      } else {
        console.warn('Masonry 또는 imagesLoaded 라이브러리를 찾을 수 없습니다');
      }

      currentBreakpoint = breakpoint;
      return true;
    } else {
      // 데스크톱이 아닌 경우 Masonry 비활성화
      if (masonryInstance) {
        console.log(`${breakpoint} 모드: Masonry 비활성화`);
        masonryInstance.destroy();
        masonryInstance = null;
      }

      currentBreakpoint = breakpoint;
      return true;
    }
  };

  // 가로 스크롤 초기화 (모바일-큰 화면용)
  const initializeHorizontalScroll = () => {
    const content = document.querySelector('.about-me-content');
    const grid = document.querySelector('.about-me-grid');

    if (!content || !grid) return;

    const breakpoint = getCurrentBreakpoint();

    // 모바일-큰 화면(480px+)에서만 가로 스크롤
    if (breakpoint === 'mobile-large') {
      // 터치 스크롤 개선 (iOS Safari 대응)
      content.style.webkitOverflowScrolling = 'touch';
      console.log(`${breakpoint} 모드: 가로 스크롤 활성화`);
    }
  };

  // 리사이즈 핸들러
  const handleResize = () => {
    const newBreakpoint = getCurrentBreakpoint();

    // 브레이크포인트가 변경된 경우에만 처리
    if (newBreakpoint !== currentBreakpoint) {
      console.log(
        `브레이크포인트 변경: ${currentBreakpoint} → ${newBreakpoint}`
      );

      setTimeout(() => {
        initializeMasonry();
        initializeHorizontalScroll();
        initializeToggle(); // 토글 기능 재초기화
      }, 100);
    }
  };

  // 디버깅용 콘솔 출력
  const logCurrentState = () => {
    const breakpoint = getCurrentBreakpoint();
    const hasMasonry = masonryInstance !== null;
    const hasToggleButton = toggleButton !== null;

    console.log(`
=== About Me 컴포넌트 상태 ===
현재 브레이크포인트: ${breakpoint}
화면 너비: ${window.innerWidth}px
Masonry 활성: ${hasMasonry}
토글 버튼 활성: ${hasToggleButton}
축약 상태: ${isCollapsed}
초기화 상태: ${isInitialized}
===============================
    `);
  };

  // 초기화
  const initialize = () => {
    if (isInitialized) {
      console.warn('About Me 컴포넌트가 이미 초기화되었습니다');
      return true;
    }

    console.log('About Me 컴포넌트 초기화 시작');

    // DOM 요소 찾기
    if (!findDOMElements()) {
      console.warn('About Me DOM 요소를 찾을 수 없지만 계속 진행합니다');
    }

    // 초기 설정
    const initialBreakpoint = getCurrentBreakpoint();
    console.log(`초기 브레이크포인트: ${initialBreakpoint}`);

    // 각 기능 초기화
    initializeMasonry();
    initializeHorizontalScroll();
    initializeToggle(); // 토글 기능 초기화

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    isInitialized = true;

    // 디버깅 정보 출력
    logCurrentState();

    console.log('About Me 컴포넌트 초기화 완료');
    return true;
  };

  // 정리
  const cleanup = () => {
    if (masonryInstance) {
      masonryInstance.destroy();
      masonryInstance = null;
    }

    // 이벤트 리스너 제거
    if (toggleButton) {
      toggleButton.removeEventListener('click', toggleContent);
    }

    window.removeEventListener('resize', handleResize);

    // 변수 초기화
    isInitialized = false;
    currentBreakpoint = 'mobile';
    isCollapsed = true;
    contentElement = null;
    toggleButton = null;
    toggleText = null;
    toggleIcon = null;
    aboutMeSection = null;

    console.log('About Me 컴포넌트 정리 완료');
  };

  // 수동 새로고침 (디버깅용)
  const refresh = () => {
    console.log('About Me 수동 새로고침 실행');

    findDOMElements();
    initializeMasonry();
    initializeHorizontalScroll();
    initializeToggle();

    logCurrentState();
  };

  // 공개 API
  return {
    initialize,
    cleanup,
    refresh, // 디버깅용
    getCurrentBreakpoint, // 디버깅용
    logCurrentState, // 디버깅용
    toggleContent, // 수동 토글용
    scrollToAboutMe, // 수동 스크롤용
    isInitialized: () => isInitialized,
    hasMasonry: () => masonryInstance !== null,
    isCollapsed: () => isCollapsed,
    hasToggleButton: () => toggleButton !== null,
  };
})();

// 자동 초기화 (DOM 준비 시)
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료 - About Me 컴포넌트 자동 초기화 시도');

  setTimeout(() => {
    if (window.AboutMeComponent) {
      window.AboutMeComponent.initialize();
    } else {
      console.error('AboutMeComponent를 찾을 수 없습니다');
    }
  }, 100);
});
