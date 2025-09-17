// /src/components/accordion/accordion.js

console.log('🎯 Apple 아코디언 모듈 로드 완료');

// ============ APPLE ACCORDION FUNCTIONALITY ============

class AppleAccordionFinalDemo {
  constructor() {
    this.accordionItems = document.querySelectorAll('.accordion-item');
    this.accordionButtons = document.querySelectorAll('.accordion-header'); // ✅ HTML과 일치
    this.accordionTrays = document.querySelectorAll('.accordion-content'); // ✅ HTML과 일치

    // 🎯 데스크탑 큰 이미지들
    this.largeImages = document.querySelectorAll('.template-image-large');

    // 🎯 첫 번째 아이템이 기본으로 열려있음
    this.currentExpandedItem = 0;
    this.isAnimating = false;

    this.validateHTMLStructure();
    this.initializeAccordionWithFirstExpanded();
    this.attachEventListeners();
    this.setupKeyboardNavigation();

    console.log('✅ Apple 최종 완성버전 아코디언 초기화 완료');
  }

  validateHTMLStructure() {
    console.log('🔍 HTML 구조 검증 시작...');

    if (this.accordionItems.length === 0) {
      console.error('❌ .accordion-item 요소를 찾을 수 없습니다');
      return false;
    }

    let validationPassed = true;

    this.accordionItems.forEach((item, index) => {
      const button = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');

      if (!button) {
        console.error(
          `❌ 아코디언 항목 ${index}: .accordion-header를 찾을 수 없습니다`
        );
        validationPassed = false;
      }

      if (!content) {
        console.error(
          `❌ 아코디언 항목 ${index}: .accordion-content를 찾을 수 없습니다`
        );
        validationPassed = false;
      }

      if (button && content) {
        console.log(`✅ 아코디언 항목 ${index}: HTML 구조 정상`);
      }
    });

    console.log(`🔍 HTML 구조 검증 ${validationPassed ? '완료' : '실패'}`);
    return validationPassed;
  }

  initializeAccordionWithFirstExpanded() {
    console.log('🎯 아코디언 초기화 시작 (첫 번째 아이템 expanded)...');

    // 모든 아코디언 아이템 상태 확인 및 설정
    this.accordionItems.forEach((item, index) => {
      const button = item.querySelector('.accordion-header'); // ✅ 수정됨
      const content = item.querySelector('.accordion-content'); // ✅ 수정됨

      // ✅ null 체크 추가
      if (!button || !content) {
        console.error(
          `❌ 아코디언 항목 ${index}: 필수 요소를 찾을 수 없습니다`,
          {
            button: !!button,
            content: !!content,
          }
        );
        return; // 이 항목은 건너뛰기
      }

      if (index === 0) {
        // 🎯 첫 번째 아이템은 expanded 상태 유지
        console.log(`📋 아코디언 항목 ${index} - EXPANDED 상태 확인`);

        // 상태가 올바르게 설정되어 있는지 확인
        if (!item.classList.contains('expanded')) {
          item.classList.add('expanded');
          item.classList.remove('collapsed');
        }

        if (button.getAttribute('aria-expanded') !== 'true') {
          button.setAttribute('aria-expanded', 'true');
        }

        if (content) {
          const currentHeight = content.scrollHeight;
          if (content.style.maxHeight !== 'none') {
            content.style.maxHeight = currentHeight + 'px';
          }
          content.setAttribute('aria-hidden', 'false');
        }
      } else {
        // 나머지 아이템들은 collapsed 상태
        item.classList.add('collapsed');
        item.classList.remove('expanded');
        button.setAttribute('aria-expanded', 'false');

        if (content) {
          content.style.maxHeight = '0px';
          content.setAttribute('aria-hidden', 'true');
        }

        console.log(`📋 아코디언 항목 ${index} - COLLAPSED 상태로 초기화`);
      }
    });

    console.log('🎯 아코디언 초기화 완료 (첫 번째 아이템 expanded)');

    // 큰 이미지들 초기화
    this.largeImages.forEach((image, index) => {
      if (index === 0) {
        // 🎯 첫 번째 이미지는 표시
        image.classList.remove('hidden');
        image.setAttribute('aria-hidden', 'false');
        console.log(`🖼️ 큰 이미지 ${index} - 표시 상태로 초기화`);
      } else {
        // 나머지 이미지들은 숨김
        image.classList.add('hidden');
        image.setAttribute('aria-hidden', 'true');
        console.log(`🖼️ 큰 이미지 ${index} - 숨김 상태로 초기화`);
      }
    });
  }

