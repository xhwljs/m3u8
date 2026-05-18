import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput } from '../components/NeumorphicInput';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { HistoryList } from '../components/HistoryList';
import { Play, TrendingUp, Star, StarOff, Settings, Moon, Sun } from 'lucide-react';

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
  { name: 'Big Buck Bunny', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { name: 'Sintel', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
  { name: 'Tears of Steel', url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
];

export const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showSettings, setShowSettings] = useState(false);
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

  const getVideoName = (videoUrl: string) => {
    const filename = videoUrl.split('/').pop()?.split('?')[0];
    return filename?.replace(/\.[^/.]+$/, '') || videoUrl;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#e8ecf1]'}`}>
      <div className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between bg-inherit backdrop-blur-sm">
        <div className={`text-2xl font-bold tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          M3U8 播放器
        </div>
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-lg`}
          >
            <Settings size={20} />
          </button>
          
          {showSettings && (
            <div className={`absolute right-0 mt-2 w-40 rounded-xl overflow-hidden shadow-xl transition-all ${
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
            </div>
          )}
        </div>
      </div>

      <div className="p-4 pb-6">
        <div className={`text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            输入链接，随时随地观看
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
              className="flex-1"
              theme={theme}
            >
              <Play size={20} className="mr-2 fill-current" />
              开始播放
            </NeumorphicButton>
            
            <button
              onClick={() => toggleFavorite(url)}
              disabled={!url.trim()}
              className={`min-h-[52px] min-w-[52px] rounded-xl flex items-center justify-center transition-all ${
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

        {/* 示例视频区域 */}
        <div className="mt-6 space-y-3">
          <div className={`flex items-center gap-2 px-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <TrendingUp size={16} />
            <h3 className="font-medium text-sm">示例视频</h3>
          </div>
          {DEMO_LINKS.map((demo, idx) => (
            <NeumorphicCard 
              key={idx} 
              onClick={() => handlePlay(demo.url)}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
              theme={theme}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-2">
                  <p className={`text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                    {demo.name}
                  </p>
                  <p className={`text-xs mt-1 truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {demo.url}
                  </p>
                </div>
                <Play size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
              </div>
            </NeumorphicCard>
          ))}
        </div>

        {/* 收藏区域 */}
        {favorites.length > 0 && (
          <div className="mt-6 space-y-3">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-1 w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <h3 className="font-medium text-sm">收藏 ({favorites.length})</h3>
            </button>
            
            {showFavorites && (
              <div className="space-y-2">
                {favorites.map((favorite, idx) => (
                  <NeumorphicCard 
                    key={idx} 
                    className="cursor-pointer hover:scale-[1.02] transition-transform"
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
                        className={`p-2 rounded-lg transition-colors ${
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

        {/* 历史记录区域 */}
        <div className="mt-6">
          <HistoryList 
            history={history} 
            onSelect={handlePlay}
            onRemove={removeFromHistory}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
