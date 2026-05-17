import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput, NeumorphicButton, NeumorphicCard } from '@/components/neumorphic';
import HistoryList from '@/components/HistoryList';
import { useHistory } from '@/hooks/useHistory';

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { history, addToHistory, removeFromHistory } = useHistory();

  const handlePlay = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return;
    }

    addToHistory(trimmedUrl);
    navigate(`/player?url=${encodeURIComponent(trimmedUrl)}`);
  };

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    addToHistory(selectedUrl);
    navigate(`/player?url=${encodeURIComponent(selectedUrl)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg p-4 md:p-8">
      <div className="max-w-md mx-auto pt-8 md:pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neu-primary mb-2 tracking-wide">
            M3U8播放器
          </h1>
          <p className="text-gray-500 text-sm">
            支持HLS流媒体播放
          </p>
        </div>

        <NeumorphicCard variant="raised" padding="large" className="mb-6 animate-fade-in">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                播放链接
              </label>
              <NeumorphicInput
                value={url}
                onChange={setUrl}
                placeholder="请输入M3U8播放链接"
                onKeyPress={handleKeyPress}
              />
            </div>

            <NeumorphicButton
              onClick={handlePlay}
              disabled={!url.trim()}
              fullWidth
              size="large"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                开始播放
              </span>
            </NeumorphicButton>
          </div>
        </NeumorphicCard>

        <HistoryList
          history={history}
          onSelect={handleHistorySelect}
          onRemove={removeFromHistory}
        />

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            支持所有主流M3U8直播和点播源
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
