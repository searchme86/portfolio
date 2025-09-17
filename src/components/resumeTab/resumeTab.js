// /src/components/resumeTab/resumeTab.js

let heightCalculationObservers = new Map();
let isCalculatingHeight = false;
let lastCalculatedHeight = new Map();

function calculateAndApplyAccordionHeight(accordionContent) {
  if (
    !accordionContent ||
    !accordionContent.classList.contains('active') ||
    isCalculatingHeight
  ) {
    return;
  }

  isCalculatingHeight = true;

  try {
    const originalMaxHeight = accordionContent.style.maxHeight;
    accordionContent.style.maxHeight = 'none';
    accordionContent.style.overflow = 'visible';

    const actualHeight = accordionContent.scrollHeight;
    const finalHeight = Math.max(actualHeight + 40, 100);

    // 이전 높이와 동일하면 스킵
    const previousHeight = lastCalculatedHeight.get(accordionContent);
    if (previousHeight === finalHeight) {
      accordionContent.style.maxHeight = originalMaxHeight;
      accordionContent.style.overflow = 'hidden';
      isCalculatingHeight = false;
      return;
    }

    lastCalculatedHeight.set(accordionContent, finalHeight);
    accordionContent.style.maxHeight = finalHeight + 'px';
    accordionContent.style.overflow = 'hidden';
  } catch (error) {
    // 에러 발생 시 기본값 설정
    accordionContent.style.maxHeight = '300px';
    accordionContent.style.overflow = 'hidden';
  } finally {
    isCalculatingHeight = false;
  }
}

const debouncedHeightCalculation = debounce((accordionContent) => {
  calculateAndApplyAccordionHeight(accordionContent);
}, 150);

function createContentMutationObserver(accordionContent) {
  if (
    !window.MutationObserver ||
    heightCalculationObservers.has(accordionContent)
  ) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    let shouldRecalculate = false;

    mutations.forEach((mutation) => {
      if (
        mutation.type === 'childList' &&
        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
      ) {
        shouldRecalculate = true;
      }

      if (mutation.type === 'characterData') {
        shouldRecalculate = true;
      }

      if (mutation.type === 'attributes') {
        const { attributeName } = mutation;
        if (
          attributeName === 'class' ||
          attributeName === 'style' ||
          attributeName === 'data-swiper-slide-index'
        ) {
          shouldRecalculate = true;
        }
      }
    });

    if (shouldRecalculate && accordionContent.classList.contains('active')) {
      debouncedHeightCalculation(accordionContent);
    }
  });

  observer.observe(accordionContent, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'data-swiper-slide-index'],
  });

  heightCalculationObservers.set(accordionContent, { mutation: observer });
}

function createContentResizeObserver(accordionContent) {
  if (
    !window.ResizeObserver ||
    !heightCalculationObservers.has(accordionContent)
  ) {
    return;
  }

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { target } = entry;
      const parentAccordion = target.closest('.accordion-content.active');
      if (parentAccordion === accordionContent) {
        debouncedHeightCalculation(accordionContent);
      }
    }
  });

  const observeTargets = accordionContent.querySelectorAll(`
    .swiper,
    .swiper-wrapper,
    .swiper-slide,
    .career-slider-list,
    .career-slide,
    .cv-container,
    .career-container,
    .detail-items-list,
    .company-list,
    .portfolio-link-container
  `);

  observeTargets.forEach((target) => {
    observer.observe(target);
  });

  const existingObservers = heightCalculationObservers.get(accordionContent);
  if (existingObservers) {
    existingObservers.resize = observer;
  }
}

function initializeAutoHeightCalculation() {
  const accordionContents = document.querySelectorAll('.accordion-content');

  accordionContents.forEach((content) => {
    createContentMutationObserver(content);
    createContentResizeObserver(content);

    if (content.classList.contains('active')) {
      requestAnimationFrame(() => {
        calculateAndApplyAccordionHeight(content);
      });
    }
  });
}

function cleanupHeightObservers(accordionContent) {
  const observers = heightCalculationObservers.get(accordionContent);
  if (observers) {
    if (observers.mutation) {
      observers.mutation.disconnect();
    }
    if (observers.resize) {
      observers.resize.disconnect();
    }
    heightCalculationObservers.delete(accordionContent);
    lastCalculatedHeight.delete(accordionContent);
  }
}

function cleanupAllHeightObservers() {
  heightCalculationObservers.forEach((observers, accordionContent) => {
    cleanupHeightObservers(accordionContent);
  });
}

// URL FRAGMENT MANAGEMENT SYSTEM
let currentResumeTabIndex = 0;
let isFragmentNavigation = false;
let lastFragmentIndex = -1;

