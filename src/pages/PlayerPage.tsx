import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Video } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const PlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const url = searchParams.get('url');

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  useEffect(() => {
    // 模拟加载完成，让过渡更自然
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const getVideoTitle = useCallback((videoUrl: string) => {
    try {
      const filename = videoUrl.split('/').pop()?.split('?')[0];
      return filename?.replace(/\.[^/.]+$/, '') || '视频播放';
    } catch {
      return '视频播放';
    }
  }, []);

  if (!url) {
    return (
      <div className="min-h-screen bg-[#e8ecf1] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">无效的播放链接</p>
          <NeumorphicButton onClick={() => navigate('/')}>返回首页</NeumorphicButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e8ecf1] flex flex-col">
      {!isLandscape && (
        <div className="p-4 flex items-center justify-between bg-[#e8ecf1] z-10">
          <NeumorphicButton onClick={() => navigate('/')} className="p-3">
            <ArrowLeft size={24} className="text-gray-600" />
          </NeumorphicButton>
          <div className="flex-1 px-4 overflow-hidden">
             <h2 className="text-gray-700 font-medium truncate text-center flex items-center justify-center gap-2">
               <Video size={18} className="text-[#6c63ff]" />
               {getVideoTitle(decodeURIComponent(url))}
             </h2>
          </div>
          <div className="w-[60px]" />
        </div>
      )}

      <div className={`${isLandscape ? "flex-1" : "aspect-video w-full"} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <VideoPlayer url={decodeURIComponent(url)} />
      </div>

      {!isLandscape && (
        <div className="p-4 flex-1">
          <NeumorphicCard className="h-full p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-pulse" />
              <h3 className="text-gray-700 font-medium">播放信息</h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-gray-500 text-xs mb-2">播放链接</p>
              <p className="text-gray-700 text-sm break-all font-mono">
                {decodeURIComponent(url)}
              </p>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};
