import { useState, useEffect } from 'react';

interface HistoryItem {
  url: string;
  timestamp: number;
}

const STORAGE_KEY = 'm3u8-player-history';
const MAX_HISTORY_ITEMS = 10;

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addToHistory = (url: string) => {
    const newHistory = [
      { url, timestamp: Date.now() },
      ...history.filter(item => item.url !== url),
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const removeFromHistory = (url: string) => {
    const newHistory = history.filter(item => item.url !== url);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
