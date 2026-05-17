import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import VideoPlayer, { VideoPlayerRef } from '@/components/VideoPlayer';
import PlaybackControls from '@/components/PlaybackControls';
import { NeumorphicCard } from '@/components/neumorphic';
import { useFullscreen } from '@/hooks/useFullscreen';

const PlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const videoUrl = searchParams.get('url') || '';
  const playerRef = useRef<VideoPlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  useEffect(() => {
    if (!videoUrl) {
      navigate('/');
    }
  }, [videoUrl, navigate]);

  useEffect(() => {
    const video = playerRef.current?.getVideoElement();
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        playerRef.current?.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: landscape)');
    const handleOrientationChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setShowInfo(!e.matches);
    };

    handleOrientationChange(mediaQuery);
    mediaQuery.addEventListener('change', handleOrientationChange);

    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, [isFullscreen]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    playerRef.current?.seek(time);
  }, []);

  const handleFullscreen = useCallback(async () => {
    if (containerRef.current) {
      await toggleFullscreen(containerRef.current);
    }
  }, [toggleFullscreen]);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    setIsLoading(false);
  }, []);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    if (playerRef.current?.getVideoElement()) {
      setDuration(playerRef.current.getVideoElement()?.duration || 0);
    }
  }, []);

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const getStatusText = () => {
    if (isLoading) return '加载中...';
    if (error) return '播放出错';
    if (isPlaying) return '正在播放';
    return '已暂停';
  };

  const handleBack = () => {
    playerRef.current?.pause();
    navigate('/');
  };

  if (!videoUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div
        ref={containerRef}
        className={`
          relative 
          ${isFullscreen ? 'fullscreen-container' : 'w-full'}
          ${!isFullscreen && showInfo ? 'h-[40vh] md:h-[50vh]' : 'h-screen'}
        `}
      >
        <VideoPlayer
          ref={playerRef}
          src={videoUrl}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onTimeUpdate={setCurrentTime}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {!isFullscreen && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 z-20 touch-target rounded-full bg-neu-bg shadow-neu-raised p-3 hover:scale-105 transition-transform"
            aria-label="返回"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <PlaybackControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isLoading={isLoading}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen}
        />
      </div>

      {!isFullscreen && showInfo && (
        <div className="bg-neu-bg p-4">
          <NeumorphicCard variant="raised" padding="medium" className="animate-fade-in">
            <div className="space-y-3">
              <div>
                <h3 className="text-gray-600 text-xs font-medium mb-1">播放链接</h3>
                <p className="text-gray-800 text-sm font-mono break-all">{truncateUrl(videoUrl, 80)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-gray-600 text-sm">{getStatusText()}</span>
              </div>
              {error && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};

export default PlayerPage;
