import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import NeumorphicInput from '../components/NeumorphicInput';
import NeumorphicButton from '../components/NeumorphicButton';
import HistoryList, { saveToHistory } from '../components/HistoryList';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handlePlay = () => {
    if (url.trim()) {
      saveToHistory(url.trim());
      navigate(`/player?url=${encodeURIComponent(url.trim())}`);
    }
  };

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    saveToHistory(selectedUrl);
    navigate(`/player?url=${encodeURIComponent(selectedUrl)}`);
  };

  return (
    <div className="min-h-screen bg-[#e8ecf1] p-6 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-3xl font-bold text-gray-700 tracking-wider">
            M3U8 播放器
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            输入链接开始播放
          </p>
        </div>

        {/* 输入区域 */}
        <div className="space-y-6">
          <NeumorphicInput
            placeholder="请输入 M3U8 播放链接"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
          />
          
          <NeumorphicButton
            variant="primary"
            size="lg"
            onClick={handlePlay}
            className="w-full"
          >
            <div className="flex items-center justify-center gap-2">
              <Play size={20} fill="currentColor" />
              <span className="font-semibold">开始播放</span>
            </div>
          </NeumorphicButton>
        </div>

        {/* 历史记录 */}
        <div className="mt-12">
          <HistoryList onSelect={handleHistorySelect} />
        </div>
      </div>
    </div>
  );
}