const RESUME_TABS = ['introduction', 'career', 'portfolio'];

function getTabIndexFromFragment(fragment = window.location.hash) {
  if (!fragment) return 0;

  const tabName = fragment.replace('#', '');
  const index = RESUME_TABS.indexOf(tabName);
  return index !== -1 ? index : 0;
}

function getFragmentFromTabIndex(tabIndex) {
  if (tabIndex >= 0 && tabIndex < RESUME_TABS.length) {
    return '#' + RESUME_TABS[tabIndex];
  }
  return '';
}

function syncTabWithFragment() {
  const fragmentTabIndex = getTabIndexFromFragment();

  if (fragmentTabIndex !== lastFragmentIndex) {
    isFragmentNavigation = true;
    currentResumeTabIndex = fragmentTabIndex;
    lastFragmentIndex = fragmentTabIndex;
    updateResumeTabDisplay();
    isFragmentNavigation = false;
  }
}

function handleHashChange() {
  closeAllAccordionsInPreviousTabs();
  syncTabWithFragment();
}

function initializeFragmentNavigation() {
  const initialTabIndex = getTabIndexFromFragment();
  if (initialTabIndex !== 0 || window.location.hash) {
    currentResumeTabIndex = initialTabIndex;
    lastFragmentIndex = initialTabIndex;
  }

  window.addEventListener('hashchange', handleHashChange);
}

// RESUME TAB FUNCTIONALITY
let lastTabIndex = -1;

function updateResumeTabDisplay() {
  if (lastTabIndex === currentResumeTabIndex) return;

  const resumeTabsContainer = document.querySelector('.resume-tab-contents');
  const resumeTabContentWrapper = resumeTabsContainer?.querySelector(
    '.resume-tab-content-wrapper'
  );
  const resumeTabButtons = document.querySelectorAll('.resume-tab-button');

  if (!resumeTabContentWrapper || resumeTabButtons.length === 0) {
    return;
  }

  const translateX = -(currentResumeTabIndex * 33.333);
  resumeTabContentWrapper.style.transform = `translateX(${translateX}%)`;

  resumeTabButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === currentResumeTabIndex;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  lastTabIndex = currentResumeTabIndex;
}

function closeAllAccordionsInPreviousTabs() {
  const allAccordionHeaders = document.querySelectorAll('.accordion-header');
  const allAccordionContents = document.querySelectorAll('.accordion-content');

  allAccordionHeaders.forEach((header) => {
    header.setAttribute('aria-expanded', 'false');
  });

  allAccordionContents.forEach((content) => {
    content.classList.remove('active');
    content.style.maxHeight = '0px';
    content.style.overflow = 'hidden';
    lastCalculatedHeight.delete(content);
  });
}

function switchToResumeTab(tabIndex, updateUrl = true) {
  const resumeTabButtons = document.querySelectorAll('.resume-tab-button');

  if (
    tabIndex < 0 ||
    tabIndex >= resumeTabButtons.length ||
    tabIndex === currentResumeTabIndex
  ) {
    return;
  }

  closeAllAccordionsInPreviousTabs();
  currentResumeTabIndex = tabIndex;
  updateResumeTabDisplay();

  if (updateUrl && !isFragmentNavigation) {
    const newFragment = getFragmentFromTabIndex(tabIndex);
    if (newFragment && window.location.hash !== newFragment) {
      window.history.replaceState(null, '', newFragment);
    }
  }
}

function handleResumeTabClick(event) {
  const clickedButton = event.target.closest('.resume-tab-button');
  if (!clickedButton) return;

  const targetTabId = clickedButton.getAttribute('data-resume-tab');
  if (!targetTabId) return;

  const tabIndex = RESUME_TABS.indexOf(targetTabId);
  if (tabIndex !== -1) {
    switchToResumeTab(tabIndex, true);
  }
}

// ENHANCED ACCORDION FUNCTIONALITY
function initializeAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', handleAccordionClick);
  });
}

