import React from 'react';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';
import NeumorphicButton from './NeumorphicButton';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
  isFullscreen?: boolean;
  className?: string;
}

// 格式化时间
function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onFullscreen,
  isFullscreen = false,
  className,
}: PlaybackControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent ${className}`}>
      {/* 进度条 */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-white text-xs mt-1 opacity-80">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-6">
        <NeumorphicButton
          variant="circle"
          size="lg"
          onClick={onPlayPause}
          className="bg-black/40 text-white !shadow-none border border-white/20"
        >
          {isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </NeumorphicButton>
        
        <NeumorphicButton
          variant="circle"
          size="md"
          onClick={onFullscreen}
          className="bg-black/40 text-white !shadow-none border border-white/20"
        >
          {isFullscreen ? (
            <Minimize size={20} />
          ) : (
            <Maximize size={20} />
          )}
        </NeumorphicButton>
      </div>
    </div>
  );
}
