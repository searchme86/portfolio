// /src/components/hero/logoAnimation.js

window.HeroLogoAnimation = (() => {
  'use strict';

  // 🇰🇷 한국어 인사말 데이터
  const koreanGreetingMessages = [
    { text: '감사합니다!', lang: 'ko' },
    { text: '방문해주셔서,', lang: 'ko' },
    { text: '자세한 내용은', lang: 'ko' },
    { text: '아래로 이동해요', lang: 'ko' },
  ];

  // 로고 애니메이션 상태 관리
  let logoAnimationState = {
    currentIndex: 0,
    isAnimating: false,
    animationInterval: null,
    isPaused: false,
    cycleDuration: 1500,
  };

  let logoVisibilityState = {
    isVisible: true,
    shouldHide: false,
  };

  let rocketLaunchState = {
    hasLaunched: false,
    isLaunched: false,
  };

  // 🎯 유틸리티 함수들
  const getHtmlElement = (selector) => {
    return document.querySelector(selector);
  };

  const getResponsiveLogoScale = () => {
    const viewportWidth = window.innerWidth || 1920;
    if (viewportWidth <= 480) return 3;
    if (viewportWidth <= 768) return 4;
    return 6;
  };

  const calculateScrollProgress = (
    currentPosition,
    startPosition,
    endPosition
  ) => {
    const totalDistance = endPosition - startPosition;
    return totalDistance > 0
      ? Math.min(
          Math.max((currentPosition - startPosition) / totalDistance, 0),
          1
        )
      : 0;
  };

  // 🎬 로고 텍스트 애니메이션 함수들
  const initializeKoreanGreetingAnimation = () => {
    const greetingContainer = getHtmlElement('.hello-text-container');
    if (!greetingContainer) {
      console.error('⚠ Hello 텍스트 컨테이너를 찾을 수 없습니다');
      return;
    }

    console.log('🎯 한국어 인사말 애니메이션 초기화 중...');

    const firstGreetingText = greetingContainer.querySelector(
      '.hello-text[data-text="감사합니다!"]'
    );
    if (firstGreetingText) {
      firstGreetingText.classList.add('active');
    }

    startKoreanGreetingAnimation();
    console.log('✅ 한국어 인사말 애니메이션 초기화 완료');
  };

  const startKoreanGreetingAnimation = () => {
    if (logoAnimationState.animationInterval) {
      clearInterval(logoAnimationState.animationInterval);
    }

    logoAnimationState.animationInterval = setInterval(() => {
      if (!logoAnimationState.isPaused && !logoAnimationState.isAnimating) {
        transitionToNextKoreanGreeting();
      }
    }, logoAnimationState.cycleDuration);

    console.log('🔄 한국어 인사말 애니메이션 시작됨');
  };

  const pauseKoreanGreetingAnimation = () => {
    logoAnimationState.isPaused = true;
    console.log('⏸️ 한국어 인사말 애니메이션 일시정지');
  };

  const resumeKoreanGreetingAnimation = () => {
    logoAnimationState.isPaused = false;
    console.log('▶️ 한국어 인사말 애니메이션 재개');
  };

  const transitionToNextKoreanGreeting = () => {
    if (logoAnimationState.isAnimating) return;

    logoAnimationState.isAnimating = true;

    const greetingContainer = getHtmlElement('.hello-text-container');
    if (!greetingContainer) return;

    const allGreetingTexts = greetingContainer.querySelectorAll('.hello-text');
    const currentGreetingText =
      allGreetingTexts[logoAnimationState.currentIndex];

    logoAnimationState.currentIndex =
      (logoAnimationState.currentIndex + 1) % koreanGreetingMessages.length;
    const nextGreetingText = allGreetingTexts[logoAnimationState.currentIndex];

    if (!currentGreetingText || !nextGreetingText) {
      logoAnimationState.isAnimating = false;
      return;
    }

    console.log(
      `🇰🇷 인사말 전환: ${currentGreetingText.textContent} → ${nextGreetingText.textContent}`
    );

    currentGreetingText.classList.remove('active');
    currentGreetingText.classList.add('fade-out');

    setTimeout(() => {
      nextGreetingText.classList.add('active');

      setTimeout(() => {
        currentGreetingText.classList.remove('fade-out');
        logoAnimationState.isAnimating = false;
      }, 400);
    }, 400);
  };

  // 🚀 로켓 애니메이션 (로고 사라짐 효과)
  const hideLogoTextForAppleHeader = () => {
    const logoElement = getHtmlElement('.logo');
    if (!logoElement) return;

    console.log('🙈 Apple 헤더 show 상태 → 감사합니다! 텍스트 숨김');
    logoElement.style.display = 'none';
    logoVisibilityState.isVisible = false;
    logoVisibilityState.shouldHide = true;

    pauseKoreanGreetingAnimation();
  };

  const showLogoTextForScrollReset = () => {
    const logoElement = getHtmlElement('.logo');
    if (!logoElement) return;

    console.log('🙋‍♂️ 첫 번째 섹션 복귀 → 감사합니다! 텍스트 표시');
    logoElement.style.display = 'block';

    logoElement.style.transition =
      'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    logoElement.style.opacity = '0';

    requestAnimationFrame(() => {
      logoElement.style.opacity = '1';
    });

    logoVisibilityState.isVisible = true;
    logoVisibilityState.shouldHide = false;

    rocketLaunchState.hasLaunched = false;
    rocketLaunchState.isLaunched = false;

    resumeKoreanGreetingAnimation();
  };

  const checkRocketLaunchCollisionDetection = () => {
    const headerElement = getHtmlElement('header');
    const heroElement = getHtmlElement('.hero-div');

    if (
      !headerElement ||
      !heroElement ||
      rocketLaunchState.isLaunched ||
      !logoVisibilityState.isVisible
    )
      return;

    const headerRect = headerElement.getBoundingClientRect();
    const heroRect = heroElement.getBoundingClientRect();

    const headerTop = headerRect.top;
    const heroTop = heroRect.top;

    if (Math.abs(heroTop - headerTop) <= 5 && !rocketLaunchState.hasLaunched) {
      executeRocketLaunchAnimation();
    }
  };

  const executeRocketLaunchAnimation = () => {
    console.log('💻 헤더와 히어로 충돌! 감사합니다! 텍스트가 사라집니다!');

    rocketLaunchState.hasLaunched = true;
    rocketLaunchState.isLaunched = true;

    pauseKoreanGreetingAnimation();
    startRocketDisappearAnimation();
  };

  const startRocketDisappearAnimation = () => {
    const logoElement = getHtmlElement('.logo');
    if (!logoElement) return;

    let startTime = null;
    const animationDuration = 2000;

    const animateRocketDisappear = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const opacity = 1 - easeProgress;

      logoElement.style.opacity = opacity;

      if (progress < 1) {
        requestAnimationFrame(animateRocketDisappear);
      } else {
        console.log('💻 텍스트가 완전히 사라졌습니다!');
      }
    };

    requestAnimationFrame(animateRocketDisappear);
  };

  const resetRocketAnimationState = () => {
    if (!rocketLaunchState.hasLaunched) return;

    console.log('🔄 텍스트가 다시 나타납니다!');

    const logoElement = getHtmlElement('.logo');
    if (logoElement) {
      logoElement.style.transition =
        'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      logoElement.style.opacity = '1';
    }

    rocketLaunchState.hasLaunched = false;
    rocketLaunchState.isLaunched = false;

    resumeKoreanGreetingAnimation();
  };

  // 📏 로고 변형 애니메이션
  const updateLogoTransformAnimation = (scrollProgressValue) => {
    const logoElement = getHtmlElement('.logo');
    if (!logoElement) return;

    if (rocketLaunchState.isLaunched) return;

    const baseHeaderHeight = 44;
    const appleHeaderHeight = window.HeaderAnimation?.isAppleHeaderVisible()
      ? 44
      : 0;
    const totalHeaderHeight = baseHeaderHeight + appleHeaderHeight;

    const viewportHeight = window.innerHeight;
    const headerCenterFromTop = totalHeaderHeight / 2;
    const headerCenterVh = (headerCenterFromTop / viewportHeight) * 100;
    const moveDistance = 50 - headerCenterVh;

    const initialYOffset = 0;
    const finalYOffset = -moveDistance;
    const initialScaleValue = getResponsiveLogoScale();
    const finalScaleValue = 1;

    const currentYOffset =
      initialYOffset + (finalYOffset - initialYOffset) * scrollProgressValue;
    const currentScaleValue =
      initialScaleValue -
      scrollProgressValue * (initialScaleValue - finalScaleValue);

    if (scrollProgressValue === 0) {
      logoElement.style.transform = `translateX(-50%) translateY(-50%) scale(${currentScaleValue})`;
    } else {
      logoElement.style.transform = `translateX(-50%) translateY(${currentYOffset}vh) scale(${currentScaleValue})`;
    }

    checkRocketLaunchCollisionDetection();
  };

  // 🎭 이벤트 리스너 설정
  const setupLogoAnimationEventListeners = () => {
    const logoContainer = getHtmlElement('.logo-container');
    if (logoContainer) {
      logoContainer.addEventListener(
        'mouseenter',
        pauseKoreanGreetingAnimation
      );
      logoContainer.addEventListener(
        'mouseleave',
        resumeKoreanGreetingAnimation
      );
      logoContainer.addEventListener('focusin', pauseKoreanGreetingAnimation);
      logoContainer.addEventListener('focusout', resumeKoreanGreetingAnimation);
    }

    console.log('🎭 로고 애니메이션 이벤트 리스너 설정 완료');
  };

  // 🚀 초기화 함수
  const initializeLogoAnimationSystem = () => {
    console.log('🎯 로고 애니메이션 시스템 초기화 시작');

    // 상태 초기화
    logoAnimationState.currentIndex = 0;
    logoAnimationState.isAnimating = false;
    logoAnimationState.isPaused = false;

    rocketLaunchState.hasLaunched = false;
    rocketLaunchState.isLaunched = false;

    logoVisibilityState.isVisible = true;
    logoVisibilityState.shouldHide = false;

    // 로고 초기 설정
    const logoElement = getHtmlElement('.logo');
    if (logoElement) {
      const initialScale = getResponsiveLogoScale();
      logoElement.style.top = '50%';
      logoElement.style.marginTop = '0px';
      logoElement.style.transform = `translateX(-50%) translateY(-50%) scale(${initialScale})`;
    }

    // 애니메이션 및 이벤트 설정
    initializeKoreanGreetingAnimation();
    setupLogoAnimationEventListeners();

    console.log('✅ 로고 애니메이션 시스템 초기화 완료');
  };

  // 🌐 외부 인터페이스
  return {
    initialize: initializeLogoAnimationSystem,
    hideText: hideLogoTextForAppleHeader,
    showText: showLogoTextForScrollReset,
    updateTransform: updateLogoTransformAnimation,
    resetRocket: resetRocketAnimationState,
    checkCollision: checkRocketLaunchCollisionDetection,
    pause: pauseKoreanGreetingAnimation,
    resume: resumeKoreanGreetingAnimation,
    // 상태 접근자
    getVisibilityState: () => logoVisibilityState,
    getRocketState: () => rocketLaunchState,
  };
})();
