import React from 'react';
import { NeumorphicCard } from './NeumorphicCard';
import { Play, Trash2, History, Video } from 'lucide-react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onRemove }) => {
  const formatTime = (timestamp: number) => {
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

  const getVideoTitle = (url: string) => {
    try {
      // 尝试从URL中提取文件名作为标题
      const filename = url.split('/').pop()?.split('?')[0];
      return filename?.replace(/\.[^/.]+$/, '') || '视频';
    } catch {
      return '视频';
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History size={16} className="text-gray-600" />
          <h3 className="text-gray-600 font-medium text-sm">历史记录</h3>
        </div>
        <span className="text-gray-400 text-xs">共 {history.length} 条</span>
      </div>
      <div className="space-y-2">
        {history.map((item, index) => (
          <NeumorphicCard key={index} className="p-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onSelect(item.url)}
                className="flex-1 text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c6ff7] to-[#6c63ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                  <Play size={16} className="text-white ml-1" fill="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Video size={12} className="text-[#6c63ff] flex-shrink-0" />
                    <p className="text-gray-700 text-sm font-medium truncate">
                      {getVideoTitle(item.url)}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 truncate">
                    {item.url}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatTime(item.timestamp)}
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.url);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="删除"
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
