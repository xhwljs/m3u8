import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Rewind, FastForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onFullscreen,
  isFullscreen,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const handleUserActivity = () => {
    resetControlsTimer();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;
    onSeek(percent * duration);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      onMouseMove={handleUserActivity}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
    >
      <div
        className={`transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-12">
          <div className="space-y-4">
            <div 
              className="relative w-full h-2 bg-gray-700/50 rounded-full cursor-pointer group select-none"
              onClick={handleSeek}
              onTouchStart={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-[#6c63ff] rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSkip(-10)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:scale-110 transition-transform p-2"
                  title="快退 10 秒"
                >
                  <Rewind size={22} />
                </button>

                <button
                  onClick={onPlayPause}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:scale-110 transition-transform p-2"
                  title="快进 10 秒"
                >
                  <FastForward size={22} />
                </button>

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={onMuteToggle}
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center text-white hover:scale-110 transition-transform"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="text-white text-sm font-mono flex gap-2 items-center">
                <span>{formatTime(currentTime)}</span>
                <span className="text-gray-400">/</span>
                <span>{formatTime(duration)}</span>
              </div>

              <button
                onClick={onFullscreen}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
