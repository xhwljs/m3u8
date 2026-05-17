import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NeumorphicButton from '../components/NeumorphicButton';
import NeumorphicCard from '../components/NeumorphicCard';
import { VideoPlayerWithRef } from '../components/VideoPlayer';
import PlaybackControls from '../components/PlaybackControls';

export default function PlayerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const url = searchParams.get('url');
  
  const videoRef = useRef<{
    play: () => Promise<void> | undefined;
    pause: () => void;
    setCurrentTime: (time: number) => void;
    requestFullscreen: () => void;
    getVideoElement: () => HTMLVideoElement | null;
  }>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理屏幕方向
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  // 检查 URL
  useEffect(() => {
    if (!url) {
      navigate('/');
    }
  }, [url, navigate]);

  // 监听屏幕方向变化
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    const handleOrientationChange = () => {
      setIsLandscape(window.orientation === 90 || window.orientation === -90);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 自动隐藏控制栏
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  // 处理视频交互
  const handleVideoContainerClick = () => {
    resetControlsTimeout();
  };

  // 播放控制
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  };

  const handleSeek = (time: number) => {
    videoRef.current?.setCurrentTime(time);
    setCurrentTime(time);
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  if (!url) {
    return null;
  }

  const containerHeight = isFullscreen ? 'h-screen' : (isLandscape ? 'h-screen' : 'h-[40vh]');

  return (
    <div className="min-h-screen bg-[#e8ecf1] flex flex-col">
      {/* 视频区域 */}
      <div
        className={`relative w-full ${containerHeight} bg-black`}
        onClick={handleVideoContainerClick}
      >
        {/* 返回按钮 - 仅在非全屏和竖屏时显示 */}
        {!isFullscreen && !isLandscape && (
          <div className="absolute top-4 left-4 z-10">
            <NeumorphicButton
              variant="circle"
              size="md"
              onClick={() => navigate('/')}
              className="bg-black/40 text-white !shadow-none border border-white/20"
            >
              <ArrowLeft size={20} />
            </NeumorphicButton>
          </div>
        )}

        {/* 视频播放器 */}
        <VideoPlayerWithRef
          ref={videoRef}
          url={url}
          autoPlay={false}
          onTimeUpdate={setCurrentTime}
          onPlayStateChange={setIsPlaying}
          onLoadedMetadata={setDuration}
          onError={setError}
          className="w-full h-full"
        />

        {/* 控制栏 */}
        <div
          className={`transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <PlaybackControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onFullscreen={handleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      </div>

      {/* 视频信息 - 仅在非全屏和竖屏时显示 */}
      {!isFullscreen && !isLandscape && (
        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto">
            <NeumorphicCard className="p-6">
              <h2 className="text-gray-700 font-medium mb-2">播放链接</h2>
              <p className="text-gray-500 text-sm break-all">
                {url}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  {error ? (
                    <span className="text-red-500">播放出错: {error}</span>
                  ) : isPlaying ? (
                    '正在播放...'
                  ) : (
                    '已暂停'
                  )}
                </p>
              </div>
            </NeumorphicCard>
          </div>
        </div>
      )}

      {/* 横屏时的返回按钮 */}
      {!isFullscreen && isLandscape && (
        <div className="absolute top-4 left-4 z-10">
          <NeumorphicButton
            variant="circle"
            size="md"
            onClick={() => navigate('/')}
            className="bg-black/40 text-white !shadow-none border border-white/20"
          >
            <ArrowLeft size={20} />
          </NeumorphicButton>
        </div>
      )}
    </div>
  );
}
