// /src/components/career/career.js

console.log('Career Component loading started');

// Career Component global object
window.CareerComponent = {
  // Initialization state
  isInitialized: false,

  // DOM elements
  accordionButtons: null,
  accordionContents: null,
  projectCards: null,
  modal: null,
  filterSelectElements: [],
  layoutToggleButtons: null,
  portfolioProductElements: [],

  // Current layout
  currentLayout: 'grid',

  // Guide system
  guideSystem: {
    currentScrollProgress: 0,
    currentScrollDirection: 'down',
    guideAccordionItems: null,
    guideButtons: null,
    isGuideInitialized: false,

    // Initialize guide system
    initializeGuideSystem() {
      console.log('Guide system initialization started');

      if (this.isGuideInitialized) {
        console.log('Guide system already initialized');
        return;
      }

      try {
        this.cacheGuideElements();
        this.bindGuideEvents();
        this.setInitialGuideScrollState();
        this.isGuideInitialized = true;
        console.log('Guide system initialization completed');
      } catch (error) {
        console.error('Guide system initialization failed:', error);
      }
    },

    // Cache guide elements
    cacheGuideElements() {
      console.log('Guide DOM elements caching');

      const guideAccordionItems = document.querySelectorAll(
        '.guide-accordion-item'
      );
      this.guideAccordionItems = Array.from(guideAccordionItems);

      const guideButtons = document.querySelectorAll('.guide-btn');
      this.guideButtons = Array.from(guideButtons);

      console.log('Cached guide elements:', {
        guideAccordionItems: this.guideAccordionItems.length,
        guideButtons: this.guideButtons.length,
      });

      this.validateGuideElements();
    },

    // Validate guide elements
    validateGuideElements() {
      const validationResults = {
        guideAccordions: this.guideAccordionItems?.length > 0,
        guideButtons: this.guideButtons?.length > 0,
      };

      Object.entries(validationResults).forEach(([elementName, isValid]) => {
        const statusMessage = isValid ? 'success' : 'failed';
        console.log(`Guide ${elementName} validation result: ${statusMessage}`);
      });

      return validationResults;
    },

    // Bind guide events
    bindGuideEvents() {
      console.log('Guide events binding');

      // Guide accordion header events
      this.guideAccordionItems.forEach((item, index) => {
        const header = item.querySelector('.guide-accordion-header');

        if (!header) {
          console.warn(`Guide accordion ${index} has no header`);
          return;
        }

        // Remove any existing onclick attributes to prevent conflicts
        header.removeAttribute('onclick');

        header.addEventListener('click', (event) => {
          event.preventDefault();
          console.log(`Guide accordion header ${index + 1} clicked`);
          this.toggleGuideAccordion(header);
        });

        // Keyboard accessibility
        header.addEventListener('keydown', (event) => {
          const { key = '' } = event;
          if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            this.toggleGuideAccordion(header);
          }
        });
      });

      // Guide button events
      this.guideButtons.forEach((button, index) => {
        // Remove any existing onclick attributes to prevent conflicts
        button.removeAttribute('onclick');

        button.addEventListener('click', (event) => {
          const { currentTarget } = event;
          const { dataset } = currentTarget;
          const { direction = 'down', progress = '0' } = dataset;

          const progressNumber = parseInt(progress, 10) || 0;

          console.log(
            `Guide button ${
              index + 1
            } clicked: ${direction}, ${progressNumber}%`
          );
          this.simulateGuideScroll(direction, progressNumber, currentTarget);
        });

        // Keyboard accessibility
        button.addEventListener('keydown', (event) => {
          const { key = '' } = event;
          if (key === 'Enter' || key === ' ') {
            event.preventDefault();
            button.click();
          }
        });
      });
    },

    // Toggle guide accordion
    toggleGuideAccordion(headerElement) {
      if (!headerElement) {
        console.error('Guide accordion header element not found');
        return;
      }

      const accordionItem = headerElement.parentElement;
      const accordionContent = accordionItem?.querySelector(
        '.guide-accordion-content'
      );

      if (!accordionItem || !accordionContent) {
        console.error('Guide accordion structure elements not found');
        return;
      }

      // Check current item activation state
      const isCurrentlyActive = accordionItem.classList.contains('active');

      console.log('Guide accordion toggle:', {
        currentState: isCurrentlyActive ? 'active' : 'inactive',
        action: isCurrentlyActive ? 'deactivate' : 'activate',
      });

      // Deactivate all guide accordion items
      this.guideAccordionItems.forEach((item) => {
        item.classList.remove('active');
      });

      // Activate clicked item if it was inactive
      if (!isCurrentlyActive) {
        accordionItem.classList.add('active');
        console.log('Guide accordion activated');
      } else {
        console.log('Guide accordion deactivated');
      }

      // Update accessibility attributes
      const isExpanded = !isCurrentlyActive;
      headerElement.setAttribute('aria-expanded', isExpanded.toString());
      accordionContent.setAttribute('aria-hidden', (!isExpanded).toString());
    },

    // Simulate guide scroll - 실시간 DOM 탐색 방식으로 수정
    simulateGuideScroll(
      scrollDirection,
      scrollProgress,
      activeButtonElement = null
    ) {
      const sanitizedDirection = ['down', 'up'].includes(scrollDirection)
        ? scrollDirection
        : 'down';
      const clampedProgress = Math.max(0, Math.min(100, scrollProgress));

      console.log('Guide scroll simulation:', {
        direction: sanitizedDirection,
        progress: clampedProgress,
        hasButtonElement: !!activeButtonElement,
      });

      this.currentScrollDirection = sanitizedDirection;
      this.currentScrollProgress = clampedProgress;

      // Update scroll indicator position - 실시간 요소 탐색
      this.updateScrollIndicatorPosition(clampedProgress);

      // Update pill position and color - 실시간 요소 탐색
      this.updateHystPillDisplay(sanitizedDirection, clampedProgress);

      // Update button active states
      this.updateGuideButtonStates(activeButtonElement);
    },

    // Update scroll indicator position - 실시간 DOM 탐색
    updateScrollIndicatorPosition(progressPercentage) {
      const scrollIndicatorElement = document.getElementById(
        'guideScrollIndicator'
      );

      if (!scrollIndicatorElement) {
        console.warn(
          'Scroll indicator element not found - DOM might not be ready'
        );
        return;
      }

      scrollIndicatorElement.style.left = `${progressPercentage}%`;
      console.log(`Scroll indicator position updated: ${progressPercentage}%`);
    },

    // Update hyst pill display - 실시간 DOM 탐색
    updateHystPillDisplay(scrollDirection, progressPercentage) {
      const hystPillElement = document.getElementById('guideHystPill');

      if (!hystPillElement) {
        console.warn('Hyst pill element not found - DOM might not be ready');
        return;
      }

      let pillTransformY = 0;
      let pillBackgroundColor = 'rgba(66, 66, 69, 0.8)';

      if (scrollDirection === 'down') {
        // Downward scroll: normal change
        const easedProgressRatio = Math.sin(
          ((progressPercentage / 100) * Math.PI) / 2
        );
        pillTransformY = -40 + 40 * easedProgressRatio; // -40px → 0px
        pillBackgroundColor = 'rgba(66, 66, 69, 0.8)'; // Default color
        console.log(
          `Downward scroll - progress: ${progressPercentage}%, Y: ${pillTransformY}px`
        );
      } else {
        // Upward scroll: sticking effect
        if (progressPercentage >= 50) {
          pillTransformY = 0; // Fixed at 50% or higher
          pillBackgroundColor = 'rgba(52, 199, 89, 0.8)'; // Sticking indicator
          console.log(`Upward scroll - sticking state: ${progressPercentage}%`);
        } else {
          const restoreRatio = (50 - progressPercentage) / 50;
          pillTransformY = -40 * Math.sin((restoreRatio * Math.PI) / 2);
          pillBackgroundColor = 'rgba(255, 159, 10, 0.8)'; // Restore indicator
          console.log(
            `Upward scroll - restore state: ${progressPercentage}%, Y: ${pillTransformY}px`
          );
        }
      }

      hystPillElement.style.transform = `translateY(${pillTransformY}px)`;
      hystPillElement.style.background = pillBackgroundColor;
    },

    // Update guide button states
    updateGuideButtonStates(activeButtonElement) {
      if (!activeButtonElement) {
        console.log('No active button - button state update skipped');
        return;
      }

      // Deactivate all guide buttons
      this.guideButtons.forEach((button) => {
        button.classList.remove('active');
      });

      // Activate clicked button
      activeButtonElement.classList.add('active');
      console.log('Guide button active state updated');
    },

    // Set initial guide scroll state
    setInitialGuideScrollState() {
      console.log('Initial guide scroll state setting');
      this.simulateGuideScroll('down', 0);
    },

    // Reset guide system
    resetGuideSystem() {
      console.log('Guide system reset');

      // Close all guide accordions
      this.guideAccordionItems.forEach((item) => {
        item.classList.remove('active');
      });

      // Reset button states
      this.guideButtons.forEach((button) => {
        button.classList.remove('active');
      });

      // Reset scroll state
      this.setInitialGuideScrollState();

      console.log('Guide system reset completed');
    },

    // Guide system debug info
    getGuideDebugInfo() {
      return {
        isGuideInitialized: this.isGuideInitialized,
        currentScrollProgress: this.currentScrollProgress,
        currentScrollDirection: this.currentScrollDirection,
        guideAccordionItemsCount: this.guideAccordionItems?.length ?? 0,
        guideButtonsCount: this.guideButtons?.length ?? 0,
      };
    },
  },

  // Project data
  projectData: {
    'samsung-card': {
      title: 'Samsung Card Site Operation',
      subtitle: 'Samsung Card',
      period: '2021.07 ~ 2022.01 (7 months)',
      tech: ['HTML', 'CSS', 'jQuery', 'Responsive'],
      description: 'Site markup development / improvement and operation work',
      achievements: [
        'Page rework time reduced by 33% through BEM methodology (30min→20min)',
        'Design completion average period reduced by 17% (3days→2.5days)',
        'Work history documentation reduced planner inquiries to 0',
        'Supported 8 script developer tasks',
        'Participated in COVID-19 5th disaster relief site development (2 markups, 5 scripts)',
      ],
    },
    'korea-credit': {
      title: 'Cross Browsing Web Dashboard Template Implementation',
      subtitle: 'Korea Credit Information',
      period: '2020.11 ~ 2021.03 (5 months)',
      tech: ['HTML', 'CSS', 'jQuery'],
      description:
        'Dashboard template monitoring system construction for internal staff use',
      achievements: [
        'Resolved 1 script function error by modifying project dependency library Settings file',
        'Added and modified web component functions within pages by replacing 30% of legacy markup code',
      ],
    },
    'samsung-life': {
      title: 'Samsung Life Digital Channel Innovation Project',
      subtitle: 'Samsung Life',
      period: '2019.05 ~ 2020.04 (1 year)',
      tech: ['HTML', 'CSS(SASS)', 'VueJS'],
      description:
        'First new project as Markup Developer in VueJS-based web project',
      achievements: [
        'Implemented component HTML layout using common components',
        'Implemented styles (SCSS) for some components',
        'Handled terms/policy guide, company introduction, insurance pages',
      ],
    },
    'sk-hangarae': {
      title: 'SK Hangarae Internal Staff Site UI Improvement',
      subtitle: 'SK C&C',
      period: '2020.05 ~ 2020.10 (6 months)',
      tech: ['HTML', 'CSS'],
      description: 'Site maintenance and style/layout modification',
      achievements: [
        'SK Hangarae web/mobile UI improvement',
        'Layout and content changes',
        'Web/mobile CSS modifications',
      ],
    },
    // Career Gap project data
    'vite-vanilla': {
      title: 'Vanilla JS Component System Construction',
      subtitle: 'Personal Project',
      period: '2023.10 ~ 2023.12 (2 months)',
      tech: ['Vanilla JS', 'Vite', 'SCSS', 'Swiper', 'Web API'],
      description:
        'Learning project implementing SPA-level complex features with Vanilla JS to answer "Why is React needed?"',
      achievements: [
        'Shopping cart system - localStorage-based global state management',
        'Swiper synchronization - resolved slider update issues when deleting products',
        'Scroll animations - visual feedback using IntersectionObserver',
        'Responsive 4-stage - 360/760/861/1170px breakpoints',
        'Search & filtering - real-time product search and category filters',
        'High-completion web accessibility - skipNavigation, ARIA attributes, tab index management',
        'Realized React necessity - directly experienced difficulty of component reusability and complexity of state change tracking',
      ],
    },
    'vite-chartjs': {
      title: 'Chart.js Custom Dashboard Prototype',
      subtitle: 'Business Prototype',
      period: '2023.10 (1 month)',
      tech: ['Chart.js', 'Vite', 'Canvas API', 'Vanilla JS', 'SCSS'],
      description:
        'Chart prototype for company product dashboard, customizing Chart.js basic features to meet business requirements',
      achievements: [
        'lineWithBar graph - Combined line and bar charts with Mixed Chart Type',
        'lineVertical graph - Vertical line display between graph points',
        'Custom tooltip - Changed to style matching design requirements',
        'Gap calculation system - Display value differences between graph points in tooltip',
        'Canvas API utilization - Overcame limitations of Chart.js basic tooltip and chart styles',
        'Custom animations - Implemented plugin system for vertical line rendering',
      ],
    },
  },

  // Initialize function
  initialize() {
    console.log('Career Component initialization started');

    if (this.isInitialized) {
      console.log('Career Component already initialized');
      return;
    }

    try {
      this.cacheElements();
      this.validateAndFixDuplicateIds();
      this.initializeCardStates();
      this.bindEvents();
      this.setupAccessibility();
      this.initializeAccordionStates();
      this.initializeLayout();
      this.syncAccordionStates();
      this.initializePortfolioProducts();

      // Add guide system initialization with delay
      setTimeout(() => {
        this.guideSystem.initializeGuideSystem();
      }, 200);

      this.isInitialized = true;
      console.log('Career Component initialization completed');
    } catch (error) {
      console.error('Career Component initialization failed:', error);
    }
  },

  // Validate and fix duplicate IDs
  validateAndFixDuplicateIds() {
    console.log('Duplicate ID validation and fix started');

    const accordionPairs = [];

    // Collect all accordion buttons and contents
    this.accordionButtons.forEach((button, index) => {
      const controlsId = button.getAttribute('aria-controls');
      const buttonId = button.getAttribute('id');
      const content = document.getElementById(controlsId);

      accordionPairs.push({
        index,
        button,
        buttonId,
        controlsId,
        content,
        isValidPair: !!content,
      });
    });

    // Detect and fix duplicate IDs
    const idUsageMap = new Map();

    accordionPairs.forEach((pair, pairIndex) => {
      const { controlsId, content } = pair;

      if (!idUsageMap.has(controlsId)) {
        idUsageMap.set(controlsId, []);
      }
      idUsageMap.get(controlsId).push({ pairIndex, content });
    });

    // Handle duplicated IDs
    idUsageMap.forEach((usageList, originalId) => {
      if (usageList.length > 1) {
        console.warn(
          `Duplicate ID found: ${originalId} (${usageList.length} instances)`
        );

        usageList.forEach(({ pairIndex, content }, usageIndex) => {
          if (usageIndex > 0) {
            // Keep first one as is, modify the rest
            const newId = `${originalId}-${usageIndex + 1}`;
            const pair = accordionPairs[pairIndex];

            console.log(
              `ID modified: ${originalId} → ${newId} (index: ${pairIndex})`
            );

            // Change content ID
            if (content) {
              content.id = newId;
            }

            // Change button's aria-controls
            if (pair.button) {
              pair.button.setAttribute('aria-controls', newId);
            }

            // Check and fix button ID duplication possibility
            const originalButtonId = pair.buttonId;
            if (originalButtonId) {
              const newButtonId = `${originalButtonId}-${usageIndex + 1}`;
              pair.button.setAttribute('id', newButtonId);

              // Modify content's aria-labelledby
              if (content) {
                content.setAttribute('aria-labelledby', newButtonId);
              }
            }
          }
        });
      }
    });

    // Re-cache modified elements
    this.accordionContents = Array.from(
      document.querySelectorAll('.career-accordion-content')
    );

    console.log('ID duplication validation and fix completed');
    console.log(
      'Final accordion pairs:',
      accordionPairs.map((p) => ({
        buttonId: p.button?.id,
        controlsId: p.button?.getAttribute('aria-controls'),
        hasContent: !!p.content,
      }))
    );
  },

  // Initialize portfolio products
  initializePortfolioProducts() {
    console.log('Portfolio product layout initialization');

    const portfolioItems = document.querySelectorAll('.portfolio-product-item');
    portfolioItems.forEach((item, index) => {
      this.setupPortfolioProductInteraction(item, index);
    });

    console.log(
      `Portfolio products ${portfolioItems.length} initialization completed`
    );
  },

  // Setup portfolio product interaction
  setupPortfolioProductInteraction(item, index) {
    const thumbnailButtons = item.querySelectorAll('.thumbnail-btn');
    const mainImage = item.querySelector('.portfolio-main-image');

    if (!thumbnailButtons.length || !mainImage) {
      console.warn(
        `Portfolio item ${index}: thumbnail or main image not found`
      );
      return;
    }

    // Thumbnail click events
    thumbnailButtons.forEach((button, thumbIndex) => {
      button.addEventListener('click', (event) => {
        this.handleThumbnailClick(event, item, thumbIndex);
      });

      // Keyboard accessibility
      button.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          this.handleThumbnailClick(event, item, thumbIndex);
        }
      });
    });

    // Image loading state handling
    mainImage.addEventListener('load', () => {
      console.log(`Portfolio ${index} main image loaded`);
    });

    mainImage.addEventListener('error', () => {
      console.error(`Portfolio ${index} main image load failed`);
      this.handleImageLoadError(mainImage);
    });

    console.log(`Portfolio product ${index} interaction setup completed`);
  },

  // Handle thumbnail click
  handleThumbnailClick(event, item, thumbIndex) {
    const { currentTarget = null } = event;
    const thumbnailImg = currentTarget?.querySelector('img');
    const mainImage = item.querySelector('.portfolio-main-image');
    const allThumbnails = item.querySelectorAll('.thumbnail-btn');

    if (!thumbnailImg || !mainImage) {
      console.error('Thumbnail or main image not found');
      return;
    }

    console.log(`Thumbnail ${thumbIndex} clicked`);

    // Update active state
    allThumbnails.forEach((thumb) => {
      thumb.classList.remove('active');
    });
    currentTarget.classList.add('active');

    // Update main image
    const newImageSrc = thumbnailImg.src;
    const newImageAlt = thumbnailImg.alt;

    // Animation for fade effect
    mainImage.style.opacity = '0.7';

    setTimeout(() => {
      mainImage.src = newImageSrc;
      mainImage.alt = newImageAlt;
      mainImage.style.opacity = '1';
    }, 150);

    console.log(`Main image changed to ${newImageSrc}`);
  },

  // Handle image load error
  handleImageLoadError(imageElement) {
    console.warn('Image load failed, setting fallback image');

    const fallbackImageSrc =
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop';
    imageElement.src = fallbackImageSrc;
    imageElement.alt = 'Portfolio image could not be loaded';
  },

  // Initialize card states function
  initializeCardStates() {
    console.log('Card initial state setting started');

    const allCards = document.querySelectorAll('.dashboard-card');
    allCards.forEach((card, index) => {
      card.classList.remove('career-filter-hidden');
      console.log(`Card ${index + 1} set to visible state`);
    });

    this.filterSelectElements.forEach((selectElement) => {
      selectElement.value = 'all';
    });

    console.log('Card initial state setting completed');
  },

  // State synchronization function
  syncAccordionStates() {
    console.log('Accordion state synchronization started');

    this.accordionButtons.forEach((button, index) => {
      const { getAttribute: getAttr } = button;
      const contentId = getAttr.call(button, 'aria-controls');
      const contentElement = document.getElementById(contentId);

      if (!contentElement) {
        console.warn(
          `Accordion ${index}: content element not found (ID: ${contentId})`
        );
        return;
      }

      const computedStyle = window.getComputedStyle(contentElement);
      const currentHeight = computedStyle.height;
      const isVisuallyOpen = currentHeight !== '0px';
      const isAriaExpanded = getAttr.call(button, 'aria-expanded') === 'true';

      console.log(
        `Accordion ${index}: visual=${isVisuallyOpen}, ARIA=${isAriaExpanded}, height=${currentHeight}`
      );

      if (isVisuallyOpen !== isAriaExpanded) {
        console.log(`Accordion ${index} state synchronization performed`);
        button.setAttribute('aria-expanded', isVisuallyOpen.toString());
        contentElement.setAttribute(
          'aria-hidden',
          (!isVisuallyOpen).toString()
        );
        contentElement.setAttribute('data-expanded', isVisuallyOpen.toString());
      }
    });
  },

  // DOM element caching
  cacheElements() {
    console.log('Career Component DOM element caching');

    const {
      accordionButtons = [],
      accordionContents = [],
      projectCards = [],
    } = this.queryMultipleElements();

    this.accordionButtons = accordionButtons;
    this.accordionContents = accordionContents;
    this.projectCards = projectCards;

    const modalElement = document.getElementById('careerProjectModal');
    this.modal = modalElement || null;

    const filterSelectElements = document.querySelectorAll(
      '.career-filter-select'
    );
    this.filterSelectElements = Array.from(filterSelectElements);

    const layoutButtons = document.querySelectorAll(
      '.career-layout-toggle-button'
    );
    this.layoutToggleButtons = Array.from(layoutButtons);

    // Cache portfolio product elements
    const portfolioProductElements = document.querySelectorAll(
      '.portfolio-product-item'
    );
    this.portfolioProductElements = Array.from(portfolioProductElements);

    console.log('Cached elements:', {
      accordionButtons: this.accordionButtons.length,
      accordionContents: this.accordionContents.length,
      projectCards: this.projectCards.length,
      filterSelectElements: this.filterSelectElements.length,
      layoutToggleButtons: this.layoutToggleButtons.length,
      portfolioProductElements: this.portfolioProductElements.length,
      hasModal: !!this.modal,
    });

    this.validateRequiredElements();
  },

  // Multiple element query helper
  queryMultipleElements() {
    const accordionButtons = document.querySelectorAll(
      '.career-accordion-button'
    );
    const accordionContents = document.querySelectorAll(
      '.career-accordion-content'
    );
    const projectCards = document.querySelectorAll(
      '.career-section .project-card'
    );

    return {
      accordionButtons: Array.from(accordionButtons),
      accordionContents: Array.from(accordionContents),
      projectCards: Array.from(projectCards),
    };
  },

  // Validate required elements
  validateRequiredElements() {
    const validationResults = {
      accordionButtons: this.accordionButtons?.length > 0,
      modal: !!this.modal,
      filterSelects: this.filterSelectElements?.length > 0,
      portfolioProducts: this.portfolioProductElements?.length > 0,
    };

    Object.entries(validationResults).forEach(([elementName, isValid]) => {
      const statusMessage = isValid ? 'success' : 'failed';
      console.log(`${elementName} validation result: ${statusMessage}`);
    });

    return validationResults;
  },

  // Event binding
  bindEvents() {
    console.log('Career Component event binding');

    // Accordion button events
    this.accordionButtons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(`Accordion button ${index + 1} clicked`);
        this.toggleAccordion(event.currentTarget);
      });
    });

    // Project card events
    this.projectCards.forEach((card, index) => {
      card.addEventListener('click', (event) => {
        const { dataset = {} } = card;
        const { project: projectId = null } = dataset;

        console.log(`Project card ${index + 1} clicked: ${projectId}`);

        const projectData = projectId ? this.projectData[projectId] : null;
        if (projectData) {
          this.openModal(projectData);
        }
      });
    });

    // Filter select box events
    this.filterSelectElements.forEach((selectElement, index) => {
      selectElement.addEventListener('change', (event) => {
        this.handleFilterChange(event, index);
      });
    });

    // Layout toggle button events
    this.layoutToggleButtons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        const { currentTarget = {} } = event;
        const { dataset = {} } = currentTarget;
        const { layout: newLayout = 'grid' } = dataset;

        console.log(`Layout toggle button ${index + 1} clicked: ${newLayout}`);
        this.toggleLayout(newLayout);
      });
    });

    // Modal related events
    this.bindModalEvents();

    // Portfolio product button events
    this.bindPortfolioProductEvents();

    // Portfolio detail accordion events
    this.bindPortfolioDetailEvents();
  },

  // Bind portfolio product button events
  bindPortfolioProductEvents() {
    console.log('Portfolio product button event binding');

    // Portfolio action buttons
    const portfolioBtns = document.querySelectorAll('.portfolio-btn');
    portfolioBtns.forEach((btn, index) => {
      btn.addEventListener('click', (event) => {
        console.log(`Portfolio button ${index + 1} clicked`);
      });

      // Keyboard accessibility
      btn.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          btn.click();
        }
      });
    });
  },

  // Bind portfolio detail accordion events
  bindPortfolioDetailEvents() {
    console.log('Portfolio detail accordion event binding');

    const detailSections = document.querySelectorAll(
      '.portfolio-details .detail-section'
    );

    detailSections.forEach((section, index) => {
      const header = section.querySelector('.detail-header');

      if (!header) {
        console.warn(`Detail section ${index} has no header`);
        return;
      }

      header.addEventListener('click', (event) => {
        event.preventDefault();
        this.handlePortfolioDetailToggle(section, index);
      });

      // Keyboard accessibility
      header.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          this.handlePortfolioDetailToggle(section, index);
        }
      });
    });
  },

  // Portfolio detail toggle handler
  handlePortfolioDetailToggle(section, index) {
    const isExpanded = section.classList.contains('expanded');
    const newExpandedState = !isExpanded;

    console.log(
      `Portfolio detail ${index + 1} toggle: ${
        newExpandedState ? 'expand' : 'collapse'
      }`
    );

    if (newExpandedState) {
      section.classList.add('expanded');
    } else {
      section.classList.remove('expanded');
    }

    // Update accessibility
    const header = section.querySelector('.detail-header');
    if (header) {
      header.setAttribute('aria-expanded', newExpandedState.toString());
    }

    const content = section.querySelector('.detail-content');
    if (content) {
      content.setAttribute('aria-hidden', (!newExpandedState).toString());
    }
  },

  // Filter change handler
  handleFilterChange(event, index) {
    const selectedValue = event.target.value;
    console.log(`Filter ${index + 1} changed: ${selectedValue}`);

    const { target: selectElement } = event;
    const accordionItem = selectElement.closest('.career-accordion-item');

    if (!accordionItem) {
      console.error('Accordion item not found');
      return;
    }

    // Open accordion first if closed
    const accordionButton = accordionItem.querySelector(
      '.career-accordion-button'
    );
    const isExpanded = accordionButton.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
      console.log('Accordion is closed, automatically expanding');
      this.toggleAccordion(accordionButton);
    }

    // Perform card filtering
    const cards = accordionItem.querySelectorAll('.dashboard-card');
    console.log(`Found cards: ${cards.length}`);

    let visibleCount = 0;
    let hiddenCount = 0;

    cards.forEach((card, cardIndex) => {
      const categoriesAttr = card.getAttribute('data-filter-categories');
      console.log(`Card ${cardIndex + 1} categories:`, categoriesAttr);

      if (!categoriesAttr) {
        console.warn(
          `Card ${cardIndex + 1} has no data-filter-categories attribute`
        );
        return;
      }

      const categoryList = categoriesAttr.split(',').map((cat) => cat.trim());
      const shouldShow =
        selectedValue === 'all' || categoryList.includes(selectedValue);

      if (shouldShow) {
        card.classList.remove('career-filter-hidden');
        visibleCount++;
        console.log(`Card ${cardIndex + 1} shown`);
      } else {
        card.classList.add('career-filter-hidden');
        hiddenCount++;
        console.log(`Card ${cardIndex + 1} hidden`);
      }
    });

    console.log(
      `Filtering result - visible: ${visibleCount}, hidden: ${hiddenCount}`
    );

    if (visibleCount === 0 && selectedValue !== 'all') {
      console.warn('No filtering results');
    }
  },

  // Bind modal events
  bindModalEvents() {
    if (!this.modal) return;

    this.modal.addEventListener('click', (event) => {
      const { target = null, currentTarget = null } = event;
      if (target === currentTarget) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      const { key = '' } = event;
      const isModalVisible = this.modal?.classList?.contains?.('show') ?? false;

      if (key === 'Escape' && isModalVisible) {
        this.closeModal();
      }
    });
  },

  // Setup accessibility
  setupAccessibility() {
    console.log('Career Component accessibility setup');

    this.accordionButtons.forEach((button) => {
      button.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          this.toggleAccordion(button);
        }
      });
    });

    this.projectCards.forEach((card) => {
      card.setAttribute('tabindex', '0');

      card.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          const { dataset = {} } = card;
          const { project: projectId = null } = dataset;

          const projectData = projectId ? this.projectData[projectId] : null;
          if (projectData) {
            this.openModal(projectData);
          }
        }
      });
    });

    this.layoutToggleButtons.forEach((button) => {
      button.addEventListener('keydown', (event) => {
        const { key = '' } = event;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          const { dataset = {} } = button;
          const { layout: layoutValue = 'grid' } = dataset;
          this.toggleLayout(layoutValue);
        }
      });
    });

    // Portfolio product accessibility setup
    this.portfolioProductElements.forEach((item) => {
      const thumbnails = item.querySelectorAll('.thumbnail-btn');
      const portfolioBtns = item.querySelectorAll('.portfolio-btn');

      // Thumbnail accessibility setup
      thumbnails.forEach((thumbnail, index) => {
        thumbnail.setAttribute(
          'aria-label',
          `Change to thumbnail image ${index + 1}`
        );
      });

      // Portfolio button accessibility setup
      portfolioBtns.forEach((btn) => {
        btn.setAttribute('role', 'button');
      });
    });
  },

  // Initialize accordion states
  initializeAccordionStates() {
    console.log('Accordion initial state setting');

    this.accordionContents.forEach((content) => {
      const currentExpanded = content.getAttribute('data-expanded');
      const currentHeight = content.style.height;

      console.log(
        `Accordion content: expanded=${currentExpanded}, height=${currentHeight}`
      );

      if (currentExpanded !== 'true' && currentHeight !== 'auto') {
        content.style.height = '0px';
        content.setAttribute('data-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      }
    });

    this.accordionButtons.forEach((button) => {
      const currentExpanded = button.getAttribute('aria-expanded');
      if (currentExpanded !== 'true') {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  },

  // Initialize layout
  initializeLayout() {
    console.log('Layout system initialization');
    this.setInitialLayoutState();
  },

  // Set initial layout state - modified to class-based
  setInitialLayoutState() {
    const dashboardContainers = document.querySelectorAll('.company-dashboard');

    dashboardContainers.forEach((container) => {
      // Default is grid, so remove all layout classes
      container.classList.remove('layout-grid', 'layout-list');
      console.log('Initial layout class cleanup completed');
    });

    this.updateLayoutToggleButtonStates();
    console.log('Initial layout setting completed:', this.currentLayout);
  },

  // Toggle layout - modified to class-based
  toggleLayout(layoutType) {
    const validLayouts = ['grid', 'list'];
    const sanitizedLayout = validLayouts.includes(layoutType)
      ? layoutType
      : 'grid';

    if (sanitizedLayout === this.currentLayout) {
      console.log('Same layout change attempt:', sanitizedLayout);
      return;
    }

    this.currentLayout = sanitizedLayout;
    console.log('Layout change:', sanitizedLayout);

    const dashboardContainers = document.querySelectorAll('.company-dashboard');
    dashboardContainers.forEach((container) => {
      // Remove all existing layout classes
      container.classList.remove('layout-grid', 'layout-list');

      // Add new layout class (grid is default so no class needed)
      if (sanitizedLayout === 'list') {
        container.classList.add('layout-list');
        console.log('List layout class added');
      } else {
        console.log('Grid layout set (default state)');
      }
    });

    this.updateLayoutToggleButtonStates();
    console.log('Layout toggle completed');
  },

  // Update layout toggle button states
  updateLayoutToggleButtonStates() {
    const { layoutToggleButtons = [], currentLayout = 'grid' } = this;

    layoutToggleButtons.forEach((button) => {
      const { dataset = {} } = button;
      const { layout: buttonLayout = '' } = dataset;

      const isActiveButton = buttonLayout === currentLayout;
      const ariaLabel = isActiveButton
        ? `Currently viewing in ${
            buttonLayout === 'grid' ? 'grid' : 'list'
          } view`
        : `View in ${buttonLayout === 'grid' ? 'grid' : 'list'} view`;

      button.classList.toggle('active', isActiveButton);
      button.setAttribute('aria-pressed', isActiveButton.toString());
      button.setAttribute('aria-label', ariaLabel);

      console.log(`Layout button "${buttonLayout}" state:`, {
        active: isActiveButton,
        ariaLabel: ariaLabel,
      });
    });
  },

  // Close all other accordions helper function
  closeAllOtherAccordions(currentButton) {
    console.log('Closing other accordions started');

    this.accordionButtons.forEach((button) => {
      // Only close if not the currently clicked button
      if (button !== currentButton) {
        const contentId = button.getAttribute('aria-controls');
        const contentElement = document.getElementById(contentId);

        if (contentElement && button.getAttribute('aria-expanded') === 'true') {
          console.log(`Closing accordion ${contentId}`);

          // Update ARIA attributes
          button.setAttribute('aria-expanded', 'false');
          contentElement.setAttribute('aria-hidden', 'true');

          // Close accordion
          this.collapseAccordion(contentElement);
        }
      }
    });

    console.log('Closing other accordions completed');
  },

  // Smart scroll to accordion item
  scrollToAccordionItem(button) {
    const accordionItem = button.closest('.career-accordion-item');

    if (!accordionItem) {
      console.warn('Accordion item not found');
      return;
    }

    // Current item position info
    const itemRect = accordionItem.getBoundingClientRect();
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;

    // Scroll to top 1/4 point of viewport (natural position)
    const viewportOffset = window.innerHeight * 0.25;
    const targetScrollY =
      currentScrollY + itemRect.top - headerHeight - viewportOffset;

    // Check if scroll is needed (item is in proper position)
    const isInGoodPosition =
      itemRect.top >= headerHeight && itemRect.top <= window.innerHeight * 0.4;

    console.log('Accordion scroll analysis:', {
      itemCurrentPosition: itemRect.top,
      currentScroll: currentScrollY,
      calculatedTargetPosition: targetScrollY,
      scrollNeeded: !isInGoodPosition,
      headerHeight: headerHeight,
    });

    // Execute scroll only when needed
    if (!isInGoodPosition && targetScrollY !== currentScrollY) {
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth',
      });
    } else {
      console.log('Scroll unnecessary - item is in proper position');
    }
  },

  // Accordion toggle - apply delayed scroll
  toggleAccordion(button) {
    console.log('Career accordion toggle started');

    const contentId = button.getAttribute('aria-controls');
    const contentElement = document.getElementById(contentId);

    if (!contentElement) {
      console.error('Accordion content element not found:', contentId);
      return;
    }

    const currentExpandedState =
      button.getAttribute('aria-expanded') === 'true';
    const newExpandedState = !currentExpandedState;

    console.log('Accordion state:', {
      contentId,
      currentState: currentExpandedState ? 'expanded' : 'collapsed',
      newState: newExpandedState ? 'expanded' : 'collapsed',
    });

    // Close other accordions first if newly opening
    if (newExpandedState) {
      this.closeAllOtherAccordions(button);

      // Scroll after accordion close animation completes (350ms later)
      setTimeout(() => {
        this.scrollToAccordionItem(button);
      }, 350); // Set slightly longer than CSS transition
    }

    // Update ARIA attributes
    button.setAttribute('aria-expanded', newExpandedState.toString());
    contentElement.setAttribute('aria-hidden', (!newExpandedState).toString());

    const expandFunction = newExpandedState
      ? 'expandAccordion'
      : 'collapseAccordion';
    this[expandFunction](contentElement);

    console.log(
      `Accordion ${newExpandedState ? 'expanded' : 'collapsed'} completed`
    );

    // Additional initialization when accordion containing portfolio products opens
    if (
      newExpandedState &&
      (contentId.includes('gap') || contentId.includes('career-company-gap'))
    ) {
      setTimeout(() => {
        this.initializePortfolioProducts();
      }, 500);
    }
  },

  // Expand accordion - modified to offsetHeight-based
  expandAccordion(contentElement) {
    console.log('Accordion expand started');

    // Temporarily set auto to measure actual content height
    contentElement.style.height = 'auto';

    // Measure actual height of career-company-details element
    const detailsElement = contentElement.querySelector(
      '.career-company-details'
    );
    if (!detailsElement) {
      console.error('career-company-details element not found');
      return;
    }

    const detailsHeight = detailsElement.offsetHeight;

    // Add career-accordion-content's padding-top (16px)
    const actualHeight = detailsHeight + 16;

    console.log('Details element height:', detailsHeight + 'px');
    console.log('Final calculated height:', actualHeight + 'px');

    // Set back to 0 for animation
    contentElement.style.height = '0px';
    contentElement.setAttribute('data-expanded', 'true');

    contentElement.offsetHeight; // Force reflow

    requestAnimationFrame(() => {
      contentElement.style.height = actualHeight + 'px';
      console.log(
        'Accordion expand animation started - target height:',
        actualHeight + 'px'
      );

      const handleTransitionEnd = (event) => {
        const { target = null, propertyName = '' } = event;
        if (target === contentElement && propertyName === 'height') {
          contentElement.style.height = 'auto';
          contentElement.removeEventListener(
            'transitionend',
            handleTransitionEnd
          );
          console.log('Accordion expand completed - height: auto set');
        }
      };

      contentElement.addEventListener('transitionend', handleTransitionEnd);
    });
  },

  // Collapse accordion - modified to offsetHeight-based
  collapseAccordion(contentElement) {
    console.log('Accordion collapse started');

    // Measure current actual height
    const detailsElement = contentElement.querySelector(
      '.career-company-details'
    );
    if (!detailsElement) {
      console.error('career-company-details element not found');
      return;
    }

    const detailsHeight = detailsElement.offsetHeight;
    const currentHeight = detailsHeight + 16;

    contentElement.style.height = currentHeight + 'px';
    console.log('Current height:', currentHeight + 'px');

    contentElement.setAttribute('data-expanded', 'false');
    contentElement.offsetHeight; // Force reflow

    requestAnimationFrame(() => {
      contentElement.style.height = '0px';
      console.log('Accordion collapse animation started');
    });
  },

  // Open modal
  openModal(project) {
    const { title = 'Unknown Project' } = project;
    console.log('Career project modal open:', title);

    if (!this.modal) {
      console.error('Modal element not found');
      return;
    }

    this.updateModalContent(project);
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    const closeButton = this.modal.querySelector('.career-modal-close');
    if (closeButton) {
      closeButton.focus();
    }
  },

  // Close modal
  closeModal() {
    console.log('Career project modal close');

    if (!this.modal) {
      return;
    }

    this.modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  },

  // Update modal content
  updateModalContent(project) {
    console.log('Modal content update');

    const modalElements = {
      title: document.getElementById('careerModalTitle'),
      subtitle: document.getElementById('careerModalSubtitle'),
      period: document.getElementById('careerModalPeriod'),
      body: document.getElementById('careerModalBody'),
    };

    const { title = '', subtitle = '', period = '', ...projectRest } = project;

    if (modalElements.title) {
      modalElements.title.textContent = title;
    }

    if (modalElements.subtitle) {
      modalElements.subtitle.textContent = subtitle;
    }

    if (modalElements.period) {
      modalElements.period.textContent = period;
    }

    if (modalElements.body) {
      modalElements.body.innerHTML = this.generateModalContent(project);
    }
  },

  // Generate modal content
  generateModalContent(project) {
    const { description = '', tech = [], achievements = [] } = project;

    let content = `
      <div class="detail-section">
        <h3>Project Overview</h3>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">${description}</p>

        <div class="tech-grid">
          ${tech
            .map((techItem) => `<div class="tech-item">${techItem}</div>`)
            .join('')}
        </div>
      </div>
    `;

    const hasAchievements = achievements.length > 0;
    if (hasAchievements) {
      const achievementItems = achievements
        .map(
          (achievement) => `
        <li class="achievement-item">
          <strong>✓</strong>
          ${achievement}
        </li>
      `
        )
        .join('');

      content += `
        <div class="detail-section">
          <h3>Key Achievements & Learnings</h3>
          <ul class="achievement-list">
            ${achievementItems}
          </ul>
        </div>
      `;
    }

    return content;
  },

  // Component reset
  reset() {
    console.log('Career Component reset');

    this.accordionContents.forEach((content) => {
      content.style.height = '0px';
      content.setAttribute('data-expanded', 'false');
      content.setAttribute('aria-hidden', 'true');
    });

    this.accordionButtons.forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });

    const allCards = document.querySelectorAll('.dashboard-card');
    allCards.forEach((card) => {
      card.classList.remove('career-filter-hidden');
    });

    this.filterSelectElements.forEach((selectElement) => {
      selectElement.value = 'all';
    });

    this.currentLayout = 'grid';
    this.toggleLayout('grid');
    this.closeModal();

    // Add guide system reset
    this.guideSystem.resetGuideSystem();

    console.log('Career Component reset completed');
  },

  // Debug info output
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      accordionButtonsCount: this.accordionButtons?.length ?? 0,
      accordionContentsCount: this.accordionContents?.length ?? 0,
      projectCardsCount: this.projectCards?.length ?? 0,
      filterSelectElementsCount: this.filterSelectElements?.length ?? 0,
      layoutToggleButtonsCount: this.layoutToggleButtons?.length ?? 0,
      portfolioProductElementsCount: this.portfolioProductElements?.length ?? 0,
      hasModal: !!this.modal,
      currentLayout: this.currentLayout,
      projectDataKeys: Object.keys(this.projectData),
      guideSystemInfo: this.guideSystem.getGuideDebugInfo(),
    };
  },
};

