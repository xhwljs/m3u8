import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, Rewind, FastForward, Gauge, PictureInPicture } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
  onPictureInPicture: () => void;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onFullscreen,
  onPictureInPicture,
  isFullscreen,
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  playbackRate,
  onPlaybackRateChange,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
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
        setShowSpeedMenu(false);
        setShowVolumeSlider(false);
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
    e.preventDefault();
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(percent * duration);
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    onSeek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const toggleSpeedMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowSpeedMenu(!showSpeedMenu);
    setShowVolumeSlider(false);
    resetControlsTimer();
  };

  const toggleVolumeSlider = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setShowVolumeSlider(!showVolumeSlider);
    setShowSpeedMenu(false);
    resetControlsTimer();
  };

  const selectSpeed = (rate: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaybackRateChange(rate);
    setShowSpeedMenu(false);
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
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 pt-8 sm:pt-12">
          <div className="space-y-3 sm:space-y-4">
            <div 
              className="relative w-full h-[6px] bg-gray-700/50 rounded-full cursor-pointer select-none touch-none"
              onClick={handleSeek}
              onTouchStart={handleSeek}
              onTouchMove={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-[#6c63ff] rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-lg transition-all"
                style={{ 
                  left: `calc(${progress}% - 8px)`,
                  opacity: showControls ? 1 : 0
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => handleSkip(-10)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white active:scale-90 transition-transform"
                  title="快退 10 秒"
                >
                  <Rewind className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                </button>

                <button
                  onClick={onPlayPause}
                  className="min-h-[52px] min-w-[52px] sm:min-h-[56px] sm:min-w-[56px] flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  {isPlaying ? <Pause className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] fill-white" /> : <Play className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] fill-white ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white active:scale-90 transition-transform"
                  title="快进 10 秒"
                >
                  <FastForward className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                </button>

                <div className="flex items-center gap-1 ml-1 sm:ml-2 relative">
                  <button
                    onClick={toggleVolumeSlider}
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center text-white active:scale-90 transition-transform"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" /> : <Volume2 className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />}
                  </button>
                  
                  {showVolumeSlider && (
                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={onPictureInPicture}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white active:scale-90 transition-transform"
                  title="画中画"
                >
                  <PictureInPicture className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                </button>

                <div className="relative">
                  <button
                    onClick={toggleSpeedMenu}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white active:scale-90 transition-transform gap-1"
                    title="播放速度"
                  >
                    <Gauge className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" />
                    <span className="text-xs sm:text-sm font-medium">{playbackRate}x</span>
                  </button>
                  
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg overflow-hidden shadow-xl border border-white/10">
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          onClick={(e) => selectSpeed(rate, e)}
                          className={`w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-left transition-colors active:scale-95 ${
                            playbackRate === rate 
                              ? 'bg-[#6c63ff] text-white' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-white text-xs sm:text-sm font-mono flex gap-1 sm:gap-2 items-center">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-gray-400">/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <button
                  onClick={onFullscreen}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  {isFullscreen ? <Minimize className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px]" /> : <Maximize className="w-[22px] h-[22px] sm:w-[24px] sm:h-[24px]" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
