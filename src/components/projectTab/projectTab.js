// /src/components/projectTab/projectTab.js

console.log('🎯 Apple 스타일 프로젝트 탭 + 레이아웃 전환 모듈 로드 완료');

// ============ APPLE STYLE PROJECT TAB WITH LAYOUT SWITCHER ============

class AppleProjectTabNavigation {
  constructor() {
    this.currentActiveTabName = 'react';
    this.currentLayoutType = 'card';
    this.isInitialized = false;
    this.hasRequiredElements = false;

    // DOM 요소들 초기화
    this.initializeDOMElements();

    console.log('🎯 Apple 프로젝트 탭 + 레이아웃 전환 초기화 시작');
    console.log('탭 버튼 개수:', this.tabButtons ? this.tabButtons.length : 0);
    console.log(
      '탭 컨텐츠 개수:',
      this.tabContents ? this.tabContents.length : 0
    );
    console.log(
      '레이아웃 버튼 개수:',
      this.layoutButtons ? this.layoutButtons.length : 0
    );
    console.log('필수 요소 존재 여부:', this.hasRequiredElements);
  }

  // DOM 요소 초기화 및 검증
  initializeDOMElements() {
    try {
      // 기본 DOM 요소들 선택
      this.tabButtons = document.querySelectorAll('.project-tab-button');
      this.tabContents = document.querySelectorAll('.project-tab-content');
      this.tabIndicator = document.getElementById('projectTabIndicator');
      this.layoutButtons = document.querySelectorAll('.layout-button');
      this.tabContentContainer = document.querySelector(
        '.project-tab-content-container'
      );

      // 필수 요소들 검증
      this.hasRequiredElements = this.validateRequiredElements();

      if (!this.hasRequiredElements) {
        console.warn(
          '⚠️ 프로젝트 탭 필수 요소가 부족하여 제한된 기능으로 동작합니다'
        );
      }
    } catch (error) {
      console.error('❌ DOM 요소 초기화 중 오류:', error);
      this.hasRequiredElements = false;
    }
  }

  // 필수 요소 검증
  validateRequiredElements() {
    const validationResults = {
      tabButtons: this.tabButtons && this.tabButtons.length > 0,
      tabContents: this.tabContents && this.tabContents.length > 0,
      layoutButtons: this.layoutButtons && this.layoutButtons.length > 0,
      tabContentContainer: !!this.tabContentContainer,
    };

    console.log('🔍 요소 검증 결과:', validationResults);

    // 기본 탭 기능을 위한 최소 요구사항
    const hasMinimumRequirements =
      validationResults.tabButtons && validationResults.tabContents;

    if (!hasMinimumRequirements) {
      console.warn('⚠️ 기본 탭 기능을 위한 최소 요구사항이 충족되지 않습니다');
    }

    if (!validationResults.layoutButtons) {
      console.warn(
        '⚠️ 레이아웃 전환 버튼이 없어 레이아웃 기능이 비활성화됩니다'
      );
    }

    if (!this.tabIndicator) {
      console.warn('⚠️ 탭 인디케이터가 없어 인디케이터 기능이 비활성화됩니다');
    }

    return hasMinimumRequirements;
  }

