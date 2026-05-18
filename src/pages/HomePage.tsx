import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput } from '../components/NeumorphicInput';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { HistoryList } from '../components/HistoryList';
import { Play, TrendingUp, Star, StarOff, Settings, Moon, Sun, Share2, Info, ExternalLink, Copy, Check, Zap, Tv, Radio } from 'lucide-react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface FavoriteItem {
  url: string;
  name: string;
  timestamp: number;
}

const STORAGE_KEY = 'm3u8_player_history';
const FAVORITES_KEY = 'm3u8_player_favorites';

const DEMO_LINKS = [
  { name: 'Big Buck Bunny', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', duration: '9:56', quality: '1080p' },
  { name: 'Sintel', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', duration: '14:48', quality: '1080p' },
  { name: 'Tears of Steel', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', duration: '12:14', quality: '1080p' },
];

const FEATURES = [
  { icon: <Tv size={24} />, title: '高清播放', desc: '支持1080p高清视频' },
  { icon: <Zap size={24} />, title: '极速加载', desc: 'HLS低延迟技术' },
  { icon: <Radio size={24} />, title: '多码率切换', desc: '自适应网络环境' },
];

export const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }

    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites');
      }
    }

    const savedTheme = localStorage.getItem('m3u8_player_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('m3u8_player_theme', theme);
  }, [theme]);

  const saveToHistory = (newUrl: string) => {
    const filtered = history.filter(h => h.url !== newUrl);
    const newHistory = [{ url: newUrl, timestamp: Date.now() }, ...filtered].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const removeFromHistory = (urlToRemove: string) => {
    const newHistory = history.filter(h => h.url !== urlToRemove);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const addToFavorites = (favoriteUrl: string, favoriteName: string) => {
    const filtered = favorites.filter(f => f.url !== favoriteUrl);
    const newFavorites = [{ url: favoriteUrl, name: favoriteName, timestamp: Date.now() }, ...filtered];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (urlToRemove: string) => {
    const newFavorites = favorites.filter(f => f.url !== urlToRemove);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (inputUrl: string) => {
    const isFavorite = favorites.some(f => f.url === inputUrl);
    if (isFavorite) {
      removeFromFavorites(inputUrl);
    } else {
      const name = inputUrl.split('/').pop()?.split('?')[0] || '收藏的视频';
      addToFavorites(inputUrl, name);
    }
  };

  const handlePlay = (inputUrl: string = url) => {
    if (!inputUrl.trim()) return;
    saveToHistory(inputUrl);
    navigate(`/player?url=${encodeURIComponent(inputUrl)}`);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    setShowSettings(false);
  };

  const handleShare = async () => {
    const shareText = '🎬 发现一款超棒的M3U8在线播放器！快来试试吧！';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'M3U8 播放器',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const getVideoName = (videoUrl: string) => {
    const filename = videoUrl.split('/').pop()?.split('?')[0];
    return filename?.replace(/\.[^/.]+$/, '') || videoUrl;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'} pb-safe-bottom`}>
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-inherit backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800">
        <div className={`text-lg sm:text-xl font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          M3U8 播放器
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-lg`}
            title="分享"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } shadow-lg`}
            >
              <Settings size={18} />
            </button>
            
            {showSettings && (
              <div className={`absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl transition-all ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <button
                  onClick={toggleTheme}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
                </button>
                <button
                  onClick={() => { setShowAbout(true); setShowSettings(false); }}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Info size={18} />
                  <span>关于</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pb-6">
        <div className={`text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">在线流媒体播放器</h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            输入 M3U8 链接，随时随地观看高清视频
          </p>
        </div>

        <div className="space-y-4">
          <NeumorphicInput
            placeholder="请输入 M3U8 播放链接"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
            autoComplete="off"
            theme={theme}
          />
          
          <div className="flex gap-3">
            <NeumorphicButton 
              primary 
              onClick={() => handlePlay()} 
              disabled={!url.trim()}
              className="flex-1 min-h-[56px]"
              theme={theme}
            >
              <Play size={20} className="mr-2 fill-current" />
              开始播放
            </NeumorphicButton>
            
            <button
              onClick={() => toggleFavorite(url)}
              disabled={!url.trim()}
              className={`min-h-[56px] min-w-[56px] sm:min-w-[60px] rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                url.trim() ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
              } ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-yellow-500 hover:bg-yellow-50'
              } shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]`}
            >
              {favorites.some(f => f.url === url) ? <Star size={22} fill="currentColor" /> : <StarOff size={22} />}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {FEATURES.map((feature, idx) => (
            <NeumorphicCard 
              key={idx} 
              className="text-center p-4"
              theme={theme}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                theme === 'dark' ? 'bg-gray-700 text-[#6c63ff]' : 'bg-[#6c63ff]/10 text-[#6c63ff]'
              }`}>
                {feature.icon}
              </div>
              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                {feature.title}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {feature.desc}
              </p>
            </NeumorphicCard>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className={`flex items-center gap-2 px-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <TrendingUp size={16} />
            <h3 className="font-medium text-sm">精选视频</h3>
          </div>
          {DEMO_LINKS.map((demo, idx) => (
            <NeumorphicCard 
              key={idx} 
              onClick={() => handlePlay(demo.url)}
              className="cursor-pointer hover:scale-[1.02] transition-transform active:scale-98"
              theme={theme}
            >
              <div className="flex items-center">
                <div className={`w-16 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6]'
                }`}>
                  <Play size={20} className="text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      {demo.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {demo.quality}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {demo.duration}
                    </span>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          ))}
        </div>

        {favorites.length > 0 && (
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-1 w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <h3 className="font-medium text-sm">我的收藏 ({favorites.length})</h3>
            </button>
            
            {showFavorites && (
              <div className="space-y-2">
                {favorites.map((favorite, idx) => (
                  <NeumorphicCard 
                    key={idx} 
                    className="cursor-pointer hover:scale-[1.02] transition-transform active:scale-98"
                    theme={theme}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 min-w-0 mr-2"
                        onClick={() => handlePlay(favorite.url)}
                      >
                        <p className={`text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                          {favorite.name || getVideoName(favorite.url)}
                        </p>
                        <p className={`text-xs mt-1 truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {favorite.url}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromFavorites(favorite.url)}
                        className={`p-2 rounded-lg transition-colors active:scale-95 ${
                          theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-400' 
                            : 'hover:bg-red-50 text-red-400'
                        }`}
                      >
                        <StarOff size={16} />
                      </button>
                    </div>
                  </NeumorphicCard>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <HistoryList 
            history={history} 
            onSelect={handlePlay}
            onRemove={removeFromHistory}
            theme={theme}
          />
        </div>

        <div className={`mt-6 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-xs">
            支持 HLS (M3U8) 流媒体协议 | 支持画中画模式
          </p>
        </div>
      </div>

      {showAbout && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-6 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
              <h2 className={`text-xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                M3U8 播放器
              </h2>
              <p className={`text-sm text-center mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                v1.0.0
              </p>
            </div>
            <div className={`p-6 space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="text-sm">
                一款基于 React + TypeScript 开发的现代化 M3U8 在线播放器，支持高清视频播放、画中画模式、播放速度调节等功能。
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">主要功能：</p>
                <ul className="text-xs space-y-1">
                  <li>• HLS (M3U8) 流媒体协议支持</li>
                  <li>• 自动播放与手动播放</li>
                  <li>• 全屏与画中画模式</li>
                  <li>• 播放速度调节 (0.5x - 2x)</li>
                  <li>• 播放历史记录</li>
                  <li>• 视频收藏功能</li>
                  <li>• 深色/浅色主题切换</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => setShowAbout(false)}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-[#6c63ff] text-white hover:bg-[#5a52e6]' 
                    : 'bg-[#6c63ff] text-white hover:bg-[#5a52e6]'
                }`}
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
