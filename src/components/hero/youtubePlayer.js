// /src/components/hero/youtubePlayer.js

window.HeroYoutubePlayer = (() => {
  'use strict';

  // YouTube 플레이어 상태 관리
  let youtubePlayerState = {
    player: null,
    isPlaying: false,
    isReady: false,
    duration: 0,
    currentTime: 0,
    volume: 100,
    isMuted: false,
  };

  let galleryKeyboardState = {
    keyboardEnabled: true,
  };

  // 🎯 유틸리티 함수들
  const getVideoPlayerElement = (selector) => {
    return document.querySelector(selector);
  };

  // 🎬 YouTube Player 이벤트 핸들러들
  const onYouTubePlayerReady = (event) => {
    console.log('✅ YouTube 플레이어 준비 완료');
    youtubePlayerState.isReady = true;
    youtubePlayerState.duration = youtubePlayerState.player.getDuration();

    youtubePlayerState.player.playVideo();

    const videoPlayerContainer = getVideoPlayerElement(
      '.video-player-container'
    );
    if (videoPlayerContainer) {
      videoPlayerContainer.classList.add('playing');
      videoPlayerContainer.classList.remove('paused');
    }

    const playPauseButton = getVideoPlayerElement('#play-pause-btn');
    if (playPauseButton) {
      playPauseButton.setAttribute('aria-label', '일시정지');
    }
  };

  const onYouTubePlayerStateChange = (event) => {
    const playerState = event.data;

    switch (playerState) {
      case YT.PlayerState.PLAYING:
        youtubePlayerState.isPlaying = true;
        updatePlayPauseButtonState(true);
        console.log('▶️ YouTube 재생 시작');
        break;

      case YT.PlayerState.PAUSED:
        youtubePlayerState.isPlaying = false;
        updatePlayPauseButtonState(false);
        console.log('⏸️ YouTube 재생 일시정지');
        break;

      case YT.PlayerState.ENDED:
        youtubePlayerState.isPlaying = false;
        updatePlayPauseButtonState(false);
        console.log('⏹️ YouTube 재생 완료');
        break;
    }
  };

  const onYouTubePlayerError = (event) => {
    console.error('⚠ YouTube 플레이어 오류:', event.data);
  };

  // 🎮 플레이어 컨트롤 함수들
  const updatePlayPauseButtonState = (isCurrentlyPlaying) => {
    const videoPlayerContainer = getVideoPlayerElement(
      '.video-player-container'
    );
    const playPauseButton = getVideoPlayerElement('#play-pause-btn');

    if (videoPlayerContainer && playPauseButton) {
      if (isCurrentlyPlaying) {
        videoPlayerContainer.classList.add('playing');
        videoPlayerContainer.classList.remove('paused');
        playPauseButton.setAttribute('aria-label', '일시정지');
      } else {
        videoPlayerContainer.classList.add('paused');
        videoPlayerContainer.classList.remove('playing');
        playPauseButton.setAttribute('aria-label', '재생');
      }
    }
  };

  const toggleYouTubeVideoPlayback = () => {
    if (!youtubePlayerState.isReady || !youtubePlayerState.player) return;

    if (youtubePlayerState.isPlaying) {
      youtubePlayerState.player.pauseVideo();
    } else {
      youtubePlayerState.player.playVideo();
    }
  };

  // 🎬 YouTube Player 초기화
  const createYouTubePlayerInstance = () => {
    const playerContainer = getVideoPlayerElement('#youtube-player');
    if (!playerContainer) {
      console.error('⚠ YouTube 플레이어 컨테이너를 찾을 수 없습니다');
      return;
    }

    console.log('🎬 YouTube 플레이어 초기화 중...');

    youtubePlayerState.player = new YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: '0Tdv-98Z4kg',
      playerVars: {
        autoplay: 1,
        mute: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        start: 0,
        loop: 1,
        playlist: '0Tdv-98Z4kg',
        enablejsapi: 1,
        vq: 'hd720',
        playsinline: 1,
        widget_referrer: window.location.href,
      },
      events: {
        onReady: onYouTubePlayerReady,
        onStateChange: onYouTubePlayerStateChange,
        onError: onYouTubePlayerError,
      },
    });
  };

  // 🎮 비디오 컨트롤 이벤트 설정
  const setupVideoPlayerControlEvents = () => {
    console.log('🎬 YouTube 비디오 컨트롤 초기화 중...');

    const playPauseButton = getVideoPlayerElement('#play-pause-btn');

    if (playPauseButton) {
      playPauseButton.addEventListener('click', () => {
        toggleYouTubeVideoPlayback();
      });
    }

    document.addEventListener('keydown', (event) => {
      const { target, key } = event;
      const isInputField =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (isInputField) return;

      switch (key) {
        case ' ':
        case 'Enter':
          if (!galleryKeyboardState.keyboardEnabled) return;
          event.preventDefault();
          toggleYouTubeVideoPlayback();
          break;
      }
    });

    console.log('✅ YouTube 비디오 컨트롤 초기화 완료');
  };

  // 🚀 초기화 함수
  const initializeYouTubePlayerSystem = () => {
    console.log('🎬 YouTube 플레이어 시스템 초기화 시작');

    // 상태 초기화
    youtubePlayerState.player = null;
    youtubePlayerState.isPlaying = false;
    youtubePlayerState.isReady = false;
    galleryKeyboardState.keyboardEnabled = true;

    // 컨트롤 이벤트 설정
    setupVideoPlayerControlEvents();

    console.log('✅ YouTube 플레이어 시스템 초기화 완료');
  };

  // YouTube API 준비 완료 시 호출되는 전역 함수
  window.onYouTubeIframeAPIReady = () => {
    console.log('🎬 YouTube Player API 준비 완료');
    createYouTubePlayerInstance();
  };

  // 🌐 외부 인터페이스
  return {
    initialize: initializeYouTubePlayerSystem,
    createPlayer: createYouTubePlayerInstance,
    toggle: toggleYouTubeVideoPlayback,
    updateButton: updatePlayPauseButtonState,
    // 상태 접근자
    getPlayerState: () => youtubePlayerState,
    isReady: () => youtubePlayerState.isReady,
    isPlaying: () => youtubePlayerState.isPlaying,
  };
})();
