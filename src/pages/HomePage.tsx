import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput } from '../components/NeumorphicInput';
import { NeumorphicButton } from '../components/NeumorphicButton';
import { HistoryList } from '../components/HistoryList';
import { Play } from 'lucide-react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

const STORAGE_KEY = 'm3u8_player_history';

export const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
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
  }, []);

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

  const handlePlay = (inputUrl: string = url) => {
    if (!inputUrl.trim()) return;
    saveToHistory(inputUrl);
    navigate(`/player?url=${encodeURIComponent(inputUrl)}`);
  };

  return (
    <div className="min-h-screen bg-[#e8ecf1] p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-700 tracking-wider">
            M3U8 播放器
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
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
          />
          
          <NeumorphicButton 
            primary 
            onClick={() => handlePlay()} 
            disabled={!url.trim()}
            className="w-full"
          >
            <Play size={20} className="mr-2 fill-current" />
            开始播放
          </NeumorphicButton>
        </div>

        <div className="pt-4">
          <HistoryList 
            history={history} 
            onSelect={handlePlay}
            onRemove={removeFromHistory}
          />
        </div>
      </div>
    </div>
  );
};