function handleAccordionClick(event) {
  const header = event.currentTarget;
  const targetId = header.getAttribute('data-accordion-target');
  const content = document.getElementById(targetId);

  if (!content) return;

  const resumeSection = header.closest('.resume-section');
  const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';

  if (resumeSection) {
    const allAccordionHeaders =
      resumeSection.querySelectorAll('.accordion-header');

    allAccordionHeaders.forEach((otherHeader) => {
      const otherTargetId = otherHeader.getAttribute('data-accordion-target');
      const otherContent = document.getElementById(otherTargetId);

      if (otherContent) {
        otherHeader.setAttribute('aria-expanded', 'false');
        otherContent.classList.remove('active');
        otherContent.style.maxHeight = '0px';
        otherContent.style.overflow = 'hidden';
        lastCalculatedHeight.delete(otherContent);
      }
    });

    if (!isCurrentlyExpanded) {
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('active');

      setTimeout(() => {
        calculateAndApplyAccordionHeight(content);
      }, 50);
    }
  } else {
    const allGlobalAccordionHeaders =
      document.querySelectorAll('.accordion-header');

    allGlobalAccordionHeaders.forEach((otherHeader) => {
      const otherTargetId = otherHeader.getAttribute('data-accordion-target');
      const otherContent = document.getElementById(otherTargetId);

      if (otherContent) {
        otherHeader.setAttribute('aria-expanded', 'false');
        otherContent.classList.remove('active');
        otherContent.style.maxHeight = '0px';
        otherContent.style.overflow = 'hidden';
        lastCalculatedHeight.delete(otherContent);
      }
    });

    if (!isCurrentlyExpanded) {
      header.setAttribute('aria-expanded', 'true');
      content.classList.add('active');

      setTimeout(() => {
        calculateAndApplyAccordionHeight(content);
      }, 50);
    }
  }
}

// SWIPER.JS FUNCTIONALITY
let swiperInstances = new Map();
let swiperLibraryLoaded = false;

function loadSwiperLibrary() {
  return new Promise((resolve, reject) => {
    if (window.Swiper && swiperLibraryLoaded) {
      resolve(window.Swiper);
      return;
    }

    const existingLink = document.querySelector('link[href*="swiper"]');
    const existingScript = document.querySelector('script[src*="swiper"]');

    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href =
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(link);
    }

    if (!existingScript) {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
      script.onload = () => {
        swiperLibraryLoaded = true;
        resolve(window.Swiper);
      };
      script.onerror = () => {
        reject(new Error('Swiper library load failed'));
      };
      document.head.appendChild(script);
    } else {
      swiperLibraryLoaded = true;
      resolve(window.Swiper);
    }
  });
}

function initializeSwipers() {
  loadSwiperLibrary()
    .then((Swiper) => {
      const swiperContainers = document.querySelectorAll('.swiper');

      swiperContainers.forEach((container, index) => {
        if (swiperInstances.has(container)) {
          return;
        }

        const swiper = new Swiper(container, {
          slidesPerView: 1,
          spaceBetween: 16,
          loop: false,
          grabCursor: true,
          touchRatio: 1,
          touchAngle: 45,
          threshold: 10,
          longSwipesRatio: 0.5,
          longSwipesMs: 300,
          shortSwipes: true,
          allowTouchMove: true,
          navigation: {
            nextEl: container.querySelector('.swiper-button-next'),
            prevEl: container.querySelector('.swiper-button-prev'),
          },
          pagination: {
            el: container.querySelector('.swiper-pagination'),
            clickable: true,
            dynamicBullets: false,
            dynamicMainBullets: 5,
          },
          keyboard: {
            enabled: true,
            onlyInViewport: true,
          },
          a11y: {
            enabled: true,
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
            firstSlideMessage: '첫 번째 슬라이드',
            lastSlideMessage: '마지막 슬라이드',
          },
          breakpoints: {
            360: {
              spaceBetween: 20,
            },
            768: {
              spaceBetween: 24,
            },
            1024: {
              spaceBetween: 32,
            },
          },
          on: {
            slideChange: function () {
              const accordionContent = container.closest(
                '.accordion-content.active'
              );
              if (accordionContent) {
                debouncedHeightCalculation(accordionContent);
              }
            },
            resize: function () {
              const accordionContent = container.closest(
                '.accordion-content.active'
              );
              if (accordionContent) {
                debouncedHeightCalculation(accordionContent);
              }
            },
            afterInit: function () {
              const accordionContent = container.closest(
                '.accordion-content.active'
              );
              if (accordionContent) {
                setTimeout(() => {
                  calculateAndApplyAccordionHeight(accordionContent);
                }, 100);
              }
            },
          },
        });

        swiperInstances.set(container, swiper);
      });
    })
    .catch((error) => {
      // Swiper 로드 실패 시 기본 스크롤 동작 유지
    });
}

function updateSwiperHeight(swiperContainer) {
  const swiperInstance = swiperInstances.get(swiperContainer);
  if (swiperInstance) {
    swiperInstance.updateAutoHeight();
    swiperInstance.update();
  }
}

function destroyAllSwipers() {
  swiperInstances.forEach((swiper, container) => {
    swiper.destroy(true, true);
  });
  swiperInstances.clear();
}

