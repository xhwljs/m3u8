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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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
    const savedTheme = localStorage.getItem('m3u8_player_theme');
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');
    
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
      <div className={`min-h-screen flex items-center justify-center p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'}`}>
        <div className="text-center">
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>无效的播放链接</p>
          <NeumorphicButton onClick={() => navigate('/')} theme={theme}>返回首页</NeumorphicButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'}`}>
      {!isLandscape && (
        <div className={`p-4 flex items-center justify-between z-10 flex-shrink-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'}`}>
          <NeumorphicButton onClick={() => navigate('/')} className="p-3" theme={theme}>
            <ArrowLeft size={24} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          </NeumorphicButton>
          <div className="flex-1 px-4 overflow-hidden">
             <h2 className={`font-medium truncate text-center flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
               <Video size={18} className="text-[#6c63ff]" />
               {getVideoTitle(decodeURIComponent(url))}
             </h2>
          </div>
          <div className="w-[60px]" />
        </div>
      )}

      <div className={`flex-shrink-0 ${isLandscape ? "flex-1" : "aspect-video w-full"} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <VideoPlayer url={decodeURIComponent(url)} />
      </div>

      {!isLandscape && (
        <div className="p-4 flex-1 overflow-hidden">
          <NeumorphicCard className="h-full p-5" theme={theme}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-pulse" />
              <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>播放信息</h3>
            </div>
            <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-100'}`}>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>播放链接</p>
              <p className={`text-sm break-all font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {decodeURIComponent(url)}
              </p>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};
