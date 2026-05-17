import { useRef, useState, useEffect } from 'react';
import { formatDuration } from '@/utils/timeFormat';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  isLoading,
  onPlayPause,
  onSeek,
  onFullscreen,
  isFullscreen,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (isPlaying && !isDragging) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
    setShowControls(true);
  }, [isPlaying, isDragging]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={`
        video-controls 
        absolute 
        bottom-0 
        left-0 
        right-0 
        p-4 
        transition-opacity 
        duration-300
        ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}
      `}
      onMouseEnter={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="icon-btn touch-target"
            disabled={isLoading}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isLoading ? (
              <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 flex items-center gap-2">
            <span className="text-white text-sm font-mono min-w-[45px]">
              {formatDuration(currentTime)}
            </span>

            <div
              ref={progressRef}
              className="flex-1 h-2 progress-bar cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-neu-primary to-neu-secondary rounded-full"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 progress-slider"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>

            <span className="text-white text-sm font-mono min-w-[45px]">
              {formatDuration(duration)}
            </span>
          </div>

          <button
            onClick={onFullscreen}
            className="icon-btn touch-target"
            aria-label={isFullscreen ? '退出全屏' : '全屏'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
