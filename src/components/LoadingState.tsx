import React from 'react';
interface LoadingStateProps {
  type?: 'card' | 'list' | 'map';
}
export function LoadingState({
  type = 'card'
}: LoadingStateProps) {
  if (type === 'card') {
    return <div className="glass rounded-2xl p-6 border border-slate-700 dark:border-slate-600 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-slate-700 dark:bg-slate-600 rounded w-1/3"></div>
            <div className="h-8 bg-slate-700 dark:bg-slate-600 rounded w-1/2"></div>
            <div className="h-3 bg-slate-700 dark:bg-slate-600 rounded w-2/3"></div>
          </div>
          <div className="w-14 h-14 bg-slate-700 dark:bg-slate-600 rounded-xl"></div>
        </div>
      </div>;
  }
  if (type === 'list') {
    return <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="glass rounded-xl p-4 border border-slate-700 dark:border-slate-600 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 dark:bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 dark:bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>)}
      </div>;
  }
  return <div className="w-full h-full bg-slate-800 dark:bg-slate-700 animate-pulse rounded-2xl"></div>;
}