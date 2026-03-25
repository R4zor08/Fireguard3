import React, { useEffect, useState } from 'react';
import { ClockIcon, CalendarIcon } from 'lucide-react';
export function TimeOverlay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  return <div className="glass-dark border border-slate-700 rounded-xl p-3 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">
            {formatDate(currentTime)}
          </span>
        </div>
        <div className="w-px h-4 bg-slate-600"></div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white tabular-nums">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-400 font-medium">LIVE</span>
      </div>
    </div>;
}