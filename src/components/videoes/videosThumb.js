/**
 * /src/scripts/VideoThumbnailManager.js
 * 포트폴리오 비디오 썸네일 관리 시스템
 */
class VideoThumbnailManager {
  constructor() {
    this.portfolioItems = new Map();
    this.debugMode = true;

    this.log('VideoThumbnailManager 초기화 완료');
  }

  /**
   * 디버깅 로그 출력
   * @param {string} message - 로그 메시지
   * @param {*} data - 추가 데이터
   */
  log(message, data = null) {
    if (!this.debugMode) return;

    if (data) {
      console.log(`[VideoThumbnail] ${message}`, data);
    } else {
      console.log(`[VideoThumbnail] ${message}`);
    }
  }

  /**
   * 유튜브 URL에서 비디오 ID 추출
   * @param {string} youtubeUrl - 유튜브 URL
   * @returns {string|null} 비디오 ID 또는 null
   */
  extractYouTubeVideoId(youtubeUrl) {
    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
      this.log('유효하지 않은 유튜브 URL:', youtubeUrl);
      return null;
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // 직접 비디오 ID인 경우
    ];

    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match && match[1]) {
        this.log('비디오 ID 추출 성공:', match[1]);
        return match[1];
      }
    }

    this.log('비디오 ID 추출 실패:', youtubeUrl);
    return null;
  }

  /**
   * 유튜브 썸네일 URL 생성
   * @param {string} videoId - 유튜브 비디오 ID
   * @param {number} index - 썸네일 인덱스 (1-3)
   * @returns {string} 썸네일 URL
   */
  generateYouTubeThumbnailUrl(videoId, index = 1) {
    const validIndex = Math.max(1, Math.min(3, parseInt(index) || 1));
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${validIndex}.jpg`;

    this.log(`썸네일 URL 생성:`, {
      videoId,
      index: validIndex,
      url: thumbnailUrl,
    });

    return thumbnailUrl;
  }

  /**
   * 포트폴리오 아이템에 비디오 썸네일 시스템 적용
   * @param {Object} config - 설정 객체
   * @param {string} config.itemClass - 포트폴리오 아이템 클래스명
   * @param {string} config.youtubeUrl - 유튜브 URL
   * @param {string} config.videoSrc - 비디오 파일 경로 (선택사항)
   * @param {Array} config.thumbnailTimes - 썸네일 시점 배열 (기본값: [0, 25, 50])
   */
  initializePortfolioItem(config) {
    const {
      itemClass,
      youtubeUrl,
      videoSrc = '',
      thumbnailTimes = [0, 25, 50],
    } = config;

    this.log('포트폴리오 아이템 초기화 시작:', config);

    // DOM 요소 찾기
    const itemElement = document.querySelector(`.${itemClass}`);
    if (!itemElement) {
      this.log(`포트폴리오 아이템을 찾을 수 없습니다: .${itemClass}`);
      return false;
    }

    const videoElement = itemElement.querySelector('.portfolio-main-video');
    const thumbnailButtons = itemElement.querySelectorAll('.thumbnail-btn');

    if (!videoElement) {
      this.log('비디오 요소를 찾을 수 없습니다');
      return false;
    }

    // 유튜브 비디오 ID 추출
    const videoId = this.extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      this.log('유효한 유튜브 URL이 아닙니다:', youtubeUrl);
      return false;
    }

    // 비디오 소스 설정
    if (videoSrc) {
      const sourceElement = videoElement.querySelector('source');
      if (sourceElement) {
        sourceElement.src = videoSrc;
        videoElement.load();
      }
    }

    // 썸네일 이미지 교체
    thumbnailButtons.forEach((button, index) => {
      const thumbnailIndex = index + 1;
      const thumbnailUrl = this.generateYouTubeThumbnailUrl(
        videoId,
        thumbnailIndex
      );
      const imgElement = button.querySelector('img');

      if (imgElement) {
        imgElement.src = thumbnailUrl;
        imgElement.alt = `비디오 썸네일 ${thumbnailIndex}`;
      }

      // 비디오 시점 설정
      const timePercentage = thumbnailTimes[index] || index * 25;
      button.setAttribute('data-video-time', timePercentage);
    });

    // 이벤트 리스너 등록
    this.setupEventListeners(itemElement, videoElement, thumbnailButtons);

    // 포트폴리오 아이템 정보 저장
    this.portfolioItems.set(itemClass, {
      element: itemElement,
      video: videoElement,
      thumbnails: thumbnailButtons,
      videoId,
      config,
    });

    this.log(`포트폴리오 아이템 초기화 완료: .${itemClass}`);
    return true;
  }

  /**
   * 이벤트 리스너 설정
   * @param {HTMLElement} itemElement - 포트폴리오 아이템 요소
   * @param {HTMLVideoElement} videoElement - 비디오 요소
   * @param {NodeList} thumbnailButtons - 썸네일 버튼들
   */
  setupEventListeners(itemElement, videoElement, thumbnailButtons) {
    // 썸네일 클릭 이벤트
    thumbnailButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.handleThumbnailClick(
          button,
          videoElement,
          thumbnailButtons,
          index
        );
      });
    });

    // 비디오 이벤트
    videoElement.addEventListener('loadedmetadata', () => {
      this.log('비디오 메타데이터 로드 완료:', {
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    });

    videoElement.addEventListener('error', (event) => {
      this.log('비디오 로드 에러:', event);
    });

    videoElement.addEventListener('loadstart', () => {
      this.log('비디오 로딩 시작');
    });

    videoElement.addEventListener('canplay', () => {
      this.log('비디오 재생 준비 완료');
    });
  }

  /**
   * 썸네일 클릭 처리
   * @param {HTMLElement} clickedButton - 클릭된 썸네일 버튼
   * @param {HTMLVideoElement} videoElement - 비디오 요소
   * @param {NodeList} allButtons - 모든 썸네일 버튼들
   * @param {number} buttonIndex - 버튼 인덱스
   */
  handleThumbnailClick(clickedButton, videoElement, allButtons, buttonIndex) {
    // 모든 썸네일에서 active 클래스 제거
    allButtons.forEach((button) => button.classList.remove('active'));

    // 클릭된 썸네일에 active 클래스 추가
    clickedButton.classList.add('active');

    // 비디오 시간 설정
    const videoTimePercentage = clickedButton.getAttribute('data-video-time');
    if (videoElement && videoTimePercentage !== null) {
      const timeInSeconds =
        (parseFloat(videoTimePercentage) / 100) * (videoElement.duration || 0);
      videoElement.currentTime = timeInSeconds;

      this.log(`썸네일 ${buttonIndex + 1} 클릭:`, {
        timePercentage: videoTimePercentage,
        timeInSeconds,
        videoDuration: videoElement.duration,
      });

      // 비디오 재생
      videoElement.play().catch((error) => {
        this.log('비디오 자동 재생 실패:', error);
      });
    }
  }

  /**
   * 모든 포트폴리오 아이템 일괄 초기화
   * @param {Array} itemConfigs - 포트폴리오 아이템 설정 배열
   */
  initializeAllItems(itemConfigs) {
    this.log('모든 포트폴리오 아이템 일괄 초기화 시작:', itemConfigs);

    const results = itemConfigs.map((config) => {
      return this.initializePortfolioItem(config);
    });

    const successCount = results.filter(Boolean).length;
    this.log(
      `포트폴리오 아이템 초기화 완료: ${successCount}/${itemConfigs.length}`
    );

    return results;
  }

  /**
   * 특정 포트폴리오 아이템 정보 조회
   * @param {string} itemClass - 포트폴리오 아이템 클래스명
   * @returns {Object|null} 포트폴리오 아이템 정보
   */
  getPortfolioItem(itemClass) {
    return this.portfolioItems.get(itemClass) || null;
  }

  /**
   * 등록된 모든 포트폴리오 아이템 목록 조회
   * @returns {Array} 포트폴리오 아이템 클래스명 배열
   */
  getAllRegisteredItems() {
    return Array.from(this.portfolioItems.keys());
  }
}

// 전역 인스턴스 생성
window.VideoThumbnailManager = new VideoThumbnailManager();

// DOM 로드 완료 후 초기화 예제
document.addEventListener('DOMContentLoaded', function () {
  // 포트폴리오 아이템 설정 배열
  const portfolioConfigs = [
    {
      itemClass: 'first-item',
      youtubeUrl: 'https://www.youtube.com/watch?v=eqZKZOQIHfU',
      videoSrc: './src/assets/animation_gsap_scroll_pill.mp4',
      thumbnailTimes: [0, 30, 60], // 시작, 30%, 60% 지점
    },
    {
      itemClass: 'second-item',
      youtubeUrl: 'https://www.youtube.com/watch?v=RQp1dWnC4XU',
      videoSrc: './src/assets/animation_apple_scroll_watch_pc.mp4',
      thumbnailTimes: [0, 25, 50],
    },
    {
      itemClass: 'third-item',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Fa2HmsOe2g',
      videoSrc: './src/assets/React_multiStepForm.mp4',
      thumbnailTimes: [0, 40, 80],
    },
    {
      itemClass: 'fourth-item',
      youtubeUrl: 'https://www.youtube.com/watch?v=6onRTOI-L7o',
      videoSrc: './src/assets/[desktop]_Vite-vanila_웹-애플리케이션.mp4',
      thumbnailTimes: [0, 40, 80],
    },
    {
      itemClass: 'fifth-item',
      youtubeUrl: 'https://www.youtube.com/watch?v=pQ1dCTHB5q4',
      videoSrc: './src/assets/[ChartJS]_graph_Mixed-chart.mp4',
      thumbnailTimes: [0, 40, 80],
    },
  ];

  // 모든 포트폴리오 아이템 초기화
  window.VideoThumbnailManager.initializeAllItems(portfolioConfigs);
});
