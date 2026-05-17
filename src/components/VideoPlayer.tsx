import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

export interface VideoPlayerRef {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  getVideoElement: () => HTMLVideoElement | null;
}

interface VideoPlayerProps {
  src: string;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  src,
  onLoadStart,
  onCanPlay,
  onError,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  autoPlay = false,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      videoRef.current?.play().catch((e) => {
        console.error('Play error:', e);
      });
    },
    pause: () => {
      videoRef.current?.pause();
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    getVideoElement: () => videoRef.current,
  }));

  useEffect(() => {
    if (!videoRef.current || !src) return;

    const video = videoRef.current;
    setIsLoading(true);
    setError(null);

    const handleCanPlay = () => {
      setIsLoading(false);
      onCanPlay?.();
      if (autoPlay) {
        video.play().catch((e) => {
          console.error('Auto play failed:', e);
        });
      }
    };

    const handleError = () => {
      const err = video.error;
      let errorMessage = '视频加载失败';
      
      if (err) {
        switch (err.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = '视频加载被中断';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误导致视频加载失败';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = '视频解码失败';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '视频格式不支持';
            break;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      onError?.(new Error(errorMessage));
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    const canPlayType = video.canPlayType('application/vnd.apple.mpegurl');
    const isNativeHls = canPlayType === 'probably' || canPlayType === 'maybe';

    if (isNativeHls) {
      video.src = src;
    } else if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        onLoadStart?.();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('网络错误，请检查网络连接');
              hls.destroy();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('媒体错误，尝试恢复...');
              hls.startLoad();
              break;
            default:
              setError('播放出错');
              hls.destroy();
              break;
          }
          onError?.(new Error(error || '播放出错'));
        }
      });

      hlsRef.current = hls;
    } else {
      setError('您的浏览器不支持HLS播放');
      onError?.(new Error('浏览器不支持HLS'));
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    const handlePlay = () => {
      onPlay?.();
    };

    const handlePause = () => {
      onPause?.();
    };

    const handleEnded = () => {
      onEnded?.();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsInline
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-neu-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-sm">加载中...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="bg-neu-bg rounded-neu p-6 max-w-sm text-center shadow-neu-raised">
            <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
