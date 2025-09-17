// /src/components/tutorialModal/tutorialModal.js

(function () {
  'use strict';

  console.log('🎯 튜토리얼 모달 시스템 초기화 시작');

  // 스토리지 키 상수
  const STORAGE_KEYS = {
    DONT_SHOW_TODAY: 'dontShowTutorialToday',
    SESSION_EXECUTED: 'tutorialExecutedInSession',
  };

  // DOM 선택자 상수
  const SELECTORS = {
    TUTORIAL_MODAL: '#tutorialModal',
    TUTORIAL_SLIDER: '#tutorialSlider',
    SECTION2: '#section2',
    MANUAL_TRIGGER_BTN: '#manualTriggerBtn',
    MODAL_CLOSE_BTN: '#modalCloseBtn',
    SKIP_TUTORIAL_BTN: '#skipTutorialBtn',
    PLAY_PAUSE_BTN: '#playPauseBtn',
    PROGRESS_DOTS: '#progressDots',
    DRAG_HANDLE: '#dragHandle',
    SLIDES_CONTAINER: '#slidesContainer',
    SLIDER_TRACK: '#sliderTrack',
    DONT_SHOW_TODAY: '#dontShowToday',
  };

  // 튜토리얼 표시 조건 관리
  const createTutorialDisplayPreferences = () => {
    const shouldShowTutorial = () => {
      const today = new Date().toDateString();
      const dontShowToday = localStorage.getItem(STORAGE_KEYS.DONT_SHOW_TODAY);

      if (dontShowToday === today) {
        return false;
      }

      const executedInSession = sessionStorage.getItem(
        STORAGE_KEYS.SESSION_EXECUTED
      );
      if (executedInSession === 'true') {
        return false;
      }

      return true;
    };

    const saveDontShowToday = () => {
      const today = new Date().toDateString();
      localStorage.setItem(STORAGE_KEYS.DONT_SHOW_TODAY, today);
    };

    const markExecutedInSession = () => {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_EXECUTED, 'true');
    };

    const cleanupOldPreferences = () => {
      const today = new Date().toDateString();
      const dontShowToday = localStorage.getItem(STORAGE_KEYS.DONT_SHOW_TODAY);

      if (dontShowToday && dontShowToday !== today) {
        localStorage.removeItem(STORAGE_KEYS.DONT_SHOW_TODAY);
      }
    };

    return {
      shouldShowTutorial,
      saveDontShowToday,
      markExecutedInSession,
      cleanupOldPreferences,
    };
  };

  // 반응형 모달 관리 (드래그 지원)
  const createResponsiveTutorialModal = (storageManager) => {
    const modal = document.querySelector(SELECTORS.TUTORIAL_MODAL);
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const dragHandle = document.querySelector(SELECTORS.DRAG_HANDLE);

    if (!modal || !modalContent) {
      console.warn('⚠ 튜토리얼 모달 DOM 요소를 찾을 수 없습니다');
      return {
        openModal: () => {},
        closeModal: () => {},
        closeTutorial: () => {},
        setSliderDragging: () => {},
        setSliderManager: () => {},
      };
    }

    // 강제로 최고 z-index 설정
    modal.style.zIndex = '2000';
    modal.style.position = 'fixed';

    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let scrollTop = 0;
    let sliderDragging = false;
    let sliderManager = null;

    const setSliderDragging = (dragging) => {
      sliderDragging = dragging;
    };

    const setSliderManager = (manager) => {
      sliderManager = manager;
    };

    const handleDragStart = (e) => {
      if (window.innerWidth >= 768 || sliderDragging) return;

      e.preventDefault();
      isDragging = true;
      startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      if (dragHandle) {
        dragHandle.style.cursor = 'grabbing';
      }
      modalContent.style.transition = 'transform 0.1s ease-out';
    };

    const handleDragMove = (e) => {
      if (!isDragging || window.innerWidth >= 768 || sliderDragging) return;

      e.preventDefault();
      e.stopPropagation();

      currentY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const deltaY = Math.max(0, currentY - startY);

      if (deltaY > 0) {
        modalContent.style.transform = `translateY(${deltaY}px)`;
      }
    };

    const handleDragEnd = (e) => {
      if (!isDragging || window.innerWidth >= 768 || sliderDragging) {
        isDragging = false;
        return;
      }

      isDragging = false;
      if (dragHandle) {
        dragHandle.style.cursor = 'grab';
      }

      modalContent.style.transition =
        'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      const deltaY = currentY - startY;
      const threshold = 100;

      if (deltaY > threshold) {
        modalContent.style.transform = 'translateY(100%)';
        setTimeout(() => {
          closeTutorial();
          modalContent.style.transform = '';
        }, 350);
      } else {
        modalContent.style.transform = 'translateY(0)';
        setTimeout(() => {
          modalContent.style.transform = '';
        }, 350);
      }

      startY = 0;
      currentY = 0;
    };

    const initializeDragHandlers = () => {
      if (!dragHandle) return;

      dragHandle.addEventListener('touchstart', handleDragStart, {
        passive: false,
      });
      dragHandle.addEventListener('touchmove', handleDragMove, {
        passive: false,
      });
      dragHandle.addEventListener('touchend', handleDragEnd, {
        passive: false,
      });

      dragHandle.addEventListener('mousedown', handleDragStart);
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    };

    const openModal = () => {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      modalContent.style.transform = '';
      modal.classList.add('active');

      if (window.innerWidth < 768) {
        document.body.classList.add('modal-open');
        document.body.style.top = `-${scrollTop}px`;
      }
    };

    const closeModal = () => {
      modal.classList.remove('active');

      if (window.innerWidth < 768) {
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollTop);
      }
    };

    const closeTutorial = () => {
      closeModal();

      if (sliderManager) {
        sliderManager.destroySlider();
      }

      const dontShowCheckbox = document.querySelector(
        SELECTORS.DONT_SHOW_TODAY
      );
      const isDontShowChecked = dontShowCheckbox && dontShowCheckbox.checked;

      if (isDontShowChecked) {
        storageManager.saveDontShowToday();
      }

      storageManager.markExecutedInSession();
    };

    initializeDragHandlers();

    return {
      openModal,
      closeModal,
      closeTutorial,
      setSliderDragging,
      setSliderManager,
    };
  };

  // 자동재생 슬라이더 (드래그 지원)
  const createAutoPlaySliderWithDragSupport = (modalManager) => {
    const sliderElement = document.querySelector(SELECTORS.TUTORIAL_SLIDER);
    if (!sliderElement) {
      console.warn('⚠ 튜토리얼 슬라이더 요소를 찾을 수 없습니다');
      return null;
    }

    const slides = sliderElement.querySelectorAll('.slide-item');
    const slidesContainer = sliderElement.querySelector(
      SELECTORS.SLIDES_CONTAINER
    );
    const sliderTrack = sliderElement.querySelector(SELECTORS.SLIDER_TRACK);

    if (!slides.length || !slidesContainer || !sliderTrack) return null;

    let currentIndex = 0;
    let isPlaying = true;
    let intervalId = null;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const interval = 2300;

    const createProgressDots = () => {
      const progressDots = document.querySelector(SELECTORS.PROGRESS_DOTS);
      if (!progressDots) return;

      progressDots.innerHTML = '';

      for (let i = 0; i < slides.length; i++) {
        const li = document.createElement('li');
        li.role = 'presentation';

        const button = document.createElement('button');
        button.className = 'dot';
        button.role = 'tab';
        button.setAttribute('aria-label', `슬라이드 ${i + 1}로 이동`);
        button.dataset.index = i;
        button.style.setProperty('--animation-duration', `${interval}ms`);

        li.appendChild(button);
        progressDots.appendChild(li);
      }
    };

    const updateSlider = () => {
      if (sliderTrack && slidesContainer) {
        prevTranslate = -currentIndex * sliderTrack.offsetWidth;
        currentTranslate = prevTranslate;

        slidesContainer.classList.remove('no-transition');
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      const dots = document.querySelectorAll('#progressDots .dot');
      dots.forEach((dot, index) => {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');

        if (index === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        }
      });
    };

    const startAutoPlay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }

      if (!isPlaying || isDragging) return;

      intervalId = setInterval(() => {
        if (isDragging) return;
        goToNextSlide();
      }, interval);
    };

    const stopAutoPlay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateSlider();
      if (isPlaying && !isDragging) {
        startAutoPlay();
      }
    };

    const goToPreviousSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
      if (isPlaying && !isDragging) {
        startAutoPlay();
      }
    };

    const goToNextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
      if (isPlaying && !isDragging) {
        startAutoPlay();
      }
    };

    const togglePlay = () => {
      isPlaying = !isPlaying;
      const playBtn = document.querySelector(SELECTORS.PLAY_PAUSE_BTN);

      if (playBtn) {
        if (isPlaying) {
          playBtn.textContent = '⏸';
          playBtn.setAttribute('aria-label', '자동 재생 정지');
          startAutoPlay();
        } else {
          playBtn.textContent = '▶';
          playBtn.setAttribute('aria-label', '자동 재생 시작');
          stopAutoPlay();
        }
      }

      updateSlider();
    };

    const getPositionX = (e) => {
      return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    };

    const dragStart = (e) => {
      isDragging = true;

      if (isPlaying) {
        stopAutoPlay();
      }

      startPos = getPositionX(e);
      if (sliderTrack) {
        sliderTrack.classList.add('dragging');
      }
      document.body.classList.add('dragging');

      modalManager.setSliderDragging(true);
    };

    const dragMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      if (intervalId) {
        stopAutoPlay();
      }

      const currentPosition = getPositionX(e);
      const diff = currentPosition - startPos;
      currentTranslate = prevTranslate + diff;

      const maxTranslate = 0;
      const minTranslate = -(slides.length - 1) * sliderTrack.offsetWidth;
      currentTranslate = Math.max(
        minTranslate,
        Math.min(maxTranslate, currentTranslate)
      );

      if (slidesContainer) {
        slidesContainer.classList.add('no-transition');
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
      }
    };

    const dragEnd = (e) => {
      if (!isDragging) return;

      isDragging = false;
      if (sliderTrack) {
        sliderTrack.classList.remove('dragging');
      }
      document.body.classList.remove('dragging');

      modalManager.setSliderDragging(false);

      const movedBy = currentTranslate - prevTranslate;
      const threshold = sliderTrack ? sliderTrack.offsetWidth * 0.15 : 100;

      if (Math.abs(movedBy) > threshold) {
        if (movedBy > 0 && currentIndex > 0) {
          goToPreviousSlide();
        } else if (movedBy < 0 && currentIndex < slides.length - 1) {
          goToNextSlide();
        } else {
          updateSlider();
        }
      } else {
        updateSlider();
      }

      if (isPlaying) {
        setTimeout(() => {
          if (!isDragging) {
            startAutoPlay();
          }
        }, 100);
      }
    };

    const bindSliderEvents = () => {
      const playBtn = document.querySelector(SELECTORS.PLAY_PAUSE_BTN);
      if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
      }

      const progressDots = document.querySelector(SELECTORS.PROGRESS_DOTS);
      if (progressDots) {
        progressDots.addEventListener('click', (e) => {
          if (e.target.classList.contains('dot')) {
            const index = parseInt(e.target.dataset.index);
            goToSlide(index);
          }
        });
      }

      if (sliderTrack) {
        sliderTrack.addEventListener('mousedown', dragStart);
        sliderTrack.addEventListener('mousemove', dragMove);
        sliderTrack.addEventListener('mouseup', dragEnd);
        sliderTrack.addEventListener('mouseleave', dragEnd);

        sliderTrack.addEventListener('touchstart', dragStart, {
          passive: false,
          capture: true,
        });
        sliderTrack.addEventListener('touchmove', dragMove, {
          passive: false,
          capture: true,
        });
        sliderTrack.addEventListener('touchend', dragEnd, {
          passive: false,
          capture: true,
        });

        sliderTrack.addEventListener('contextmenu', (e) => e.preventDefault());
      }
    };

    const destroySlider = () => {
      stopAutoPlay();
    };

    const initialize = () => {
      createProgressDots();
      bindSliderEvents();
      if (isPlaying) {
        startAutoPlay();
      }
      updateSlider();
    };

    initialize();

    return {
      destroySlider,
    };
  };

  // 스크롤 기반 튜토리얼 트리거
  const createScrollBasedTutorialTrigger = (modalManager, storageManager) => {
    let lastScrollTop = 0;
    let scrollDirection = 'down';
    let executionCount = 0;
    let scrollHandlerActive = true;
    let scrollTimeout = null;

    const checkScrollTrigger = () => {
      if (!scrollHandlerActive || executionCount >= 1) return;

      // About Me 섹션을 트리거로 사용 (index.html에 맞게 수정)
      const aboutMeSection = document.querySelector('.about-me-section');
      if (!aboutMeSection) return;

      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        scrollDirection = 'down';
      } else if (currentScroll < lastScrollTop) {
        scrollDirection = 'up';
      }
      lastScrollTop = currentScroll;

      if (scrollDirection !== 'down') return;

      const sectionTop = aboutMeSection.offsetTop;
      const triggerPoint = sectionTop - 100;

      if (currentScroll >= triggerPoint) {
        if (storageManager.shouldShowTutorial()) {
          executionCount++;
          showTutorialModal();
          deactivateScrollHandler();
        }
      }
    };

    const scrollHandler = () => {
      if (!scrollHandlerActive) return;

      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        checkScrollTrigger();
        scrollTimeout = null;
      }, 50);
    };

    const activateScrollHandler = () => {
      scrollHandlerActive = true;
    };

    const deactivateScrollHandler = () => {
      scrollHandlerActive = false;
    };

    const showTutorialModal = () => {
      if (!storageManager.shouldShowTutorial()) return;

      deactivateScrollHandler();
      modalManager.openModal();

      const sliderManager = createAutoPlaySliderWithDragSupport(modalManager);
      modalManager.setSliderManager(sliderManager);
    };

    const initializeScrollTrigger = () => {
      const today = new Date().toDateString();
      const dontShowToday = localStorage.getItem(STORAGE_KEYS.DONT_SHOW_TODAY);
      const sessionExecuted = sessionStorage.getItem(
        STORAGE_KEYS.SESSION_EXECUTED
      );

      if (dontShowToday === today || sessionExecuted === 'true') {
        deactivateScrollHandler();
      }

      window.addEventListener('scroll', scrollHandler, { passive: true });

      setTimeout(() => {
        checkScrollTrigger();
      }, 500);
    };

    return {
      showTutorialModal,
      deactivateScrollHandler,
      activateScrollHandler,
      initializeScrollTrigger,
    };
  };

  // 이벤트 바인딩 관리
  const bindTutorialEventListeners = (modalManager, scrollTrigger) => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector(SELECTORS.TUTORIAL_MODAL);
        if (modal && modal.classList.contains('active')) {
          modalManager.closeTutorial();
        }
      }
    };

    const handleModalOverlayClick = (e) => {
      const modal = document.querySelector(SELECTORS.TUTORIAL_MODAL);
      if (modal && e.target === modal) {
        modalManager.closeTutorial();
      }
    };

    const handleManualTriggerClick = () => {
      scrollTrigger.deactivateScrollHandler();
      modalManager.openModal();

      const sliderManager = createAutoPlaySliderWithDragSupport(modalManager);
      modalManager.setSliderManager(sliderManager);
    };

    const handleModalCloseClick = () => {
      modalManager.closeTutorial();
    };

    const handleSkipTutorialClick = () => {
      modalManager.closeTutorial();
    };

    const bindAllEvents = () => {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleModalOverlayClick);

      const manualTriggerBtn = document.querySelector(
        SELECTORS.MANUAL_TRIGGER_BTN
      );
      if (manualTriggerBtn) {
        manualTriggerBtn.addEventListener('click', handleManualTriggerClick);
      }

      const modalCloseBtn = document.querySelector(SELECTORS.MODAL_CLOSE_BTN);
      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', handleModalCloseClick);
      }

      const skipTutorialBtn = document.querySelector(
        SELECTORS.SKIP_TUTORIAL_BTN
      );
      if (skipTutorialBtn) {
        skipTutorialBtn.addEventListener('click', handleSkipTutorialClick);
      }
    };

    bindAllEvents();

    return {
      openModalWithSlider: () => {
        modalManager.openModal();
        const sliderManager = createAutoPlaySliderWithDragSupport(modalManager);
        modalManager.setSliderManager(sliderManager);
      },
    };
  };

  // 메인 초기화 함수
  const initializeTutorialMain = () => {
    const storageManager = createTutorialDisplayPreferences();
    storageManager.cleanupOldPreferences();

    const modalManager = createResponsiveTutorialModal(storageManager);
    const scrollTrigger = createScrollBasedTutorialTrigger(
      modalManager,
      storageManager
    );
    const eventManager = bindTutorialEventListeners(
      modalManager,
      scrollTrigger
    );

    scrollTrigger.initializeScrollTrigger();

    console.log('✅ 튜토리얼 시스템 초기화 완료');

    return { storageManager, modalManager, scrollTrigger, eventManager };
  };

  // 튜토리얼 모달 시스템 초기화
  const initializeTutorialSystem = () => {
    try {
      return initializeTutorialMain();
    } catch (error) {
      console.error('⚠ 튜토리얼 시스템 초기화 중 에러:', error);
      return null;
    }
  };

  // 전역 API 노출
  window.TutorialModal = {
    initialize: () => {
      const tutorialSystem = initializeTutorialSystem();

      // 전역 API에 튜토리얼 시스템 추가
      if (tutorialSystem) {
        window.PortfolioApp = {
          ...window.PortfolioApp,
          tutorialSystem,
        };
      }

      return tutorialSystem;
    },
    showTutorial: () => {
      const tutorialSystem = initializeTutorialSystem();
      if (tutorialSystem && tutorialSystem.eventManager) {
        tutorialSystem.eventManager.openModalWithSlider();
      }
    },
  };

  console.log('🎯 튜토리얼 모달 스크립트 로드 완료');
})();