  // 안전한 요소 선택 헬퍼
  safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.error(`❌ 요소 선택 중 오류 (${selector}):`, error);
      return null;
    }
  }

  // 안전한 요소 선택 헬퍼 (다중)
  safeQuerySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.error(`❌ 요소 선택 중 오류 (${selector}):`, error);
      return [];
    }
  }

  // 탭 네비게이션 초기화
  initializeTabNavigation() {
    if (this.isInitialized) {
      console.log('⚠️ 이미 초기화됨 - 건너뛰기');
      return false;
    }

    if (!this.hasRequiredElements) {
      console.log('⚠️ 필수 요소가 없어 탭 네비게이션 초기화를 건너뜁니다');
      return false;
    }

    try {
      // 탭 버튼 이벤트 리스너
      this.attachTabButtonListeners();

      // 레이아웃 버튼 이벤트 리스너 (레이아웃 버튼이 있는 경우에만)
      if (this.layoutButtons && this.layoutButtons.length > 0) {
        this.attachLayoutButtonListeners();
      }

      this.isInitialized = true;
      console.log('✅ 프로젝트 탭 + 레이아웃 전환 이벤트 리스너 등록 완료');
      return true;
    } catch (error) {
      console.error('❌ 탭 네비게이션 초기화 중 오류:', error);
      return false;
    }
  }

  // 탭 버튼 이벤트 리스너 등록
  attachTabButtonListeners() {
    if (!this.tabButtons || this.tabButtons.length === 0) {
      console.warn('⚠️ 탭 버튼이 없어 리스너 등록을 건너뜁니다');
      return;
    }

    this.tabButtons.forEach((tabButton, buttonIndex) => {
      try {
        // 클릭 이벤트
        tabButton.addEventListener('click', (clickEvent) => {
          const { projectTab: selectedTabName } = clickEvent.target.dataset;

          if (selectedTabName) {
            console.log(
              `🔄 프로젝트 탭 전환: ${this.currentActiveTabName} → ${selectedTabName}`
            );
            console.log('클릭된 버튼 인덱스:', buttonIndex);

            this.switchToTab(selectedTabName);
            this.updateIndicatorPosition();
          }
        });

        // 키보드 접근성 지원
        tabButton.addEventListener('keydown', (keyboardEvent) => {
          this.handleKeyboardNavigation(keyboardEvent);
        });

        // 터치 디바이스 지원
        tabButton.addEventListener('touchstart', () => {
          tabButton.style.opacity = '0.7';
        });

        tabButton.addEventListener('touchend', () => {
          tabButton.style.opacity = '';
        });
      } catch (error) {
        console.error(`❌ 탭 버튼 ${buttonIndex} 리스너 등록 중 오류:`, error);
      }
    });
  }

  // 레이아웃 버튼 이벤트 리스너 등록
  attachLayoutButtonListeners() {
    if (!this.layoutButtons || this.layoutButtons.length === 0) {
      console.warn('⚠️ 레이아웃 버튼이 없어 리스너 등록을 건너뜁니다');
      return;
    }

    this.layoutButtons.forEach((layoutButton, buttonIndex) => {
      try {
        // 클릭 이벤트
        layoutButton.addEventListener('click', (clickEvent) => {
          const { layout: selectedLayoutType } = clickEvent.target.dataset;

          if (selectedLayoutType) {
            console.log(
              `🔄 레이아웃 전환: ${this.currentLayoutType} → ${selectedLayoutType}`
            );
            console.log('클릭된 레이아웃 버튼 인덱스:', buttonIndex);

            this.switchToLayout(selectedLayoutType);
          }
        });

        // 키보드 접근성 지원
        layoutButton.addEventListener('keydown', (keyboardEvent) => {
          this.handleLayoutKeyboardNavigation(keyboardEvent);
        });

        // 터치 디바이스 지원
        layoutButton.addEventListener('touchstart', () => {
          layoutButton.style.opacity = '0.7';
        });

        layoutButton.addEventListener('touchend', () => {
          layoutButton.style.opacity = '';
        });
      } catch (error) {
        console.error(
          `❌ 레이아웃 버튼 ${buttonIndex} 리스너 등록 중 오류:`,
          error
        );
      }
    });
  }

  // 탭 전환 함수
  switchToTab(targetTabName) {
    if (!targetTabName) {
      console.error('⌨ 대상 탭명이 없습니다');
      return false;
    }

    if (!this.hasRequiredElements) {
      console.warn('⚠️ 필수 요소가 없어 탭 전환을 수행할 수 없습니다');
      return false;
    }

    try {
      // 모든 탭 버튼의 활성 상태 제거
      if (this.tabButtons) {
        this.tabButtons.forEach((tabButton) => {
          const isCurrentlyActive = tabButton.classList.contains('active');
          tabButton.classList.remove('active');
          tabButton.setAttribute('aria-selected', 'false');

          if (isCurrentlyActive) {
            console.log(`⌨ 탭 비활성화: ${tabButton.dataset.projectTab}`);
          }
        });
      }

      // 모든 탭 컨텐츠 숨기기
      if (this.tabContents) {
        this.tabContents.forEach((tabContent) => {
          const wasVisible = tabContent.classList.contains('active');
          tabContent.classList.remove('active');

          if (wasVisible) {
            console.log(`👁️‍🗨️ 컨텐츠 숨김: ${tabContent.id}`);
          }
        });
      }

      // 선택된 탭 활성화
      const selectedTabButton = this.safeQuerySelector(
        `[data-project-tab="${targetTabName}"]`
      );
      const selectedTabContent = document.getElementById(
        `${targetTabName}-panel`
      );

      if (selectedTabButton && selectedTabContent) {
        selectedTabButton.classList.add('active');
        selectedTabButton.setAttribute('aria-selected', 'true');
        selectedTabContent.classList.add('active');

        this.currentActiveTabName = targetTabName;

        console.log(`✅ 프로젝트 탭 활성화: ${targetTabName}`);
        console.log(`👁️ 컨텐츠 표시: ${selectedTabContent.id}`);
        return true;
      } else {
        console.error(`⌨ 프로젝트 탭을 찾을 수 없음: ${targetTabName}`);
        return false;
      }
    } catch (error) {
      console.error('❌ 탭 전환 중 오류:', error);
      return false;
    }
  }

  // 레이아웃 전환 함수
  switchToLayout(targetLayoutType) {
    if (!targetLayoutType) {
      console.error('⌨ 대상 레이아웃 타입이 없습니다');
      return false;
    }

    if (!this.tabContentContainer) {
      console.warn(
        '⚠️ 탭 컨텐츠 컨테이너가 없어 레이아웃 전환을 수행할 수 없습니다'
      );
      return false;
    }

    try {
      // 모든 레이아웃 버튼의 활성 상태 제거
      if (this.layoutButtons) {
        this.layoutButtons.forEach((layoutButton) => {
          const isCurrentlyActive = layoutButton.classList.contains('active');
          layoutButton.classList.remove('active');
          layoutButton.setAttribute('aria-pressed', 'false');

          if (isCurrentlyActive) {
            console.log(`⌨ 레이아웃 비활성화: ${layoutButton.dataset.layout}`);
          }
        });
      }

      // 선택된 레이아웃 버튼 활성화
      const selectedLayoutButton = this.safeQuerySelector(
        `[data-layout="${targetLayoutType}"]`
      );

      if (selectedLayoutButton) {
        selectedLayoutButton.classList.add('active');
        selectedLayoutButton.setAttribute('aria-pressed', 'true');

        // 탭 컨텐츠 컨테이너에 data-layout 속성 변경
        this.tabContentContainer.setAttribute('data-layout', targetLayoutType);

        this.currentLayoutType = targetLayoutType;

        console.log(`✅ 레이아웃 활성화: ${targetLayoutType}`);
        console.log(
          `🎨 컨테이너 레이아웃 변경: data-layout="${targetLayoutType}"`
        );

        // 레이아웃 변경 애니메이션을 위한 일시적 클래스 추가
        this.tabContentContainer.classList.add('layout-changing');
        setTimeout(() => {
          this.tabContentContainer.classList.remove('layout-changing');
        }, 300);

        return true;
      } else {
        console.error(`⌨ 레이아웃 버튼을 찾을 수 없음: ${targetLayoutType}`);
        return false;
      }
    } catch (error) {
      console.error('❌ 레이아웃 전환 중 오류:', error);
      return false;
    }
  }

  // 인디케이터 위치 업데이트
  updateIndicatorPosition() {
    if (!this.tabIndicator) {
      console.warn(
        '⚠️ 프로젝트 탭 인디케이터가 없어 위치 업데이트를 건너뜁니다'
      );
      return false;
    }

    try {
      const activeTabButton = this.safeQuerySelector(
        '.project-tab-button.active'
      );

      if (!activeTabButton) {
        console.error('⌨ 활성 프로젝트 탭 버튼을 찾을 수 없음');
        return false;
      }

      const containerElement = activeTabButton.parentElement;
      const { offsetLeft: buttonOffsetLeft, offsetWidth: buttonWidth } =
        activeTabButton;
      const containerPadding =
        parseInt(getComputedStyle(containerElement).paddingLeft) || 6;

      const indicatorLeft = buttonOffsetLeft - containerPadding;
      const indicatorWidth = buttonWidth;

      console.log('📏 프로젝트 탭 인디케이터 위치 계산:');
      console.log('- 버튼 위치:', buttonOffsetLeft);
      console.log('- 버튼 너비:', buttonWidth);
      console.log('- 컨테이너 패딩:', containerPadding);
      console.log('- 최종 인디케이터 위치:', indicatorLeft);
      console.log('- 최종 인디케이터 너비:', indicatorWidth);

      this.tabIndicator.style.left = `${indicatorLeft}px`;
      this.tabIndicator.style.width = `${indicatorWidth}px`;
      return true;
    } catch (error) {
      console.error('❌ 인디케이터 위치 업데이트 중 오류:', error);
      return false;
    }
  }

  // 탭 키보드 네비게이션 처리
  handleKeyboardNavigation(keyboardEvent) {
    if (!this.tabButtons || this.tabButtons.length === 0) {
      console.warn('⚠️ 탭 버튼이 없어 키보드 네비게이션을 수행할 수 없습니다');
      return;
    }

    try {
      const currentTabButtons = Array.from(this.tabButtons);
      const currentActiveIndex = currentTabButtons.findIndex((button) =>
        button.classList.contains('active')
      );

      let nextActiveIndex = currentActiveIndex;

      switch (keyboardEvent.key) {
        case 'ArrowLeft':
          nextActiveIndex =
            currentActiveIndex > 0
              ? currentActiveIndex - 1
              : currentTabButtons.length - 1;
          keyboardEvent.preventDefault();
          break;

        case 'ArrowRight':
          nextActiveIndex =
            currentActiveIndex < currentTabButtons.length - 1
              ? currentActiveIndex + 1
              : 0;
          keyboardEvent.preventDefault();
          break;

        case 'Home':
          nextActiveIndex = 0;
          keyboardEvent.preventDefault();
          break;

        case 'End':
          nextActiveIndex = currentTabButtons.length - 1;
          keyboardEvent.preventDefault();
          break;

        default:
          return; // 다른 키는 무시
      }

      if (nextActiveIndex !== currentActiveIndex) {
        const nextTabButton = currentTabButtons[nextActiveIndex];
        const nextTabName = nextTabButton.dataset.projectTab;

        console.log(
          `⌨️ 키보드 프로젝트 탭 전환: ${this.currentActiveTabName} → ${nextTabName}`
        );

        this.switchToTab(nextTabName);
        this.updateIndicatorPosition();
        nextTabButton.focus();
      }
    } catch (error) {
      console.error('❌ 키보드 네비게이션 처리 중 오류:', error);
    }
  }

  // 레이아웃 키보드 네비게이션 처리
  handleLayoutKeyboardNavigation(keyboardEvent) {
    if (!this.layoutButtons || this.layoutButtons.length === 0) {
      console.warn(
        '⚠️ 레이아웃 버튼이 없어 키보드 네비게이션을 수행할 수 없습니다'
      );
      return;
    }

    try {
      const currentLayoutButtons = Array.from(this.layoutButtons);
      const currentActiveIndex = currentLayoutButtons.findIndex((button) =>
        button.classList.contains('active')
      );

      let nextActiveIndex = currentActiveIndex;

      switch (keyboardEvent.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          nextActiveIndex =
            currentActiveIndex > 0
              ? currentActiveIndex - 1
              : currentLayoutButtons.length - 1;
          keyboardEvent.preventDefault();
          break;

        case 'ArrowRight':
        case 'ArrowDown':
          nextActiveIndex =
            currentActiveIndex < currentLayoutButtons.length - 1
              ? currentActiveIndex + 1
              : 0;
          keyboardEvent.preventDefault();
          break;

        case 'Enter':
        case ' ':
          keyboardEvent.target.click();
          keyboardEvent.preventDefault();
          break;

        default:
          return; // 다른 키는 무시
      }

      if (
        nextActiveIndex !== currentActiveIndex &&
        (keyboardEvent.key === 'ArrowLeft' ||
          keyboardEvent.key === 'ArrowUp' ||
          keyboardEvent.key === 'ArrowRight' ||
          keyboardEvent.key === 'ArrowDown')
      ) {
        const nextLayoutButton = currentLayoutButtons[nextActiveIndex];
        const nextLayoutType = nextLayoutButton.dataset.layout;

        console.log(
          `⌨️ 키보드 레이아웃 전환: ${this.currentLayoutType} → ${nextLayoutType}`
        );

        this.switchToLayout(nextLayoutType);
        nextLayoutButton.focus();
      }
    } catch (error) {
      console.error('❌ 레이아웃 키보드 네비게이션 처리 중 오류:', error);
    }
  }

  // 초기화 후 인디케이터 위치 설정
  initializeIndicator() {
    try {
      // 첫 번째 탭 활성화 확인
      if (this.tabButtons && this.tabButtons.length > 0) {
        const firstTab = this.tabButtons[0];
        if (firstTab && !this.safeQuerySelector('.project-tab-button.active')) {
          firstTab.classList.add('active');
          firstTab.setAttribute('aria-selected', 'true');

          const firstContent = document.getElementById(
            `${firstTab.dataset.projectTab}-panel`
          );
          if (firstContent) {
            firstContent.classList.add('active');
          }
        }
      }

      // 첫 번째 레이아웃 버튼 활성화 확인
      if (this.layoutButtons && this.layoutButtons.length > 0) {
        const firstLayoutButton = this.layoutButtons[0];
        if (
          firstLayoutButton &&
          !this.safeQuerySelector('.layout-button.active')
        ) {
          firstLayoutButton.classList.add('active');
          firstLayoutButton.setAttribute('aria-pressed', 'true');

          // 초기 레이아웃 타입 설정
          this.currentLayoutType = firstLayoutButton.dataset.layout || 'card';
          if (this.tabContentContainer) {
            this.tabContentContainer.setAttribute(
              'data-layout',
              this.currentLayoutType
            );
          }
        }
      }

      // 인디케이터 위치 설정
      setTimeout(() => {
        this.updateIndicatorPosition();
      }, 100);

      console.log('✅ 인디케이터 초기화 완료');
      return true;
    } catch (error) {
      console.error('❌ 인디케이터 초기화 중 오류:', error);
      return false;
    }
  }

  // 리사이즈 이벤트 처리
  handleResize() {
    console.log('📏 프로젝트 탭 리사이즈 - 인디케이터 위치 재계산');
    this.updateIndicatorPosition();
  }

  // 현재 상태 가져오기
  getCurrentState() {
    return {
      activeTab: this.currentActiveTabName,
      layout: this.currentLayoutType,
      isInitialized: this.isInitialized,
      hasRequiredElements: this.hasRequiredElements,
      elementCounts: {
        tabButtons: this.tabButtons ? this.tabButtons.length : 0,
        tabContents: this.tabContents ? this.tabContents.length : 0,
        layoutButtons: this.layoutButtons ? this.layoutButtons.length : 0,
      },
    };
  }

  // 요소 재검증 (동적 로딩된 요소들을 위해)
  revalidateElements() {
    console.log('🔄 프로젝트 탭 요소 재검증 시작');
    this.initializeDOMElements();
    return this.hasRequiredElements;
  }
}