// CAREER SLIDE FUNCTIONALITY
function initializeCareerSlides() {
  const careerSliderLists = document.querySelectorAll('.career-slider-list');

  careerSliderLists.forEach((list) => {
    initializeCareerSlideList(list);
  });
}

function initializeCareerSlideList(sliderList) {
  const slides = sliderList.querySelectorAll('.career-slide');
  const controls = sliderList.parentElement.querySelector(
    '.career-slide-controls'
  );

  if (!slides.length || !controls) return;

  const prevButton = controls.querySelector('.career-slide-prev');
  const nextButton = controls.querySelector('.career-slide-next');
  const currentSlideSpan = controls.querySelector('.current-slide');
  const totalSlidesSpan = controls.querySelector('.total-slides');

  let currentSlide =
    parseInt(sliderList.getAttribute('data-current-slide')) || 0;

  updateCareerSlideDisplay(sliderList, slides, currentSlide);
  updateCareerSlideIndicator(
    currentSlideSpan,
    totalSlidesSpan,
    currentSlide,
    slides.length
  );

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
      sliderList.setAttribute('data-current-slide', currentSlide.toString());
      updateCareerSlideDisplay(sliderList, slides, currentSlide);
      updateCareerSlideIndicator(
        currentSlideSpan,
        totalSlidesSpan,
        currentSlide,
        slides.length
      );
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
      sliderList.setAttribute('data-current-slide', currentSlide.toString());
      updateCareerSlideDisplay(sliderList, slides, currentSlide);
      updateCareerSlideIndicator(
        currentSlideSpan,
        totalSlidesSpan,
        currentSlide,
        slides.length
      );
    });
  }
}

function updateCareerSlideDisplay(sliderList, slides, currentIndex) {
  slides.forEach((slide, index) => {
    const isActive = index === currentIndex;
    slide.classList.toggle('active', isActive);

    if (isActive) {
      slide.style.display = 'block';
      slide.setAttribute('tabindex', '0');
    } else {
      slide.style.display = 'none';
      slide.setAttribute('tabindex', '-1');
    }
  });

  const accordionContent = sliderList.closest('.accordion-content.active');
  if (accordionContent) {
    debouncedHeightCalculation(accordionContent);
  }
}

function updateCareerSlideIndicator(currentSpan, totalSpan, current, total) {
  if (currentSpan && totalSpan) {
    currentSpan.textContent = (current + 1).toString();
    totalSpan.textContent = total.toString();
  }
}

// KEYBOARD NAVIGATION
function initializeKeyboardNavigation() {
  document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleKeyboardNavigation(event) {
  const { target, key, ctrlKey, altKey } = event;

  if (ctrlKey && !altKey) {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
      const resumeTabButtons = document.querySelectorAll('.resume-tab-button');

      let newTabIndex;
      if (key === 'ArrowLeft') {
        newTabIndex =
          currentResumeTabIndex > 0
            ? currentResumeTabIndex - 1
            : resumeTabButtons.length - 1;
      } else {
        newTabIndex =
          currentResumeTabIndex < resumeTabButtons.length - 1
            ? currentResumeTabIndex + 1
            : 0;
      }

      switchToResumeTab(newTabIndex);
      resumeTabButtons[newTabIndex].focus();
    }
  }

  if (target.closest('.swiper-slide') && !ctrlKey && !altKey) {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
      const swiperContainer = target.closest('.swiper');
      const swiperInstance = swiperInstances.get(swiperContainer);

      if (swiperInstance) {
        if (key === 'ArrowLeft') {
          swiperInstance.slidePrev();
        } else {
          swiperInstance.slideNext();
        }
      }
    }
  }

  if (target.closest('.career-slide') && !ctrlKey && !altKey) {
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
      const careerSliderList = target.closest('.career-slider-list');
      const controls = careerSliderList?.parentElement?.querySelector(
        '.career-slide-controls'
      );

      if (controls) {
        const button =
          key === 'ArrowLeft'
            ? controls.querySelector('.career-slide-prev')
            : controls.querySelector('.career-slide-next');
        button?.click();
      }
    }
  }

  if (key === 'Escape' && target.closest('.accordion-content.active')) {
    const accordionContent = target.closest('.accordion-content');
    const header = document.querySelector(
      `[data-accordion-target="${accordionContent.id}"]`
    );
    if (header) {
      header.click();
      header.focus();
    }
  }
}

