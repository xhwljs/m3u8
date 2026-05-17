import React from 'react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
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
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
      <div className="flex flex-col gap-3">
        <div className="relative w-full h-2 bg-gray-700/50 rounded-full cursor-pointer group"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const percent = (e.clientX - rect.left) / rect.width;
               onSeek(percent * duration);
             }}>
          <div 
            className="absolute top-0 left-0 h-full bg-[#7c6ff7] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={onPlayPause}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
          </button>

          <div className="text-white text-sm font-mono flex gap-2">
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
  );
};