// 프로젝트 탭 인스턴스
let appleProjectTabInstance = null;

// 프로젝트 탭 초기화 함수
function initializeProjectTab() {
  try {
    // 기존 인스턴스가 있으면 재사용
    if (!appleProjectTabInstance) {
      appleProjectTabInstance = new AppleProjectTabNavigation();
    } else {
      // 기존 인스턴스의 요소 재검증
      appleProjectTabInstance.revalidateElements();
    }

    const initSuccess = appleProjectTabInstance.initializeTabNavigation();
    if (initSuccess) {
      appleProjectTabInstance.initializeIndicator();
      console.log('✅ Apple 스타일 프로젝트 탭 + 레이아웃 전환 초기화 완료');
    } else {
      console.warn('⚠️ 프로젝트 탭 초기화가 부분적으로만 완료되었습니다');
    }

    return initSuccess;
  } catch (error) {
    console.error('❌ 프로젝트 탭 초기화 중 오류:', error);
    return false;
  }
}

// 외부에서 탭 전환 함수 (안전한 방식)
function switchToProjectTab(tabName) {
  try {
    if (
      appleProjectTabInstance &&
      appleProjectTabInstance.hasRequiredElements
    ) {
      const success = appleProjectTabInstance.switchToTab(tabName);
      if (success) {
        appleProjectTabInstance.updateIndicatorPosition();
      }
      return success;
    } else {
      console.warn('⚠️ 프로젝트 탭 인스턴스가 없거나 필수 요소가 부족합니다');
      return false;
    }
  } catch (error) {
    console.error('❌ 프로젝트 탭 전환 중 오류:', error);
    return false;
  }
}