  attachEventListeners() {
    this.accordionButtons.forEach((button, index) => {
      // ✅ null 체크 추가
      if (!button) {
        console.error(`❌ 아코디언 버튼 ${index}이 null입니다`);
        return;
      }

      button.addEventListener('click', (event) => {
        console.log(
          `🖱️ 아코디언 버튼 ${index} 클릭 (현재 확장된 아이템: ${this.currentExpandedItem})`
        );
        this.handleAccordionClick(index, event);
      });
    });

    console.log('🎧 이벤트 리스너 연결 완료');
  }

  setupKeyboardNavigation() {
    this.accordionButtons.forEach((button, index) => {
      // ✅ null 체크 추가
      if (!button) {
        console.error(
          `❌ 키보드 네비게이션 설정 실패: 버튼 ${index}이 null입니다`
        );
        return;
      }

      button.addEventListener('keydown', (event) => {
        this.handleKeyboardNavigation(event, index);
      });
    });

    console.log('⌨️ 키보드 네비게이션 설정 완료');
  }

  handleKeyboardNavigation(event, currentIndex) {
    const { key } = event;

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.handleAccordionClick(currentIndex, event);
      console.log(`⌨️ 키보드로 아코디언 ${currentIndex} 토글`);
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      const direction = key === 'ArrowDown' ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + this.accordionButtons.length) %
        this.accordionButtons.length;

