import React from 'react';
import { Clock, Trash2, Play } from 'lucide-react';
import { NeumorphicCard } from './NeumorphicCard';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
  theme?: 'light' | 'dark';
}

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
};

const getVideoName = (videoUrl: string) => {
  const filename = videoUrl.split('/').pop()?.split('?')[0];
  return filename?.replace(/\.[^/.]+$/, '') || videoUrl;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onRemove,
  theme = 'light',
}) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 px-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        <Clock size={16} />
        <h3 className="font-medium text-sm">播放历史 ({history.length})</h3>
      </div>
      
      <div className="space-y-2 max-h-[240px] overflow-y-auto">
        {history.map((item, idx) => (
          <NeumorphicCard 
            key={idx} 
            className="cursor-pointer hover:scale-[1.02] transition-transform"
            theme={theme}
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex-1 min-w-0 mr-2"
                onClick={() => onSelect(item.url)}
              >
                <p className={`text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                  {getVideoName(item.url)}
                </p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Play size={12} />
                  {formatTimeAgo(item.timestamp)}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.url)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-red-50 text-red-400'
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
};