// 외부에서 레이아웃 전환 함수 (안전한 방식)
function switchToProjectLayout(layoutType) {
  try {
    if (
      appleProjectTabInstance &&
      appleProjectTabInstance.hasRequiredElements
    ) {
      return appleProjectTabInstance.switchToLayout(layoutType);
    } else {
      console.warn('⚠️ 프로젝트 탭 인스턴스가 없거나 필수 요소가 부족합니다');
      return false;
    }
  } catch (error) {
    console.error('❌ 프로젝트 레이아웃 전환 중 오류:', error);
    return false;
  }
}

// 인디케이터 위치 업데이트 함수 (안전한 방식)
function updateProjectTabIndicator() {
  try {
    if (
      appleProjectTabInstance &&
      appleProjectTabInstance.hasRequiredElements
    ) {
      return appleProjectTabInstance.updateIndicatorPosition();
    } else {
      console.warn(
        '⚠️ 프로젝트 탭 인스턴스가 없거나 인디케이터 요소가 부족합니다'
      );
      return false;
    }
  } catch (error) {
    console.error('❌ 프로젝트 탭 인디케이터 업데이트 중 오류:', error);
    return false;
  }
}

// 리사이즈 처리 함수 (안전한 방식)
function handleProjectTabResize() {
  try {
    if (appleProjectTabInstance) {
      appleProjectTabInstance.handleResize();
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ 프로젝트 탭 리사이즈 처리 중 오류:', error);
    return false;
  }
}

// 현재 상태 가져오기 함수 (안전한 방식)
function getProjectTabState() {
  try {
    if (appleProjectTabInstance) {
      return appleProjectTabInstance.getCurrentState();
    }
    return null;
  } catch (error) {
    console.error('❌ 프로젝트 탭 상태 조회 중 오류:', error);
    return null;
  }
}

// 디버깅용 함수
function debugProjectTab() {
  try {
    if (appleProjectTabInstance) {
      const state = appleProjectTabInstance.getCurrentState();
      console.log('🔍 프로젝트 탭 디버그 정보:');
      console.log('- 현재 활성 탭:', state.activeTab);
      console.log('- 현재 레이아웃:', state.layout);
      console.log('- 초기화 상태:', state.isInitialized);
      console.log('- 필수 요소 존재:', state.hasRequiredElements);
      console.log('- 요소 개수:', state.elementCounts);

      // DOM 요소 존재 여부 재확인
      const currentElements = {
        tabButtons: document.querySelectorAll('.project-tab-button').length,
        tabContents: document.querySelectorAll('.project-tab-content').length,
        layoutButtons: document.querySelectorAll('.layout-button').length,
        tabIndicator: !!document.getElementById('projectTabIndicator'),
        tabContentContainer: !!document.querySelector(
          '.project-tab-content-container'
        ),
      };

      console.log('- 현재 DOM 상태:', currentElements);
    } else {
      console.log('❌ 프로젝트 탭 인스턴스가 없습니다');
    }
  } catch (error) {
    console.error('❌ 프로젝트 탭 디버깅 중 오류:', error);
  }
}

// 전역으로 내보내기 (기존 구조 호환성 유지)
window.ProjectTabComponent = {
  initialize: initializeProjectTab,
  switchToTab: switchToProjectTab,
  switchToLayout: switchToProjectLayout,
  updateIndicator: updateProjectTabIndicator,
  handleResize: handleProjectTabResize,
  getState: getProjectTabState,
  debug: debugProjectTab,

  // 하위 호환성을 위한 별칭들
  scrollToTab: switchToProjectTab,
  handleClick: (event) => {
    try {
      const tabName = event.target.dataset.projectTab;
      if (tabName) {
        return switchToProjectTab(tabName);
      }
      return false;
    } catch (error) {
      console.error('❌ 프로젝트 탭 클릭 처리 중 오류:', error);
      return false;
    }
  },
  attachEventListeners: initializeProjectTab,
  initializeScroll: updateProjectTabIndicator,

  // 새로운 유틸리티 메서드들
  revalidate: () => {
    try {
      if (appleProjectTabInstance) {
        return appleProjectTabInstance.revalidateElements();
      }
      return false;
    } catch (error) {
      console.error('❌ 프로젝트 탭 재검증 중 오류:', error);
      return false;
    }
  },

  isReady: () => {
    try {
      return (
        appleProjectTabInstance && appleProjectTabInstance.hasRequiredElements
      );
    } catch (error) {
      console.error('❌ 프로젝트 탭 준비 상태 확인 중 오류:', error);
      return false;
    }
  },
};

// 글로벌 키보드 단축키 (안전한 방식)
document.addEventListener('keydown', (event) => {
  try {
    // 숫자 키로 탭 전환 (1: React, 2: Animation, 3: Chart, 4: Others)
    if (
      event.key >= '1' &&
      event.key <= '4' &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      const tabIndex = parseInt(event.key) - 1;
      const projectTabs = ['react', 'animation', 'chart', 'others'];
      const targetTab = projectTabs[tabIndex];

      if (
        targetTab &&
        appleProjectTabInstance &&
        appleProjectTabInstance.hasRequiredElements
      ) {
        const success = switchToProjectTab(targetTab);
        if (success) {
          console.log(
            `🔢 숫자키 ${event.key}로 프로젝트 탭 전환: ${targetTab}`
          );
        }
      }
    }

    // 숫자 키로 레이아웃 전환 (5: Card, 6: List)
    if (
      (event.key === '5' || event.key === '6') &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      const layoutTypes = ['card', 'list'];
      const layoutIndex = parseInt(event.key) - 5;
      const targetLayout = layoutTypes[layoutIndex];

      if (
        targetLayout &&
        appleProjectTabInstance &&
        appleProjectTabInstance.hasRequiredElements
      ) {
        const success = switchToProjectLayout(targetLayout);
        if (success) {
          console.log(
            `🔢 숫자키 ${event.key}로 레이아웃 전환: ${targetLayout}`
          );
        }
      }
    }

    // Ctrl + L로 레이아웃 토글
    if (event.key === 'l' && event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      if (
        appleProjectTabInstance &&
        appleProjectTabInstance.hasRequiredElements
      ) {
        const currentLayout = appleProjectTabInstance.currentLayoutType;
        const newLayout = currentLayout === 'card' ? 'list' : 'card';
        const success = switchToProjectLayout(newLayout);
        if (success) {
          console.log(
            `⌨️ Ctrl+L로 레이아웃 토글: ${currentLayout} → ${newLayout}`
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ 키보드 단축키 처리 중 오류:', error);
  }
});

// 모바일 터치 제스처 지원 (스와이프로 탭 전환)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (event) => {
  try {
    touchStartX = event.changedTouches[0].screenX;
  } catch (error) {
    console.error('❌ 터치 시작 이벤트 처리 중 오류:', error);
  }
});

document.addEventListener('touchend', (event) => {
  try {
    touchEndX = event.changedTouches[0].screenX;
    handleTabSwipeGesture();
  } catch (error) {
    console.error('❌ 터치 종료 이벤트 처리 중 오류:', error);
  }
});

function handleTabSwipeGesture() {
  try {
    const swipeThreshold = 50; // 최소 스와이프 거리
    const swipeDistance = touchEndX - touchStartX;

    if (
      Math.abs(swipeDistance) > swipeThreshold &&
      appleProjectTabInstance &&
      appleProjectTabInstance.hasRequiredElements
    ) {
      const projectTabs = ['react', 'animation', 'chart', 'others'];
      const currentIndex = projectTabs.indexOf(
        appleProjectTabInstance.currentActiveTabName
      );

      if (swipeDistance > 0 && currentIndex > 0) {
        // 오른쪽 스와이프: 이전 탭
        const prevTab = projectTabs[currentIndex - 1];
        const success = switchToProjectTab(prevTab);
        if (success) {
          console.log(`👆 스와이프로 탭 전환: ${prevTab}`);
        }
      } else if (swipeDistance < 0 && currentIndex < projectTabs.length - 1) {
        // 왼쪽 스와이프: 다음 탭
        const nextTab = projectTabs[currentIndex + 1];
        const success = switchToProjectTab(nextTab);
        if (success) {
          console.log(`👆 스와이프로 탭 전환: ${nextTab}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ 스와이프 제스처 처리 중 오류:', error);
  }
}

console.log('🎯 Apple 스타일 프로젝트 탭 + 레이아웃 전환 모듈 로드 완료');

// 추가 로그 정보
console.log('📋 사용 가능한 키보드 단축키:');
console.log('- 1~4: 탭 전환 (React, Animation, Chart, Others)');
console.log('- 5~6: 레이아웃 전환 (Card, List)');
console.log('- Ctrl+L: 레이아웃 토글');
console.log('- 화살표 키: 포커스된 탭/레이아웃 버튼 네비게이션');
console.log('- 터치 스와이프: 모바일에서 탭 전환');
console.log('📋 안전성 개선사항:');
console.log('- DOM 요소 존재 여부 사전 검증');
console.log('- 에러 발생 시 graceful degradation');
console.log('- 모든 메서드에 try-catch 에러 핸들링');
console.log('- 상태 검증 및 디버깅 유틸리티 제공');
