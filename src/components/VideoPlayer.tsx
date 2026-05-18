import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { PlaybackControls } from './PlaybackControls';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
}

type PlayerState = 'loading' | 'playing' | 'paused' | 'error' | 'idle';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastClickTime = useRef<number>(0);
  const autoplayAttempted = useRef<boolean>(false);
  const handlersRef = useRef<{[key: string]: () => void}>({});

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [state, setState] = useState<PlayerState>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || autoplayAttempted.current) return;
    
    autoplayAttempted.current = true;
    console.log('Attempting to autoplay...');
    
    video.muted = true;
    video.volume = 0;
    setIsMuted(true);
    setVolume(0);
    
    video.play().then(() => {
      console.log('✅ Autoplay successful!');
      setState('playing');
      setIsPlaying(true);
    }).catch((err) => {
      console.warn('❌ Autoplay failed:', err);
      setState('idle');
    });
  }, []);

  const initializePlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    autoplayAttempted.current = false;
    setState('loading');
    setErrorMsg('');
    
    video.muted = true;
    video.volume = 0;
    setIsMuted(true);
    setVolume(0);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed');
        setState('idle');
        attemptPlay();
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        console.log('First fragment loaded');
        attemptPlay();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('HLS Fatal Error:', data);
          setState('error');
          setErrorMsg('视频加载失败，请检查链接是否有效');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      setState('error');
      setErrorMsg('您的浏览器不支持HLS播放');
    }
  }, [url, attemptPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => { setIsPlaying(true); setState('playing'); };
    const handlePause = () => { setIsPlaying(false); setState('paused'); };
    const handleWaiting = () => setState('loading');
    const handlePlaying = () => setState('playing');
    const handleError = () => {
      setState('error');
      setErrorMsg('播放出错');
    };

    const handleCanPlay = () => {
      console.log('Video event: canplay');
      attemptPlay();
    };

    handlersRef.current = {
      handleTimeUpdate,
      handleLoadedMetadata,
      handlePlay,
      handlePause,
      handleWaiting,
      handlePlaying,
      handleError,
      handleCanPlay,
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay, { once: true });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [attemptPlay]);

  useEffect(() => {
    initializePlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [initializePlayer]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      video.volume = isMuted ? 0 : volume;
      video.playbackRate = playbackRate;
    }
  }, [volume, isMuted, playbackRate]);

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        videoRef.current?.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying]);

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.warn("Play blocked:", err));
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;
    
    if (timeSinceLastClick < 300) {
      toggleFullscreen();
    } else {
      togglePlay();
    }
    lastClickTime.current = now;
  };

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('Picture-in-Picture not supported:', err);
    }
  };

  const retry = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    autoplayAttempted.current = false;
    initializePlayer();
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      setVolume(0);
    } else if (volume === 0) {
      setVolume(1);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline
        onClick={handleVideoClick}
      />

      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white/80 text-sm">正在加载...</p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6 text-center">
          <AlertCircle className="w-14 h-14 text-red-400 mb-4" />
          <p className="text-white text-lg font-medium mb-2">播放失败</p>
          <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52e6] text-white px-8 py-3 rounded-full transition-colors shadow-lg"
          >
            <RefreshCw size={18} />
            重试播放
          </button>
        </div>
      )}

      <PlaybackControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={togglePlay}
        onSeek={seek}
        onFullscreen={toggleFullscreen}
        onPictureInPicture={togglePictureInPicture}
        isFullscreen={isFullscreen}
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        playbackRate={playbackRate}
        onPlaybackRateChange={handlePlaybackRateChange}
      />
    </div>
  );
};