// FOCUS MANAGEMENT
function initializeFocusManagement() {
  const resumeTabButtons = document.querySelectorAll('.resume-tab-button');
  resumeTabButtons.forEach((button) => {
    button.addEventListener('focus', () => {
      // 포커스 처리 로직만 유지
    });
  });

  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach((header) => {
    header.addEventListener('focus', () => {
      // 포커스 처리 로직만 유지
    });
  });
}

// INTERSECTION OBSERVER
function initializeIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        if (entry.target.classList.contains('swiper')) {
          const swiperInstance = swiperInstances.get(entry.target);
          if (swiperInstance) {
            swiperInstance.update();
          }
        } else if (entry.target.classList.contains('career-slider-list')) {
          initializeCareerSlideList(entry.target);
        }
      }
    });
  }, observerOptions);

  const elementsToObserve = [
    ...document.querySelectorAll('.swiper'),
    ...document.querySelectorAll('.career-slider-list'),
    ...document.querySelectorAll('.company-item'),
    ...document.querySelectorAll('.accordion-item'),
    ...document.querySelectorAll('.portfolio-link-container'),
  ];

  elementsToObserve.forEach((element) => {
    observer.observe(element);
  });
}

// UTILITY FUNCTIONS
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// EVENT LISTENERS
function attachResumeTabEventListeners() {
  const resumeTabButtons = document.querySelectorAll('.resume-tab-button');

  resumeTabButtons.forEach((button) => {
    button.addEventListener('click', handleResumeTabClick);
  });

  const handleResize = debounce(() => {
    updateResumeTabDisplay();
    swiperInstances.forEach((swiper) => {
      swiper.update();
    });
  }, 250);

  window.addEventListener('resize', handleResize);
}

// INITIALIZATION
function initializeResumeTab() {
  try {
    initializeFragmentNavigation();
    attachResumeTabEventListeners();
    initializeAccordion();
    initializeCareerSlides();
    initializeKeyboardNavigation();
    initializeFocusManagement();

    setTimeout(() => {
      initializeIntersectionObserver();
      initializeAutoHeightCalculation();
      initializeSwipers();
    }, 150);

    validateInitialState();
  } catch (error) {
    // 초기화 실패 시 기본 동작 유지
  }
}

function validateInitialState() {
  const initialTabIndex = getTabIndexFromFragment();
  currentResumeTabIndex = initialTabIndex;
  lastTabIndex = -1;

  const resumeTabButtons = document.querySelectorAll('.resume-tab-button');
  resumeTabButtons.forEach((button, index) => {
    const isActive = index === currentResumeTabIndex;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  updateResumeTabDisplay();

  const careerSliderLists = document.querySelectorAll('.career-slider-list');
  careerSliderLists.forEach((list) => {
    const activeSlide = list.querySelector('.career-slide.active');
    if (!activeSlide) {
      const firstSlide = list.querySelector('.career-slide');
      if (firstSlide) {
        firstSlide.classList.add('active');
      }
    }
  });
}

// ERROR HANDLING
window.addEventListener('error', (event) => {
  if (event.filename && event.filename.includes('resumeTab.js')) {
    // 에러 로깅은 제거하고 기본 동작만 유지
  }
});

// CLEANUP
window.addEventListener('beforeunload', () => {
  cleanupAllHeightObservers();
  destroyAllSwipers();
});

// GLOBAL EXPORT
window.ResumeTabComponent = {
  initialize: initializeResumeTab,
  switchToTab: switchToResumeTab,
  handleClick: handleResumeTabClick,
  attachEventListeners: attachResumeTabEventListeners,
  initializeAccordion: initializeAccordion,
  initializeSwipers: initializeSwipers,
  initializeCareerSlides: initializeCareerSlides,
  validateState: validateInitialState,
  getCurrentTabIndex: () => currentResumeTabIndex,
  initializeAutoHeightCalculation: initializeAutoHeightCalculation,
  calculateAndApplyAccordionHeight: calculateAndApplyAccordionHeight,
  cleanupHeightObservers: cleanupHeightObservers,
  cleanupAllHeightObservers: cleanupAllHeightObservers,
  initializeFragmentNavigation: initializeFragmentNavigation,
  syncTabWithFragment: syncTabWithFragment,
  getTabIndexFromFragment: getTabIndexFromFragment,
  getFragmentFromTabIndex: getFragmentFromTabIndex,
  closeAllAccordionsInPreviousTabs: closeAllAccordionsInPreviousTabs,
  loadSwiperLibrary: loadSwiperLibrary,
  updateSwiperHeight: updateSwiperHeight,
  destroyAllSwipers: destroyAllSwipers,
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeResumeTab, 100);
  });
} else {
  setTimeout(initializeResumeTab, 100);
}
