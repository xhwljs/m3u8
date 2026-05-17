import React, { useEffect, useState } from 'react';
import { History, Trash2 } from 'lucide-react';
import NeumorphicCard from './NeumorphicCard';
import NeumorphicButton from './NeumorphicButton';

const HISTORY_KEY = 'm3u8-history';
const MAX_HISTORY = 10;

interface HistoryItem {
  url: string;
  timestamp: number;
}

interface HistoryListProps {
  onSelect: (url: string) => void;
}

// 保存历史记录的函数（供其他组件调用）
export const saveToHistory = (url: string) => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = stored ? JSON.parse(stored) : [];
    
    // 移除已存在的相同URL
    history = history.filter(item => item.url !== url);
    
    // 添加新记录到开头
    history.unshift({
      url,
      timestamp: Date.now(),
    });
    
    // 限制数量
    if (history.length > MAX_HISTORY) {
      history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
};

export default function HistoryList({ onSelect }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 从 localStorage 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const clearHistory = () => {
    if (confirm('确定要清空所有播放历史吗？')) {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    }
  };

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // 1小时内
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / (60 * 1000));
      return mins <= 1 ? '刚刚' : `${mins}分钟前`;
    }
    
    // 1天内
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }
    
    // 其他显示日期
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <History size={20} />
          <span>播放历史</span>
        </div>
        <NeumorphicButton
          variant="circle"
          size="sm"
          onClick={clearHistory}
          className="text-gray-500 hover:text-red-500"
        >
          <Trash2 size={16} />
        </NeumorphicButton>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <NeumorphicCard
            key={`${item.url}-${item.timestamp}`}
            onClick={() => onSelect(item.url)}
            className="p-4"
          >
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-sm truncate font-medium">
                {item.url}
              </p>
              <p className="text-gray-400 text-xs">
                {formatDate(item.timestamp)}
              </p>
            </div>
          </NeumorphicCard>
        ))}
      </div>
    </div>
  );
}
