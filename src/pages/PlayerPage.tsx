import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Video, Copy, Check } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { NeumorphicButton } from '../components/NeumorphicButton';

export const PlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLandscape, setIsLandscape] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

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

  const handleCopyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(decodeURIComponent(url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'} pb-safe-bottom`}>
      {!isLandscape && (
        <div className={`p-3 flex items-center justify-between z-10 flex-shrink-0 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-[#e8ecf1]/95'} backdrop-blur-md`}>
          <button
            onClick={() => navigate('/')}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-lg`}
          >
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1 px-3 overflow-hidden">
             <h2 className={`font-medium truncate text-center flex items-center justify-center gap-2 text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
               <Video size={16} className="text-[#6c63ff] flex-shrink-0" />
               {getVideoTitle(decodeURIComponent(url))}
             </h2>
          </div>
          <button
            onClick={handleCopyUrl}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-lg`}
            title="复制链接"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      )}

      <div className={`relative flex-shrink-0 ${isLandscape ? "flex-1 w-full" : "aspect-video w-full"} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
        <VideoPlayer url={decodeURIComponent(url)} />
      </div>

      {!isLandscape && (
        <div className="p-4 flex-1 overflow-hidden">
          <NeumorphicCard className="h-full p-4" theme={theme}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#6c63ff] rounded-full animate-pulse" />
                <h3 className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>播放信息</h3>
              </div>
              <button
                onClick={handleCopyUrl}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <div className={`rounded-xl p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-100'}`}>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>播放链接</p>
              <p className={`text-xs sm:text-sm break-all font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {decodeURIComponent(url)}
              </p>
            </div>
            <div className={`mt-3 rounded-xl p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-100'}`}>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>操作提示</p>
              <ul className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• 点击视频区域暂停/播放</li>
                <li>• 双击视频区域切换全屏</li>
                <li>• 拖动进度条可快进/快退</li>
              </ul>
            </div>
          </NeumorphicCard>
        </div>
      )}
    </div>
  );
};
