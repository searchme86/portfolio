// /src/scripts/app.js

(function () {
  'use strict';

  console.log('🚀 메인 초기화 스크립트 시작');

  // 컴포넌트 존재 여부 확인 헬퍼 함수
  const checkComponentExists = (componentName) => {
    const exists =
      window[componentName] && typeof window[componentName] === 'object';
    if (!exists) {
      console.warn(`⚠️ ${componentName} 컴포넌트를 찾을 수 없습니다`);
    }
    return exists;
  };

  // 메서드 존재 여부 확인 헬퍼 함수
  const checkMethodExists = (component, methodName) => {
    const exists = component && typeof component[methodName] === 'function';
    if (!exists) {
      console.warn(`⚠️ ${methodName} 메서드를 찾을 수 없습니다`);
    }
    return exists;
  };

  // DOM 요소 존재 여부 확인 헬퍼 함수
  const checkElementExists = (selector) => {
    const element =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!element) {
      console.warn(`⚠️ DOM 요소를 찾을 수 없습니다: ${selector}`);
      return false;
    }
    return true;
  };

  // 키보드 내비게이션 향상
  const enhanceKeyboardNavigation = () => {
    document.addEventListener('keydown', (event) => {
      const { key, target } = event;

      if (key === 'Enter' || key === ' ') {
        // 프로젝트 탭 버튼 처리
        if (target.classList.contains('project-tab-button')) {
          event.preventDefault();
          target.click();
          console.log(
            '⌨️ 키보드로 프로젝트 탭 전환:',
            target.getAttribute('data-project-tab')
          );
        }
        // Resume 탭 버튼 처리
        else if (target.classList.contains('resume-tab-button')) {
          event.preventDefault();
          target.click();
          console.log(
            '⌨️ 키보드로 Resume 탭 전환:',
            target.getAttribute('data-resume-tab')
          );
        }
        // 일반 아코디언 버튼 처리
        else if (target.classList.contains('accordion-button')) {
          event.preventDefault();
          target.click();
          console.log('⌨️ 키보드로 아코디언 토글');
        }
        // 경력 아코디언 버튼 처리
        else if (target.classList.contains('career-accordion-button')) {
          event.preventDefault();
          target.click();
          console.log('⌨️ 키보드로 경력 아코디언 토글');
        }
      }

      // 숫자 키로 프로젝트 탭 전환 (1: React, 2: Animation, 3: Chart, 4: Others)
      if (
        key >= '1' &&
        key <= '4' &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        const tabIndex = parseInt(key) - 1;
        const projectTabs = ['react', 'animation', 'chart', 'others'];
        const targetTab = projectTabs[tabIndex];

        if (targetTab) {
          const tabButton = document.querySelector(
            `[data-project-tab="${targetTab}"]`
          );
          if (tabButton) {
            tabButton.click();
            console.log('⌨️ 키보드 숫자키로 프로젝트 탭 전환:', targetTab);
          }
        }
      }

      // F1, F2 키로 Resume 탭 전환
      if (
        (key === 'F1' || key === 'F2') &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        const resumeTabs = ['introduction', 'career'];
        const targetTab = key === 'F1' ? resumeTabs[0] : resumeTabs[1];

        const tabButton = document.querySelector(
          `[data-resume-tab="${targetTab}"]`
        );
        if (tabButton) {
          tabButton.click();
          console.log('⌨️ 키보드 펑션키로 Resume 탭 전환:', targetTab);
        }
      }
    });

    console.log('⌨️ 키보드 내비게이션 향상 완료');
  };

  // 안전한 컴포넌트 초기화 함수
  const safeInitializeComponent = (
    componentName,
    initMethodName = 'initialize'
  ) => {
    try {
      if (checkComponentExists(componentName)) {
        const component = window[componentName];
        if (checkMethodExists(component, initMethodName)) {
          component[initMethodName]();
          console.log(`✅ ${componentName} 초기화 완료`);
          return true;
        }
      }
    } catch (error) {
      console.error(`❌ ${componentName} 초기화 중 오류:`, error);
    }
    return false;
  };

  // 초기화 함수
  const initializeCompletePortfolio = () => {
    console.log('🚀 포트폴리오 초기화 시작');

    const initializationResults = {};

    try {
      // 튜토리얼 시스템 초기화
      initializationResults.tutorialModal =
        safeInitializeComponent('TutorialModal');

      // Hero 컴포넌트 초기화
      initializationResults.heroLogoAnimation =
        safeInitializeComponent('HeroLogoAnimation');
      initializationResults.heroYoutubePlayer =
        safeInitializeComponent('HeroYoutubePlayer');
      initializationResults.headerAnimation =
        safeInitializeComponent('HeaderAnimation');

      // 기존 컴포넌트들 초기화
      initializationResults.themeToggle =
        safeInitializeComponent('ThemeToggle');
      initializationResults.accordionComponent =
        safeInitializeComponent('AccordionComponent');
      initializationResults.projectTabComponent = safeInitializeComponent(
        'ProjectTabComponent'
      );
      initializationResults.resumeTabComponent =
        safeInitializeComponent('ResumeTabComponent');
      initializationResults.profileComponent =
        safeInitializeComponent('ProfileComponent');
      initializationResults.aboutMeComponent =
        safeInitializeComponent('AboutMeComponent');
      initializationResults.careerComponent =
        safeInitializeComponent('CareerComponent');

      // 부가 기능들
      enhanceKeyboardNavigation();

      // 반응형 처리
      window.addEventListener('resize', handleWindowResize);
      console.log('✅ Resize 이벤트 리스너 등록 완료');

      // 초기화 결과 요약
      const successCount = Object.values(initializationResults).filter(
        Boolean
      ).length;
      const totalCount = Object.keys(initializationResults).length;

      console.log(
        `✅ 포트폴리오 초기화 완료 (${successCount}/${totalCount} 컴포넌트 성공)`
      );
    } catch (error) {
      console.error('⚠ 초기화 중 예상치 못한 에러 발생:', error);
    }
  };

  // 안전한 윈도우 리사이즈 핸들러
  const handleWindowResize = () => {
    console.log('📱 화면 크기 변경 감지');

    // 디바운싱을 위한 지연 실행
    setTimeout(() => {
      try {
        // 프로젝트 탭 인디케이터 업데이트
        if (checkComponentExists('ProjectTabComponent')) {
          const projectTabComponent = window.ProjectTabComponent;
          if (checkMethodExists(projectTabComponent, 'updateIndicator')) {
            projectTabComponent.updateIndicator();
          } else if (checkMethodExists(projectTabComponent, 'handleResize')) {
            projectTabComponent.handleResize();
          }
        }

        // Resume 탭 처리
        if (checkComponentExists('ResumeTabComponent')) {
          const resumeTabComponent = window.ResumeTabComponent;
          if (checkMethodExists(resumeTabComponent, 'handleResize')) {
            resumeTabComponent.handleResize();
          }
        }

        // 일반 아코디언 크기 재조정
        const expandedItems = document.querySelectorAll(
          '.accordion-item.expanded'
        );
        expandedItems.forEach((item) => {
          try {
            const tray = item.querySelector('.accordion-tray');
            if (tray) {
              tray.style.height = tray.scrollHeight + 'px';
            }
          } catch (error) {
            console.warn('⚠️ 아코디언 크기 재조정 중 오류:', error);
          }
        });

        // 경력 아코디언 크기 재조정
        const expandedCareerItems = document.querySelectorAll(
          '.career-accordion-item .career-accordion-content[data-expanded="true"]'
        );
        expandedCareerItems.forEach((content) => {
          try {
            content.style.height = content.scrollHeight + 'px';
          } catch (error) {
            console.warn('⚠️ 경력 아코디언 크기 재조정 중 오류:', error);
          }
        });

        console.log('📱 반응형 레이아웃 재조정 완료');
      } catch (error) {
        console.error('❌ 리사이즈 핸들러 실행 중 오류:', error);
      }
    }, 100);
  };

  // 안전한 DOM 로드 감지 및 초기화
  const initializeApp = () => {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          console.log('📄 DOM 로드 완료 - 초기화 시작');
          initializeCompletePortfolio();
        });
        console.log('⏳ DOM 로드 대기 중...');
      } else {
        // 이미 로드된 경우 즉시 실행
        console.log('⚡ DOM 이미 로드됨 - 즉시 초기화 실행');
        initializeCompletePortfolio();
      }
    } catch (error) {
      console.error('❌ 앱 초기화 중 치명적 오류:', error);
    }
  };

  // 전역 에러 핸들러 등록
  window.addEventListener('error', (event) => {
    console.error('🚨 전역 JavaScript 오류 감지:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 처리되지 않은 Promise 거부 감지:', event.reason);
  });

  // 앱 시작
  initializeApp();

  console.log('🎯 메인 스크립트 로드 완료');

  // 전역에서 접근 가능한 안전한 API 노출
  window.PortfolioApp = {
    // 재초기화
    reinitialize: () => {
      console.log('🔄 포트폴리오 재초기화 시작');
      initializeCompletePortfolio();
    },

    // 키보드 내비게이션 재설정
    enhanceKeyboard: enhanceKeyboardNavigation,

    // 리사이즈 핸들러 수동 실행
    handleResize: handleWindowResize,

    // 튜토리얼 표시 (안전한 방식)
    showTutorial: () => {
      if (checkComponentExists('TutorialModal')) {
        const tutorialModal = window.TutorialModal;
        if (checkMethodExists(tutorialModal, 'showTutorial')) {
          tutorialModal.showTutorial();
        }
      }
    },

    // 디버그 정보 출력
    debug: () => {
      console.log('🔍 Portfolio App 디버그 정보:');
      console.log('- DOM 상태:', document.readyState);
      console.log('- 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
      console.log('- User Agent:', navigator.userAgent);

      // 각 컴포넌트 상태 확인
      const components = [
        'TutorialModal',
        'HeroLogoAnimation',
        'HeroYoutubePlayer',
        'HeaderAnimation',
        'ThemeToggle',
        'AccordionComponent',
        'ProjectTabComponent',
        'ResumeTabComponent',
        'ProfileComponent',
        'AboutMeComponent',
        'CareerComponent',
      ];

      components.forEach((componentName) => {
        const exists = checkComponentExists(componentName);
        console.log(`- ${componentName}: ${exists ? '✅' : '❌'}`);
      });
    },

    // 헬퍼 함수들
    utils: {
      checkComponent: checkComponentExists,
      checkMethod: checkMethodExists,
      checkElement: checkElementExists,
      safeInit: safeInitializeComponent,
    },
  };
})();
