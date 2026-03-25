import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
export function ThemeToggle() {
  const {
    theme,
    toggleTheme
  } = useTheme();
  return <button onClick={toggleTheme} className="relative w-14 h-7 rounded-full bg-slate-700 dark:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900" aria-label="Toggle theme">
      <div className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}>
        {theme === 'dark' ? <MoonIcon className="w-4 h-4 text-cyan-400 animate-spin-slow" /> : <SunIcon className="w-4 h-4 text-yellow-500 animate-pulse" />}
      </div>
    </button>;
}