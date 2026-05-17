import React from 'react';
import { NeumorphicCard } from './neumorphic';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onRemove }) => {
  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-full animate-fade-in">
      <h3 className="text-gray-600 text-sm font-semibold mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        最近播放
      </h3>
      <div className="flex flex-col gap-2">
        {history.map((item, index) => (
          <NeumorphicCard
            key={`${item.url}-${index}`}
            variant="raised"
            padding="small"
            className="cursor-pointer group"
          >
            <div
              className="flex items-center justify-between gap-2"
              onClick={() => onSelect(item.url)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-gray-700 text-sm truncate font-mono">
                  {truncateUrl(item.url)}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {formatDate(item.timestamp)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.url);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded-full"
                aria-label="删除"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
