// /src/components/header/headerAnimation.js

window.HeaderAnimation = (() => {
  'use strict';

  // 헤더 상태 관리
  let appleHeaderState = {
    appleHeaderVisible: false,
    baseHeaderVisible: true,
    baseHeaderMode: 'transparent',
    animationInProgress: false,
    searchMode: false,
    basketMode: false,
  };

  let mobileToggleState = {
    isVisible: false,
    animationInProgress: false,
  };

  let scrollTrackingState = {
    previousScrollPosition: 0,
    scrollDirection: 'idle',
    scrollThreshold: 10,
  };

  let backgroundOptimizationState = {
    previousBackgroundHeight: null,
    lastBackgroundUpdate: 0,
    throttleDelay: 16,
  };

  // 모바일 감지 유틸리티
  const isMobileDevice = () => {
    return window.innerWidth <= 767;
  };

  const isTabletDevice = () => {
    return window.innerWidth >= 768 && window.innerWidth <= 1024;
  };

  const debugLog = (message, data = null) => {
    if (isMobileDevice()) {
      console.log(`📱 [MOBILE DEBUG] ${message}`, data || '');
    } else {
      console.log(`🖥️ [DESKTOP DEBUG] ${message}`, data || '');
    }
  };

  // 모바일 토글 버튼 제어 함수들
  const showMobileToggleButton = () => {
    if (mobileToggleState.animationInProgress || mobileToggleState.isVisible) {
      return;
    }

    const mobileToggleElement = document.querySelector('.mobile-menu-toggle');
    if (!mobileToggleElement) {
      debugLog('모바일 토글 버튼 요소를 찾을 수 없음');
      return;
    }

    debugLog('모바일 토글 버튼 표시');
    mobileToggleState.animationInProgress = true;
    mobileToggleState.isVisible = true;

    mobileToggleElement.style.opacity = '1';
    mobileToggleElement.style.visibility = 'visible';
    mobileToggleElement.style.pointerEvents = 'auto';
    mobileToggleElement.style.transform = 'translateY(0)';

    setTimeout(() => {
      mobileToggleState.animationInProgress = false;
    }, 300);
  };

  const hideMobileToggleButton = () => {
    if (mobileToggleState.animationInProgress || !mobileToggleState.isVisible) {
      return;
    }

    const mobileToggleElement = document.querySelector('.mobile-menu-toggle');
    if (!mobileToggleElement) {
      debugLog('모바일 토글 버튼 요소를 찾을 수 없음');
      return;
    }

    debugLog('모바일 토글 버튼 숨김');
    mobileToggleState.animationInProgress = true;
    mobileToggleState.isVisible = false;

    mobileToggleElement.style.opacity = '0';
    mobileToggleElement.style.visibility = 'hidden';
    mobileToggleElement.style.pointerEvents = 'none';
    mobileToggleElement.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      mobileToggleState.animationInProgress = false;
    }, 300);
  };

  // 모바일 메뉴 시스템
  const MobileMenuSystem = {
    isActive: false,

    init() {
      this.bindElements();
      this.attachEvents();
      this.initializeMobileToggleStyle();
    },

    initializeMobileToggleStyle() {
      const mobileToggleElement = document.querySelector('.mobile-menu-toggle');
      if (mobileToggleElement) {
        mobileToggleElement.style.opacity = '0';
        mobileToggleElement.style.visibility = 'hidden';
        mobileToggleElement.style.pointerEvents = 'none';
        mobileToggleElement.style.transform = 'translateY(-10px)';
        mobileToggleElement.style.transition =
          'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        mobileToggleState.isVisible = false;
        debugLog('모바일 토글 버튼 초기 상태 설정: 숨김');
      }
    },

    bindElements() {
      this.menuToggle = document.querySelector('.mobile-menu-toggle');
      this.mobileMenu = document.querySelector('.mobile-fullscreen-menu');
      this.body = document.body;

      debugLog('모바일 메뉴 요소 바인딩:', {
        menuToggle: !!this.menuToggle,
        mobileMenu: !!this.mobileMenu,
      });
    },

    attachEvents() {
      if (this.menuToggle) {
        this.menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          debugLog('헤더 햄버거 버튼 클릭 - 토글 모드');
          this.toggleMobileMenu();
        });
      }

      const menuLinks = document.querySelectorAll('.mobile-menu-list a');
      menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
          debugLog('메뉴 링크 클릭 - 메뉴 닫기');
          this.closeMobileMenu();
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isActive) {
          debugLog('ESC 키로 메뉴 닫기');
          this.closeMobileMenu();
        }
      });

      if (this.mobileMenu) {
        this.mobileMenu.addEventListener('click', (e) => {
          if (e.target === this.mobileMenu) {
            debugLog('메뉴 배경 클릭 - 메뉴 닫기');
            this.closeMobileMenu();
          }
        });
      }
    },

    toggleMobileMenu() {
      if (this.isActive) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    },

    openMobileMenu() {
      this.isActive = true;
      this.body.classList.add('mobile-menu-active');
      // this.mobileMenu?.classList.add('active');
      document.documentElement.style.overflow = 'hidden';
      debugLog('모바일 메뉴 열기 완료');
    },

    closeMobileMenu() {
      this.isActive = false;
      this.body.classList.remove('mobile-menu-active');
      // this.mobileMenu?.classList.remove('active');
      document.documentElement.style.overflow = '';
      debugLog('모바일 메뉴 닫기 완료');
    },
  };

  // Apple Features 시스템
  const AppleFeaturesSystem = {
    featureState: {
      searchActive: false,
      basketActive: false,
      searchField: null,
      searchOverlay: null,
      basketDropdown: null,
      headerMenuItems: [],
      searchDelayElements: [],
      animationDuration: 0.4,
    },

    initializeAppleFeatures: function () {
      debugLog('Apple Features 초기화');
      this.bindFeatureElements();
      this.attachFeatureEvents();
      this.prepareFeatureAnimationElements();
    },

    bindFeatureElements: function () {
      this.featureState.searchField = document.getElementById('search-field');
      this.featureState.searchOverlay =
        document.getElementById('af-search-overlay');
      this.featureState.basketDropdown =
        document.getElementById('af-basket-dropdown');
    },

    prepareFeatureAnimationElements: function () {
      const headerMenu = document.getElementById('header-menu');
      if (headerMenu) {
        this.featureState.headerMenuItems = [
          ...headerMenu.querySelectorAll('li.desktop-only'),
        ];

        debugLog(
          '애니메이션 대상 메뉴 아이템:',
          this.featureState.headerMenuItems.length
        );
      }

      this.featureState.searchDelayElements = [
        document.getElementById('search-field'),
        document.getElementById('search-icon'),
        document.getElementById('search-title'),
        document.getElementById('search-item-1'),
        document.getElementById('search-item-2'),
        document.getElementById('search-item-3'),
        document.getElementById('search-item-4'),
        document.getElementById('search-item-5'),
      ].filter((el) => el !== null);

      debugLog('애니메이션 요소 준비 완료:', {
        headerMenuItems: this.featureState.headerMenuItems.length,
        searchDelayElements: this.featureState.searchDelayElements.length,
      });
    },

    attachFeatureEvents: function () {
      const searchTrigger = document.querySelector('.af-search-trigger');
      if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleSearchFeature();
        });
      }

      const basketTrigger = document.querySelector('.af-basket-trigger');
      if (basketTrigger) {
        basketTrigger.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleBasketFeature();
        });
      }

      const searchClose = document.getElementById('af-search-close');
      if (searchClose) {
        searchClose.addEventListener('click', () => {
          this.hideSearchFeature();
        });
      }

      if (this.featureState.searchOverlay) {
        this.featureState.searchOverlay.addEventListener('click', (e) => {
          if (e.target === this.featureState.searchOverlay) {
            this.hideSearchFeature();
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.featureState.searchActive) this.hideSearchFeature();
          if (this.featureState.basketActive) this.hideBasketFeature();
        }
      });

      document.addEventListener('click', () => {
        if (this.featureState.basketActive) {
          this.hideBasketFeature();
        }
      });

      if (this.featureState.basketDropdown) {
        this.featureState.basketDropdown.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    },

    toggleSearchFeature: function () {
      if (this.featureState.searchActive) {
        this.hideSearchFeature();
      } else {
        this.showSearchFeature();
      }
    },

    showSearchFeature: function () {
      if (this.featureState.searchActive) return;

      debugLog('Apple 검색 순차 애니메이션 시작');
      this.featureState.searchActive = true;
      appleHeaderState.searchMode = true;

      if (MobileMenuSystem.isActive) {
        MobileMenuSystem.closeMobileMenu();
      }

      this.hideBasketFeature();
      document.documentElement.classList.add('fixed');

      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.classList.add('searching');
      }

      this.featureState.headerMenuItems.reverse().forEach((el, index) => {
        el.style.transitionDelay = `${
          (index * this.featureState.animationDuration) /
          this.featureState.headerMenuItems.length
        }s`;
      });

      if (this.featureState.searchOverlay) {
        this.featureState.searchOverlay.classList.add('af-active');
      }

      this.featureState.searchDelayElements.forEach((el, index) => {
        el.style.transitionDelay = `${
          0.2 +
          (index * this.featureState.animationDuration) /
            this.featureState.searchDelayElements.length
        }s`;
      });

      setTimeout(() => {
        if (this.featureState.searchField) {
          this.featureState.searchField.focus();
        }
      }, 600);
    },

    hideSearchFeature: function () {
      if (!this.featureState.searchActive) return;

      debugLog('Apple 검색 순차 애니메이션 종료');
      this.featureState.searchActive = false;
      appleHeaderState.searchMode = false;

      const headerElement = document.querySelector('header');
      if (headerElement) {
        headerElement.classList.remove('searching');
      }

      this.featureState.headerMenuItems.reverse().forEach((el, index) => {
        el.style.transitionDelay = `${
          (index * this.featureState.animationDuration) /
          this.featureState.headerMenuItems.length
        }s`;
      });

      this.featureState.searchDelayElements.reverse().forEach((el, index) => {
        el.style.transitionDelay = `${
          (index * this.featureState.animationDuration) /
          this.featureState.searchDelayElements.length
        }s`;
      });
      this.featureState.searchDelayElements.reverse();

      document.documentElement.classList.remove('fixed');

      if (this.featureState.searchOverlay) {
        this.featureState.searchOverlay.classList.remove('af-active');
      }

      if (this.featureState.searchField) {
        this.featureState.searchField.value = '';
        this.featureState.searchField.blur();
      }
    },

    toggleBasketFeature: function () {
      if (this.featureState.basketActive) {
        this.hideBasketFeature();
      } else {
        this.showBasketFeature();
      }
    },

    showBasketFeature: function () {
      if (this.featureState.basketActive) return;

      debugLog('Apple 장바구니 드롭다운 표시');
      this.featureState.basketActive = true;
      appleHeaderState.basketMode = true;

      if (MobileMenuSystem.isActive) {
        MobileMenuSystem.closeMobileMenu();
      }

      this.hideSearchFeature();

      if (this.featureState.basketDropdown) {
        this.featureState.basketDropdown.classList.add('af-active');
      }
    },

    hideBasketFeature: function () {
      if (!this.featureState.basketActive) return;

      debugLog('Apple 장바구니 드롭다운 숨김');
      this.featureState.basketActive = false;
      appleHeaderState.basketMode = false;

      if (this.featureState.basketDropdown) {
        this.featureState.basketDropdown.classList.remove('af-active');
      }
    },
  };

  // 유틸리티 함수들
  const getHeaderElement = (selector) => {
    return document.querySelector(selector);
  };

  const detectCurrentScrollDirection = (currentScrollPosition) => {
    const scrollDifference =
      currentScrollPosition - scrollTrackingState.previousScrollPosition;

    if (Math.abs(scrollDifference) < scrollTrackingState.scrollThreshold) {
      return scrollTrackingState.scrollDirection;
    }

    const newDirection =
      scrollDifference > 0 ? 'down' : scrollDifference < 0 ? 'up' : 'idle';
    scrollTrackingState.scrollDirection = newDirection;
    scrollTrackingState.previousScrollPosition = currentScrollPosition;

    return newDirection;
  };

  const calculateScrollProgressValue = (
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

  const determineCurrentSectionInfo = () => {
    const currentScrollPosition = window.pageYOffset || 0;
    const allSections = document.querySelectorAll('main section');

    for (
      let sectionIndex = 0;
      sectionIndex < allSections.length;
      sectionIndex++
    ) {
      const currentSection = allSections[sectionIndex];
      const sectionTopPosition = currentSection.offsetTop || 0;
      const sectionHeight = currentSection.offsetHeight || 0;
      const sectionBottomPosition = sectionTopPosition + sectionHeight;

      const isInCurrentSection =
        currentScrollPosition >= sectionTopPosition &&
        currentScrollPosition < sectionBottomPosition;

      if (isInCurrentSection) {
        const sectionInfo = {
          name: currentSection.classList.contains('hero-section')
            ? 'hero-section'
            : currentSection.classList.contains('portfolio-content')
            ? 'portfolio-content'
            : `section-${sectionIndex}`,
          number: sectionIndex,
          isHeroSection: currentSection.classList.contains('hero-section'),
          isPortfolioSection:
            currentSection.classList.contains('portfolio-content'),
        };

        if (sectionIndex <= 1) {
          debugLog(
            `섹션 감지: ${sectionInfo.name}, 스크롤: ${currentScrollPosition}px`
          );
        }

        return sectionInfo;
      }
    }

    return {
      name: 'unknown',
      number: -1,
      isHeroSection: false,
      isPortfolioSection: false,
    };
  };

  // Apple 헤더 애니메이션 함수들
  const showAppleHeaderAnimation = () => {
    debugLog(
      `Apple 헤더 표시 시도 - visible: ${appleHeaderState.appleHeaderVisible}, animating: ${appleHeaderState.animationInProgress}`
    );

    if (
      appleHeaderState.animationInProgress ||
      appleHeaderState.appleHeaderVisible
    ) {
      debugLog('Apple 헤더 표시 취소 (이미 표시됨 또는 애니메이션 중)');
      return;
    }

    const appleHeaderElement = getHeaderElement('#apple-header');
    if (!appleHeaderElement) {
      debugLog('Apple 헤더 요소를 찾을 수 없음');
      return;
    }

    debugLog('Apple 헤더 표시 애니메이션 시작');
    appleHeaderState.animationInProgress = true;
    appleHeaderElement.classList.add('show');
    appleHeaderElement.classList.remove('hide');
    appleHeaderState.appleHeaderVisible = true;

    if (window.HeroLogoAnimation) {
      window.HeroLogoAnimation.hideText();
    }

    const logoElement = getHeaderElement('.logo');
    const subNavigationElement = getHeaderElement('#sub-navigation');

    if (logoElement && subNavigationElement) {
      logoElement.style.top = '0px';
      logoElement.style.marginTop = '0px';

      const currentTransform = logoElement.style.transform;
      let cleanTransform = currentTransform
        .replace(/translateY\([^)]*\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const appleHeaderHeight = 44;
      const subHeaderHeight = subNavigationElement.offsetHeight || 44;
      const halfSubHeaderHeight = subHeaderHeight / 2;
      const totalMarginTop = appleHeaderHeight + halfSubHeaderHeight;

      logoElement.style.marginTop = `${totalMarginTop}px`;

      if (cleanTransform.includes('scale')) {
        cleanTransform = cleanTransform.replace(
          'scale',
          'translateY(-50%) scale'
        );
      } else {
        cleanTransform += ' translateY(-50%)';
      }

      logoElement.style.transform = cleanTransform;
    }

    setTimeout(() => {
      appleHeaderState.animationInProgress = false;
      debugLog('Apple 헤더 표시 애니메이션 완료');
    }, 500);
  };

  const hideAppleHeaderAnimation = () => {
    debugLog(
      `Apple 헤더 숨김 시도 - visible: ${appleHeaderState.appleHeaderVisible}, animating: ${appleHeaderState.animationInProgress}`
    );

    if (
      appleHeaderState.animationInProgress ||
      !appleHeaderState.appleHeaderVisible
    ) {
      debugLog('Apple 헤더 숨김 취소 (이미 숨겨짐 또는 애니메이션 중)');
      return;
    }

    const appleHeaderElement = getHeaderElement('#apple-header');
    if (!appleHeaderElement) {
      debugLog('Apple 헤더 요소를 찾을 수 없음');
      return;
    }

    debugLog('Apple 헤더 숨김 애니메이션 시작');
    appleHeaderState.animationInProgress = true;
    appleHeaderElement.classList.remove('show');
    appleHeaderElement.classList.add('hide');
    appleHeaderState.appleHeaderVisible = false;

    const logoElement = getHeaderElement('.logo');
    const subNavigationElement = getHeaderElement('#sub-navigation');

    if (logoElement && subNavigationElement) {
      logoElement.style.top = '0px';
      logoElement.style.marginTop = '0px';

      const subHeaderHeight = subNavigationElement.offsetHeight || 44;
      const halfSubHeaderHeight = subHeaderHeight / 2;

      logoElement.style.marginTop = `${halfSubHeaderHeight}px`;
      logoElement.style.transform =
        'translateX(-50%) translateY(-50%) scale(1)';
    }

    setTimeout(() => {
      appleHeaderState.animationInProgress = false;
      debugLog('Apple 헤더 숨김 애니메이션 완료');
    }, 500);
  };

  const showBaseHeaderNavigation = () => {
    const subNavigationElement = getHeaderElement('#sub-navigation');
    if (!subNavigationElement) return;

    subNavigationElement.classList.remove('hidden');
    subNavigationElement.style.transform = 'translateY(0)';
    subNavigationElement.style.opacity = '1';
    appleHeaderState.baseHeaderVisible = true;
    debugLog('Sub-navigation 표시');
  };

  const hideBaseHeaderNavigation = () => {
    const subNavigationElement = getHeaderElement('#sub-navigation');
    if (!subNavigationElement) return;

    subNavigationElement.classList.add('hidden');
    appleHeaderState.baseHeaderVisible = false;
    debugLog('Sub-navigation 숨김');
  };

  const setBaseHeaderDisplayMode = (mode) => {
    const subNavigationElement = getHeaderElement('#sub-navigation');
    if (!subNavigationElement) return;

    subNavigationElement.classList.remove('dummy-section-mode');
    if (mode === 'dummy-section') {
      subNavigationElement.classList.add('dummy-section-mode');
    }
    appleHeaderState.baseHeaderMode = mode;
    debugLog(`헤더 모드 변경: ${mode}`);
  };

  // 스크롤 기반 애니메이션 함수들
  const easeOutCubicFunction = (timeFraction) => {
    return 1 - Math.pow(1 - timeFraction, 3);
  };

  const easeInOutCubicFunction = (timeFraction) => {
    return timeFraction < 0.5
      ? 4 * timeFraction * timeFraction * timeFraction
      : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2;
  };

  const clampNumericValue = (valueToClamp, minValue, maxValue) => {
    return Math.min(Math.max(valueToClamp, minValue), maxValue);
  };

  const updateHeroAnimationProgress = (totalProgressValue) => {
    const heroElement = getHeaderElement('.hero-div');
    if (!heroElement) return;

    const scaleAnimationEndPoint = 0.8;

    if (totalProgressValue >= scaleAnimationEndPoint) {
      heroElement.style.transform = 'scaleX(1)';
      heroElement.style.borderRadius = '23px';
    } else {
      const scaleProgressRatio = totalProgressValue / scaleAnimationEndPoint;
      const easedScaleProgress = easeOutCubicFunction(scaleProgressRatio);
      const easedRadiusProgress = easeInOutCubicFunction(scaleProgressRatio);
      const currentRadiusValue = easedRadiusProgress * 23;

      heroElement.style.transform = `scaleX(${easedScaleProgress})`;
      heroElement.style.borderRadius = `${currentRadiusValue}px`;
    }
  };

  const updateShrinkingBackgroundHeight = (currentScrollPosition) => {
    const currentTime = performance.now();
    if (
      currentTime - backgroundOptimizationState.lastBackgroundUpdate <
      backgroundOptimizationState.throttleDelay
    ) {
      return;
    }

    const shrinkingBackgroundElement = getHeaderElement(
      '.shrinking-background'
    );
    if (!shrinkingBackgroundElement) return;

    const shrinkStartPosition = 100;
    const shrinkEndPosition = 500;
    let finalHeightValue;

    if (currentScrollPosition >= shrinkStartPosition) {
      const shrinkProgress = calculateScrollProgressValue(
        currentScrollPosition,
        shrinkStartPosition,
        shrinkEndPosition
      );
      const easedShrinkProgress = easeOutCubicFunction(shrinkProgress);
      const viewportHeight = window.innerHeight || 1080;
      const initialHeightVh = 100;
      const finalHeightVh = 10;

      const currentHeightVh =
        initialHeightVh -
        easedShrinkProgress * (initialHeightVh - finalHeightVh);
      finalHeightValue = `${Math.max(currentHeightVh, finalHeightVh)}vh`;
    } else {
      finalHeightValue = '100vh';

      if (window.HeroLogoAnimation) {
        const visibilityState = window.HeroLogoAnimation.getVisibilityState();
        if (visibilityState.shouldHide && !visibilityState.isVisible) {
          window.HeroLogoAnimation.showText();
        }
      }
    }

    if (
      backgroundOptimizationState.previousBackgroundHeight === finalHeightValue
    )
      return;

    backgroundOptimizationState.previousBackgroundHeight = finalHeightValue;
    backgroundOptimizationState.lastBackgroundUpdate = currentTime;

    requestAnimationFrame(() => {
      shrinkingBackgroundElement.style.height = finalHeightValue;
    });
  };

  // 🚨 버그 수정: 히어로 섹션에서는 절대 메뉴 표시 안함
  const updateNavigationMenuOpacity = (
    totalProgressValue,
    currentSectionInfo
  ) => {
    const subNavigationElement = getHeaderElement('#sub-navigation');
    const subNavigationInnerElement = getHeaderElement('.sub-navigation-inner');
    if (!subNavigationElement || !subNavigationInnerElement) return;

    let menuOpacityValue = 0;

    // 히어로 섹션에서는 진행률과 관계없이 메뉴 절대 표시 안함
    if (currentSectionInfo.isHeroSection) {
      menuOpacityValue = 0; // 🔧 수정: 항상 0으로 고정

      if (isMobileDevice()) {
        subNavigationInnerElement.style.padding = '0 10px';
      } else {
        subNavigationInnerElement.style.removeProperty('padding');
      }
    } else if (currentSectionInfo.isPortfolioSection) {
      // 포트폴리오 섹션부터만 메뉴 표시
      menuOpacityValue = 1;

      if (isMobileDevice()) {
        subNavigationInnerElement.style.padding = '0 10px';
      } else {
        subNavigationInnerElement.style.removeProperty('padding');
      }
    }

    const finalOpacityValue = clampNumericValue(menuOpacityValue, 0, 1);

    if (finalOpacityValue > 0) {
      subNavigationElement.classList.add('show');
    } else {
      subNavigationElement.classList.remove('show');
      if (currentSectionInfo.isHeroSection) {
        subNavigationElement.style.removeProperty('opacity');
      }
    }
  };

  // 헤더 제어 로직
  const handleHeaderAnimationControl = (
    scrollDirection,
    currentSectionInfo
  ) => {
    if (
      appleHeaderState.searchMode ||
      appleHeaderState.basketMode ||
      MobileMenuSystem.isActive
    ) {
      debugLog('Apple Features 또는 모바일 메뉴 활성화로 헤더 제어 일시중단');
      return;
    }

    debugLog(
      `헤더 제어 로직 - 섹션: ${currentSectionInfo.name}, 스크롤: ${scrollDirection}`
    );

    if (currentSectionInfo.isHeroSection) {
      debugLog('Hero section - Apple 헤더 및 모바일 토글 버튼 숨김');
      hideAppleHeaderAnimation();
      hideMobileToggleButton();
      setBaseHeaderDisplayMode('transparent');

      const logoElement = getHeaderElement('.logo');
      if (logoElement) {
        logoElement.style.removeProperty('top');
        logoElement.style.removeProperty('margin-top');
      }
      return;
    }

    if (currentSectionInfo.isPortfolioSection) {
      debugLog('Portfolio section 진입');
      setBaseHeaderDisplayMode('dummy-section');

      if (scrollDirection === 'down') {
        debugLog('스크롤 다운 감지 - Apple 헤더 및 모바일 토글 버튼 표시 요청');
        showAppleHeaderAnimation();
        showMobileToggleButton();
        showBaseHeaderNavigation();
      } else if (scrollDirection === 'up') {
        debugLog('스크롤 업 감지 - Apple 헤더 및 모바일 토글 버튼 숨김 요청');
        hideAppleHeaderAnimation();
        hideMobileToggleButton();
        setTimeout(() => {
          hideBaseHeaderNavigation();
        }, 500);
      }
    }
  };

  // 메인 스크롤 이벤트 핸들러
  const handleMainScrollEvent = () => {
    if (
      appleHeaderState.searchMode ||
      appleHeaderState.basketMode ||
      MobileMenuSystem.isActive
    ) {
      return;
    }

    const currentScrollPosition = window.pageYOffset || 0;
    const scrollDirection = detectCurrentScrollDirection(currentScrollPosition);

    const heroSectionElement = getHeaderElement('.hero-section');
    const heroSectionTopPosition = heroSectionElement?.offsetTop || 0;
    const heroSectionHeight =
      heroSectionElement?.offsetHeight || window.innerHeight;
    const heroSectionBottomPosition =
      heroSectionTopPosition + heroSectionHeight;
    const heroSectionScrollEndPosition =
      heroSectionBottomPosition - window.innerHeight;

    const heroSectionProgressValue = calculateScrollProgressValue(
      currentScrollPosition,
      heroSectionTopPosition,
      heroSectionScrollEndPosition
    );

    const currentSectionInfo = determineCurrentSectionInfo();

    handleHeaderAnimationControl(scrollDirection, currentSectionInfo);

    if (currentSectionInfo.isHeroSection) {
      if (window.HeroLogoAnimation) {
        window.HeroLogoAnimation.updateTransform(heroSectionProgressValue);
      }
      updateHeroAnimationProgress(heroSectionProgressValue);
    } else {
      if (window.HeroLogoAnimation) {
        const rocketState = window.HeroLogoAnimation.getRocketState();
        if (rocketState.hasLaunched) {
          window.HeroLogoAnimation.resetRocket();
        }
      }
    }

    if (currentScrollPosition < 100) {
      if (window.HeroLogoAnimation) {
        const rocketState = window.HeroLogoAnimation.getRocketState();
        if (rocketState.hasLaunched) {
          window.HeroLogoAnimation.resetRocket();
        }
      }
    }

    updateNavigationMenuOpacity(heroSectionProgressValue, currentSectionInfo);
    updateShrinkingBackgroundHeight(currentScrollPosition);
  };

  // 초기화 함수
  const initializeHeaderAnimationSystem = () => {
    debugLog('Header 애니메이션 시스템 초기화 시작');

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 상태 초기화
    scrollTrackingState.previousScrollPosition = 0;
    scrollTrackingState.scrollDirection = 'idle';

    appleHeaderState.appleHeaderVisible = false;
    appleHeaderState.baseHeaderVisible = true;
    appleHeaderState.baseHeaderMode = 'transparent';
    appleHeaderState.animationInProgress = false;
    appleHeaderState.searchMode = false;
    appleHeaderState.basketMode = false;

    mobileToggleState.isVisible = false;
    mobileToggleState.animationInProgress = false;

    backgroundOptimizationState.previousBackgroundHeight = '100vh';
    backgroundOptimizationState.lastBackgroundUpdate = 0;

    debugLog(
      `초기 헤더 상태: visible=${appleHeaderState.appleHeaderVisible}, mode=${appleHeaderState.baseHeaderMode}, mobileToggle=${mobileToggleState.isVisible}`
    );

    // 히어로 초기 설정
    const heroElement = getHeaderElement('.hero-div');
    if (heroElement) {
      heroElement.style.clipPath = 'inset(0%)';
      heroElement.style.transform = 'scaleX(0)';
      heroElement.style.borderRadius = '0px';
    }

    // Apple Features 초기화
    AppleFeaturesSystem.initializeAppleFeatures();

    // 모바일 메뉴 시스템 초기화
    MobileMenuSystem.init();

    // 스크롤 이벤트 리스너 설정
    window.addEventListener('scroll', handleMainScrollEvent, { passive: true });
    window.addEventListener(
      'resize',
      () => {
        handleMainScrollEvent();
      },
      { passive: true }
    );

    // 초기 스크롤 이벤트 실행
    handleMainScrollEvent();

    debugLog('Header 애니메이션 시스템 초기화 완료');
  };

  // 외부 인터페이스
  return {
    initialize: initializeHeaderAnimationSystem,
    showAppleHeader: showAppleHeaderAnimation,
    hideAppleHeader: hideAppleHeaderAnimation,
    showBaseHeader: showBaseHeaderNavigation,
    hideBaseHeader: hideBaseHeaderNavigation,
    setMode: setBaseHeaderDisplayMode,
    handleScroll: handleMainScrollEvent,
    showMobileToggle: showMobileToggleButton,
    hideMobileToggle: hideMobileToggleButton,
    isAppleHeaderVisible: () => appleHeaderState.appleHeaderVisible,
    isSearchMode: () => appleHeaderState.searchMode,
    isBasketMode: () => appleHeaderState.basketMode,
    isMobileMenuActive: () => MobileMenuSystem.isActive,
    isMobileToggleVisible: () => mobileToggleState.isVisible,
    getScrollDirection: () => scrollTrackingState.scrollDirection,
    isMobile: isMobileDevice,
    isTablet: isTabletDevice,
    openMobileMenu: () => MobileMenuSystem.openMobileMenu(),
    closeMobileMenu: () => MobileMenuSystem.closeMobileMenu(),
    toggleMobileMenu: () => MobileMenuSystem.toggleMobileMenu(),
    getState: () => ({
      ...appleHeaderState,
      mobileMenuActive: MobileMenuSystem.isActive,
      mobileToggleVisible: mobileToggleState.isVisible,
    }),
    debugMode: true,
  };
})();

window.checkMobileMenuState = () => {
  const state = {
    isActive: window.HeaderAnimation?.isMobileMenuActive?.() || false,
    bodyHasClass: document.body.classList.contains('mobile-menu-active'),
    menuHasClass:
      document
        .querySelector('.mobile-fullscreen-menu')
        ?.classList.contains('active') || false,
    overflowStyle: document.documentElement.style.overflow,
    toggleVisible: window.HeaderAnimation?.isMobileToggleVisible?.() || false,
  };

  console.log('모바일 메뉴 상태 체크:', state);
  return state;
};