// Global functions - 단순화된 래퍼
window.openCareerModal = (projectId) => {
  const { CareerComponent = {} } = window;
  const { projectData = {} } = CareerComponent;
  const project = projectData[projectId];

  if (project) {
    CareerComponent.openModal(project);
  }
};

window.closeCareerModal = () => {
  const { CareerComponent = {} } = window;
  CareerComponent.closeModal();
};

// Component automatic initialization with extended delay
const initializeCareerComponent = () => {
  const { CareerComponent = {} } = window;

  if (typeof CareerComponent.initialize === 'function') {
    CareerComponent.initialize();
  } else {
    console.error('CareerComponent.initialize function not found');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeCareerComponent, 300); // Increased delay
  });
} else {
  setTimeout(initializeCareerComponent, 300); // Increased delay
}

console.log('Career Component load completed');

// Global access for debugging
window.debugCareer = () => {
  const { CareerComponent = {} } = window;
  const debugInfo = CareerComponent.getDebugInfo?.() ?? {};
  console.table(debugInfo);
};

window.debugGuide = () => {
  const { CareerComponent = {} } = window;
  const { guideSystem = {} } = CareerComponent;
  const guideDebugInfo = guideSystem.getGuideDebugInfo?.() ?? {};
  console.table(guideDebugInfo);
};
