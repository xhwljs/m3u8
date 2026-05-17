import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  url: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onLoadedMetadata?: (duration: number) => void;
  onError?: (error: string) => void;
  autoPlay?: boolean;
  className?: string;
}

interface VideoPlayerRef {
  play: () => Promise<void> | undefined;
  pause: () => void;
  setCurrentTime: (time: number) => void;
  requestFullscreen: () => void;
  getVideoElement: () => HTMLVideoElement | null;
}

// 主要使用带 ref 的版本
export const VideoPlayerWithRef = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      setCurrentTime: (time: number) => {
        if (videoRef.current) videoRef.current.currentTime = time;
      },
      requestFullscreen: () => {
        const elem = videoRef.current?.parentElement;
        if (elem?.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any)?.webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        }
      },
      getVideoElement: () => videoRef.current,
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !props.url) return;

      setIsLoading(true);
      setError(null);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = props.url;
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(props.url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (props.autoPlay) {
            video.play().catch(() => {});
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            const errorMsg = `HLS Error: ${data.type} - ${data.details}`;
            setError(errorMsg);
            props.onError?.(errorMsg);
            setIsLoading(false);
          }
        });
      } else {
        const errorMsg = '您的浏览器不支持此视频格式';
        setError(errorMsg);
        props.onError?.(errorMsg);
        setIsLoading(false);
      }

      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        const errorMsg = '视频加载失败';
        setError(errorMsg);
        props.onError?.(errorMsg);
        setIsLoading(false);
      };
      const handleTimeUpdate = () => {
        props.onTimeUpdate?.(video.currentTime, video.duration || 0);
      };
      const handlePlay = () => props.onPlayStateChange?.(true);
      const handlePause = () => props.onPlayStateChange?.(false);
      const handleLoadedMetadata = () => {
        props.onLoadedMetadata?.(video.duration || 0);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);

        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    }, [props.url, props.autoPlay, props.onTimeUpdate, props.onPlayStateChange, props.onLoadedMetadata, props.onError]);

    return (
      <div className={`relative w-full h-full bg-black overflow-hidden ${props.className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          webkit-playsInline
          controls={false}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-10 h-10 border-4 border-[#7c6ff7] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4">
            <div className="text-white text-center">
              <p className="text-red-500 mb-2">播放出错</p>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoPlayerWithRef.displayName = 'VideoPlayerWithRef';

// 简单版本（不带 ref）
export default function VideoPlayer({
  url,
  onTimeUpdate,
  onPlayStateChange,
  onLoadedMetadata,
  onError,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  return (
    <VideoPlayerWithRef
      url={url}
      onTimeUpdate={onTimeUpdate}
      onPlayStateChange={onPlayStateChange}
      onLoadedMetadata={onLoadedMetadata}
      onError={onError}
      autoPlay={autoPlay}
      className={className}
    />
  );
}
