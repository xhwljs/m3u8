import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeumorphicInput, NeumorphicButton, NeumorphicCard } from '@/components/neumorphic';
import HistoryList from '@/components/HistoryList';
import { useHistory } from '@/hooks/useHistory';

const SAMPLE_M3U8 = [
  { name: '测试流1 - Big Buck Bunny', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { name: '测试流2 - Apple HLS Demo', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8' },
  { name: '测试流3 - HLS.js Test', url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8' },
];

const HomePage: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { history, addToHistory, removeFromHistory } = useHistory();

  const isValidUrl = (str: string) => {
    try {
      const parsed = new URL(str);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const handlePlay = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      alert('请输入视频链接');
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      alert('请输入有效的URL（以http://或https://开头）');
      return;
    }

    if (!trimmedUrl.includes('.m3u8')) {
      if (!confirm('该链接看起来不是M3U8格式，是否继续尝试播放？')) {
        return;
      }
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
                placeholder="请输入M3U8播放链接（以http://或https://开头）"
                onKeyPress={handleKeyPress}
              />
              {url && !isValidUrl(url) && (
                <p className="text-red-500 text-xs mt-2">请输入有效的URL</p>
              )}
            </div>

            <NeumorphicButton
              onClick={handlePlay}
              disabled={!url.trim() || !isValidUrl(url)}
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

        {history.length === 0 && (
          <NeumorphicCard variant="raised" padding="medium" className="mb-6">
            <h3 className="text-gray-600 text-sm font-medium mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              快速测试
            </h3>
            <div className="space-y-2">
              {SAMPLE_M3U8.map((sample, index) => (
                <NeumorphicButton
                  key={index}
                  variant="secondary"
                  size="small"
                  fullWidth
                  onClick={() => {
                    setUrl(sample.url);
                    addToHistory(sample.url);
                    navigate(`/player?url=${encodeURIComponent(sample.url)}`);
                  }}
                >
                  {sample.name}
                </NeumorphicButton>
              ))}
            </div>
          </NeumorphicCard>
        )}

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