      // ✅ null 체크 추가
      const nextButton = this.accordionButtons[nextIndex];
      if (nextButton) {
        nextButton.focus();
        console.log(
          `🔼🔽 화살표 키로 포커스 이동: ${currentIndex} → ${nextIndex}`
        );
      }
    }
  }

  async handleAccordionClick(clickedIndex, event) {
    if (this.isAnimating) {
      console.log('⏳ 애니메이션 진행 중', '클릭 무시');
      return;
    }

    this.isAnimating = true;
    console.log(
      `🎛️ 아코디언 ${clickedIndex} 처리 시작 (현재 확장: ${this.currentExpandedItem})`
    );

    const clickedItem = this.accordionItems[clickedIndex];

    // ✅ null 체크 추가
    if (!clickedItem) {
      console.error(
        `❌ 클릭된 아코디언 항목 ${clickedIndex}을 찾을 수 없습니다`
      );
      this.isAnimating = false;
      return;
    }

    const isCurrentlyExpanded = clickedItem.classList.contains('expanded');

    if (isCurrentlyExpanded) {
      console.log(
        `🔤 이미 열린 아코디언 ${clickedIndex} 클릭 - 아무 작업 안함 (Apple 방식)`
      );
      // Apple처럼 이미 열린 아이템을 클릭해도 닫지 않음
    } else {
      // 다른 아이템이 열려있다면 먼저 닫기
      if (
        this.currentExpandedItem !== null &&
        this.currentExpandedItem !== clickedIndex
      ) {
        await this.collapseItem(this.currentExpandedItem);
        console.log(`🔤 이전 아코디언 ${this.currentExpandedItem} 닫기 완료`);
      }

      // 클릭한 아이템 열기
      await this.expandItem(clickedIndex);
      this.currentExpandedItem = clickedIndex;
      this.showLargeImage(clickedIndex);
      console.log(`🔥 아코디언 ${clickedIndex} 열기 완료`);
    }

    this.isAnimating = false;
    console.log('✅ 아코디언 처리 완료');
  }

  async expandItem(index) {
    const item = this.accordionItems[index];
    const button = item.querySelector('.accordion-header'); // ✅ 수정됨
    const content = item.querySelector('.accordion-content'); // ✅ 수정됨

    // ✅ null 체크 강화
    if (!item || !button || !content) {
      console.error(`❌ 아코디언 ${index}의 필수 요소를 찾을 수 없습니다`, {
        item: !!item,
        button: !!button,
        content: !!content,
      });
      return;
    }

    // 상태 업데이트
    item.classList.remove('collapsed');
    item.classList.add('expanded');
    button.setAttribute('aria-expanded', 'true');
    content.setAttribute('aria-hidden', 'false');

    // 높이 계산을 위해 임시로 높이를 auto로 설정
    const currentMaxHeight = content.style.maxHeight;
    content.style.maxHeight = 'none';
    const targetHeight = content.scrollHeight;
    content.style.maxHeight = '0px';

    // 강제 리플로우
    content.offsetHeight;

    // 애니메이션 시작
    content.style.maxHeight = targetHeight + 'px';
    content.style.transitionDuration = '400ms';

    console.log(`📏 아코디언 ${index} 확장: 0px → ${targetHeight}px`);

    return new Promise((resolve) => {
      const handleTransitionEnd = () => {
        content.removeEventListener('transitionend', handleTransitionEnd);
        content.style.maxHeight = 'none'; // 콘텐츠 크기 변경에 대응
        resolve();
      };

      content.addEventListener('transitionend', handleTransitionEnd);

      // 백업 타이머 (트랜지션이 실행되지 않을 경우)
      setTimeout(() => {
        content.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      }, 500);
    });
  }

  async collapseItem(index) {
    const item = this.accordionItems[index];
    const button = item.querySelector('.accordion-header'); // ✅ 수정됨
    const content = item.querySelector('.accordion-content'); // ✅ 수정됨

    // ✅ null 체크 강화
    if (!item || !button || !content) {
      console.error(`❌ 아코디언 ${index}의 필수 요소를 찾을 수 없습니다`, {
        item: !!item,
        button: !!button,
        content: !!content,
      });
      return;
    }

    // 현재 높이 고정
    const currentHeight = content.scrollHeight;
    content.style.maxHeight = currentHeight + 'px';

    // 강제 리플로우
    content.offsetHeight;

    // 상태 업데이트
    item.classList.remove('expanded');
    item.classList.add('collapsed');
    button.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');

    // 애니메이션 시작
    content.style.maxHeight = '0px';
    content.style.transitionDuration = '400ms';

    console.log(`📏 아코디언 ${index} 축소: ${currentHeight}px → 0px`);

    return new Promise((resolve) => {
      const handleTransitionEnd = () => {
        content.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      };

      content.addEventListener('transitionend', handleTransitionEnd);

      // 백업 타이머
      setTimeout(() => {
        content.removeEventListener('transitionend', handleTransitionEnd);
        resolve();
      }, 500);
    });
  }

  showLargeImage(index) {
    const imageClasses = [
      'accordion-item-frontend-image',
      'accordion-item-backend-image',
      'accordion-item-fullstack-image',
      'accordion-item-tools-image',
    ];
    const targetClass = imageClasses[index];

    if (!targetClass) {
      console.error(
        `❌ 인덱스 ${index}에 해당하는 이미지 클래스를 찾을 수 없습니다`
      );
      return;
    }

    console.log(`🖼️ 큰 이미지 표시 시작: ${targetClass} (인덱스: ${index})`);

    // 모든 큰 이미지 숨기기
    this.largeImages.forEach((image, imageIndex) => {
      if (image) {
        image.classList.add('hidden');
        image.setAttribute('aria-hidden', 'true');
        console.log(`🖼️ 큰 이미지 ${imageIndex} 숨김 처리`);
      }
    });

    // 대상 이미지 표시
    const targetImage = document.querySelector(`.${targetClass}`);
    if (targetImage) {
      targetImage.classList.remove('hidden');
      targetImage.setAttribute('aria-hidden', 'false');
      console.log(`🖥️ 큰 이미지 표시 완료: ${targetClass}`);
    } else {
      console.error(`❌ 대상 큰 이미지를 찾을 수 없습니다: ${targetClass}`);
    }

    console.log(`✅ 큰 이미지 표시 완료: ${targetClass}`);
  }

  // 개발자 도구용 유틸리티 메서드들
  getStatus() {
    return {
      currentExpandedItem: this.currentExpandedItem,
      isAnimating: this.isAnimating,
      screenWidth: window.innerWidth,
      accordionItemsCount: this.accordionItems.length,
      accordionButtonsCount: this.accordionButtons.length,
      validButtons: Array.from(this.accordionButtons).filter(
        (btn) => btn !== null
      ).length,
      expandedItems: Array.from(this.accordionItems).map((item, index) => ({
        index,
        isExpanded: item ? item.classList.contains('expanded') : false,
        hasButton: !!item?.querySelector('.accordion-header'),
        hasContent: !!item?.querySelector('.accordion-content'),
      })),
      largeImageStates: Array.from(this.largeImages).map((img, index) => ({
        index,
        isVisible: img ? !img.classList.contains('hidden') : false,
        className: img?.className || 'null',
        ariaHidden: img?.getAttribute('aria-hidden') || 'null',
      })),
    };
  }

  forceExpand(index) {
    if (index >= 0 && index < this.accordionItems.length) {
      this.handleAccordionClick(index, new Event('click'));
      console.log(`🔧 강제 확장: ${index}`);
    } else {
      console.error(
        `❌ 잘못된 인덱스: ${index} (범위: 0-${this.accordionItems.length - 1})`
      );
    }
  }

  testAllItems() {
    console.log('🧪 모든 아이템 테스트 시작');
    let index = 0;
    const testNext = () => {
      if (index < this.accordionItems.length) {
        console.log(`🧪 아이템 ${index} 테스트`);
        this.forceExpand(index);
        index++;
        setTimeout(testNext, 2000);
      } else {
        console.log('🧪 모든 아이템 테스트 완료');
      }
    };
    testNext();
  }

  // ✅ 디버깅용 추가 메서드
  debugHTMLStructure() {
    console.log('🔍 HTML 구조 디버깅...');
    console.log('📋 전체 accordion-item 목록:', this.accordionItems);
    console.log('🔘 전체 accordion-header 목록:', this.accordionButtons);
    console.log('📄 전체 accordion-content 목록:', this.accordionTrays);

    this.accordionItems.forEach((item, index) => {
      console.log(`🔍 아이템 ${index}:`, {
        item: item,
        button: item?.querySelector('.accordion-header'),
        content: item?.querySelector('.accordion-content'),
        classes: item?.className,
      });
    });
  }
}

// 아코디언 초기화 함수
function initializeAccordion() {
  try {
    console.log('🚀 아코디언 초기화 시작...');
    window.appleAccordionIntegrated = new AppleAccordionFinalDemo();
    console.log('✅ Apple 아코디언 초기화 완료');
  } catch (error) {
    console.error('❌ 아코디언 초기화 실패:', error);
    console.error('📋 에러 스택:', error.stack);

    // 디버깅 정보 출력
    console.log('🔍 현재 DOM 상태:');
    console.log(
      '- accordion-item 개수:',
      document.querySelectorAll('.accordion-item').length
    );
    console.log(
      '- accordion-header 개수:',
      document.querySelectorAll('.accordion-header').length
    );
    console.log(
      '- accordion-content 개수:',
      document.querySelectorAll('.accordion-content').length
    );
  }
}

// 전역으로 내보내기
window.AccordionComponent = {
  initialize: initializeAccordion,
  AppleAccordionFinalDemo: AppleAccordionFinalDemo,
};
