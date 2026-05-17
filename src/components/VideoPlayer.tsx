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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [state, setState] = useState<PlayerState>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const initializePlayer = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setState('loading');
    setErrorMsg('');

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
        setState('idle');
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
  }, [url]);

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

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, []);

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
        videoRef.current.play().catch(err => console.warn("Autoplay blocked:", err));
      }
    }
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

  const retry = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    initializePlayer();
  };

  return (
    <div ref={containerRef} className="relative w-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline
        onClick={togglePlay}
      />

      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <p className="text-white text-lg font-medium mb-2">播放失败</p>
          <p className="text-gray-400 text-sm mb-4">{errorMsg}</p>
          <button
            onClick={retry}
            className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#5a52e6] text-white px-6 py-3 rounded-full transition-colors"
          >
            <RefreshCw size={18} />
            重试
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
        isFullscreen={isFullscreen}
      />
    </div>
  );
};
