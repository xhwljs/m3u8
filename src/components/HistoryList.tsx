import React from 'react';
import { NeumorphicCard } from './NeumorphicCard';
import { X } from 'lucide-react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (url: string) => void;
  onRemove: (url: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ 
  history, 
  onSelect, 
  onRemove 
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      <h3 className="text-gray-600 font-medium text-sm mb-2 px-1">历史记录</h3>
      {history.map((item, index) => (
        <NeumorphicCard key={index} onClick={() => onSelect(item.url)} className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-2">
              <p className="text-gray-700 text-sm truncate">{item.url}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(item.timestamp).toLocaleDateString('zh-CN')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.url);
              }}
              className="min-h-[32px] min-w-[32px] flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        </NeumorphicCard>
      ))}
    </div>
  );
};
