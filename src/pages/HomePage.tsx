import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput } from '../components/NeumorphicInput';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { NeumorphicCard } from '../components/NeumorphicCard';
import { HistoryList } from '../components/HistoryList';
import { Play, TrendingUp, Star, StarOff, Settings, Share2, Info, Copy, Check, Zap, Tv, Radio, Palette } from 'lucide-react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface FavoriteItem {
  url: string;
  name: string;
  timestamp: number;
}

interface ThemeColor {
  id: string;
  name: string;
  primary: string;
  bg: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
}

const THEMES: ThemeColor[] = [
  { id: 'light', name: '浅灰', primary: '#6c63ff', bg: '#e8ecf1', cardBg: '#ffffff', text: '#374151', textSecondary: '#6b7280', border: '#e5e7eb' },
  { id: 'light-blue', name: '浅蓝', primary: '#3b82f6', bg: '#e0f2fe', cardBg: '#ffffff', text: '#1e40af', textSecondary: '#64748b', border: '#bfdbfe' },
  { id: 'light-green', name: '浅绿', primary: '#10b981', bg: '#d1fae5', cardBg: '#ffffff', text: '#065f46', textSecondary: '#059669', border: '#a7f3d0' },
  { id: 'light-orange', name: '浅橙', primary: '#f59e0b', bg: '#fffbeb', cardBg: '#ffffff', text: '#92400e', textSecondary: '#d97706', border: '#fef3c7' },
  { id: 'light-pink', name: '浅粉', primary: '#ec4899', bg: '#fdf2f8', cardBg: '#ffffff', text: '#831843', textSecondary: '#be185d', border: '#fce7f3' },
  { id: 'dark', name: '深灰', primary: '#818cf8', bg: '#111827', cardBg: '#1f2937', text: '#f9fafb', textSecondary: '#9ca3af', border: '#374151' },
  { id: 'dark-blue', name: '深蓝', primary: '#60a5fa', bg: '#0f172a', cardBg: '#1e293b', text: '#f1f5f9', textSecondary: '#94a3b8', border: '#334155' },
  { id: 'dark-purple', name: '深紫', primary: '#a78bfa', bg: '#1a1625', cardBg: '#2d2640', text: '#f5f3ff', textSecondary: '#c4b5fd', border: '#4c3d6c' },
];

const STORAGE_KEY = 'm3u8_player_history';
const FAVORITES_KEY = 'm3u8_player_favorites';
const THEME_KEY = 'm3u8_player_theme_color';

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
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>(THEMES[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
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

    const savedThemeId = localStorage.getItem(THEME_KEY);
    if (savedThemeId) {
      const theme = THEMES.find(t => t.id === savedThemeId);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, currentTheme.id);
    if (currentTheme.id.startsWith('dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

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

  const isDark = currentTheme.id.startsWith('dark');
  const neumorphicShadow = isDark 
    ? 'shadow-[5px_5px_15px_rgba(0,0,0,0.4),-5px_-5px_15px_rgba(255,255,255,0.05)]'
    : 'shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]';

  return (
    <div style={{ backgroundColor: currentTheme.bg, minHeight: '100vh' }} className="transition-colors duration-300 pb-safe-bottom">
      <div 
        className="sticky top-0 z-20 px-4 py-3 flex items-center justify-between backdrop-blur-md"
        style={{ 
          backgroundColor: currentTheme.bg, 
          borderBottom: `1px solid ${currentTheme.border}` 
        }}
      >
        <div style={{ color: currentTheme.text }} className="text-lg sm:text-xl font-bold tracking-wider">
          M3U8 播放器
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all shadow-lg"
            style={{ 
              backgroundColor: currentTheme.cardBg, 
              color: currentTheme.text 
            }}
            title="分享"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all shadow-lg"
              style={{ 
                backgroundColor: currentTheme.cardBg, 
                color: currentTheme.text 
              }}
            >
              <Settings size={18} />
            </button>
            
            {showSettings && (
              <div 
                className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden shadow-xl transition-all"
                style={{ backgroundColor: currentTheme.cardBg }}
              >
                <button
                  onClick={() => { setShowThemeModal(true); setShowSettings(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                  style={{ color: currentTheme.text }}
                >
                  <Palette size={18} style={{ color: currentTheme.primary }} />
                  <span>主题颜色</span>
                </button>
                <button
                  onClick={() => { setShowAbout(true); setShowSettings(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left transition-colors"
                  style={{ color: currentTheme.text }}
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
        <div style={{ color: currentTheme.text }} className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">在线流媒体播放器</h1>
          <p style={{ color: currentTheme.textSecondary }} className="text-sm">
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
            theme={isDark ? 'dark' : 'light'}
          />
          
          <div className="flex gap-3">
            <NeumorphicButton 
              primary 
              onClick={() => handlePlay()} 
              disabled={!url.trim()}
              className="flex-1 min-h-[56px]"
              theme={isDark ? 'dark' : 'light'}
            >
              <Play size={20} className="mr-2 fill-current" />
              开始播放
            </NeumorphicButton>
            
            <button
              onClick={() => toggleFavorite(url)}
              disabled={!url.trim()}
              className={`min-h-[56px] min-w-[56px] sm:min-w-[60px] rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                url.trim() ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
              } ${neumorphicShadow}`}
              style={{ 
                backgroundColor: currentTheme.cardBg, 
                color: '#f59e0b' 
              }}
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
              theme={isDark ? 'dark' : 'light'}
            >
              <div 
                className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-2"
                style={{ 
                  backgroundColor: isDark ? `${currentTheme.primary}20` : `${currentTheme.primary}15`, 
                  color: currentTheme.primary 
                }}
              >
                {feature.icon}
              </div>
              <p style={{ color: currentTheme.text }} className="text-sm font-medium mb-1">
                {feature.title}
              </p>
              <p style={{ color: currentTheme.textSecondary }} className="text-xs">
                {feature.desc}
              </p>
            </NeumorphicCard>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 px-1" style={{ color: currentTheme.textSecondary }}>
            <TrendingUp size={16} />
            <h3 className="font-medium text-sm">精选视频</h3>
          </div>
          {DEMO_LINKS.map((demo, idx) => (
            <NeumorphicCard 
              key={idx} 
              onClick={() => handlePlay(demo.url)}
              className="cursor-pointer hover:scale-[1.02] transition-transform active:scale-98"
              theme={isDark ? 'dark' : 'light'}
            >
              <div className="flex items-center">
                <div 
                  className="w-16 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primary}dd)` 
                  }}
                >
                  <Play size={20} className="text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0 ml-3">
                  <div className="flex items-center justify-between">
                    <p style={{ color: currentTheme.text }} className="text-sm font-medium truncate">
                      {demo.name}
                    </p>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: isDark ? `${currentTheme.primary}20` : `${currentTheme.primary}10`, 
                        color: currentTheme.textSecondary 
                      }}
                    >
                      {demo.quality}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: currentTheme.textSecondary }} className="text-xs">
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
              className="flex items-center gap-2 px-1 w-full"
              style={{ color: currentTheme.textSecondary }}
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
                    theme={isDark ? 'dark' : 'light'}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1 min-w-0 mr-2"
                        onClick={() => handlePlay(favorite.url)}
                      >
                        <p style={{ color: currentTheme.text }} className="text-sm truncate">
                          {favorite.name || getVideoName(favorite.url)}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }} className="text-xs mt-1 truncate">
                          {favorite.url}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromFavorites(favorite.url)}
                        className="p-2 rounded-lg transition-colors active:scale-95"
                        style={{ 
                          color: isDark ? '#f87171' : '#ef4444' 
                        }}
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
            theme={isDark ? 'dark' : 'light'}
          />
        </div>

        <div style={{ color: currentTheme.textSecondary }} className="mt-6 text-center">
          <p className="text-xs">
            支持 HLS (M3U8) 流媒体协议 | 支持画中画模式
          </p>
        </div>
      </div>

      {showThemeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowThemeModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
            style={{ backgroundColor: currentTheme.cardBg }}
            onClick={e => e.stopPropagation()}
          >
            <div 
              className="p-5"
              style={{ borderBottom: `1px solid ${currentTheme.border}` }}
            >
              <div className="flex items-center justify-between">
                <h2 style={{ color: currentTheme.text }} className="text-lg font-bold">
                  主题颜色
                </h2>
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: `${currentTheme.primary}10`, color: currentTheme.textSecondary }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="mb-5">
                <p style={{ color: currentTheme.textSecondary }} className="text-sm font-medium mb-3 px-1">
                  浅色主题
                </p>
                <div className="grid grid-cols-5 gap-2.5">
                  {THEMES.filter(t => !t.id.startsWith('dark')).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => { setCurrentTheme(theme); setShowThemeModal(false); }}
                      className="group relative aspect-square rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ 
                        backgroundColor: theme.bg,
                        boxShadow: currentTheme.id === theme.id 
                          ? `0 0 0 3px ${theme.primary}, 0 4px 12px rgba(0,0,0,0.15)` 
                          : '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-2">
                        <div 
                          className="w-7 h-7 rounded-xl transition-transform duration-200 group-hover:scale-110"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}cc)` 
                          }}
                        />
                      </div>
                      {currentTheme.id === theme.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2.5">
                  {THEMES.filter(t => !t.id.startsWith('dark')).map((theme) => (
                    <p 
                      key={`name-${theme.id}`}
                      className="text-center text-xs font-medium"
                      style={{ 
                        color: currentTheme.id === theme.id ? currentTheme.primary : currentTheme.textSecondary 
                      }}
                    >
                      {theme.name}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ color: currentTheme.textSecondary }} className="text-sm font-medium mb-3 px-1">
                  深色主题
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {THEMES.filter(t => t.id.startsWith('dark')).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => { setCurrentTheme(theme); setShowThemeModal(false); }}
                      className="group relative aspect-square rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{ 
                        backgroundColor: theme.bg,
                        boxShadow: currentTheme.id === theme.id 
                          ? `0 0 0 3px ${theme.primary}, 0 4px 12px rgba(0,0,0,0.3)` 
                          : '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div className="w-full h-full rounded-xl flex flex-col items-center justify-center p-2">
                        <div 
                          className="w-8 h-8 rounded-xl transition-transform duration-200 group-hover:scale-110"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primary}cc)` 
                          }}
                        />
                      </div>
                      {currentTheme.id === theme.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2.5">
                  {THEMES.filter(t => t.id.startsWith('dark')).map((theme) => (
                    <p 
                      key={`name-${theme.id}`}
                      className="text-center text-xs font-medium"
                      style={{ 
                        color: currentTheme.id === theme.id ? currentTheme.primary : currentTheme.textSecondary 
                      }}
                    >
                      {theme.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setShowThemeModal(false)}
                className="w-full py-3.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.primary}dd)`, 
                  color: '#ffffff',
                  boxShadow: `0 4px 16px ${currentTheme.primary}40`
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {showAbout && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowAbout(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: currentTheme.cardBg }}
            onClick={e => e.stopPropagation()}
          >
            <div 
              className="p-6"
              style={{ borderBottom: `1px solid ${currentTheme.border}` }}
            >
              <h2 style={{ color: currentTheme.text }} className="text-xl font-bold text-center">
                M3U8 播放器
              </h2>
              <p style={{ color: currentTheme.textSecondary }} className="text-sm text-center mt-1">
                v1.0.0
              </p>
            </div>
            <div style={{ color: currentTheme.text }} className="p-6 space-y-4">
              <p className="text-sm">
                一款基于 React + TypeScript 开发的现代化 M3U8 在线播放器，支持高清视频播放、画中画模式、播放速度调节等功能。
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">主要功能：</p>
                <ul className="text-xs space-y-1" style={{ color: currentTheme.textSecondary }}>
                  <li>• HLS (M3U8) 流媒体协议支持</li>
                  <li>• 自动播放与手动播放</li>
                  <li>• 全屏与画中画模式</li>
                  <li>• 播放速度调节 (0.5x - 2x)</li>
                  <li>• 播放历史记录</li>
                  <li>• 视频收藏功能</li>
                  <li>• 多种主题颜色</li>
                </ul>
              </div>
            </div>
            <div style={{ backgroundColor: currentTheme.bg }} className="p-4">
              <button
                onClick={() => setShowAbout(false)}
                className="w-full py-3 rounded-xl font-medium transition-colors"
                style={{ 
                  backgroundColor: currentTheme.primary, 
                  color: '#ffffff' 
                }}
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
