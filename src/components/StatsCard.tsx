import React from 'react';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  color: 'red' | 'green' | 'blue' | 'yellow';
}
export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color
}: StatsCardProps) {
  const colorClasses = {
    red: {
      bg: 'from-red-500/10 via-red-600/5 to-transparent',
      border: 'border-red-500/20 hover:border-red-500/40',
      iconBg: 'from-red-500 to-red-600',
      iconGlow: 'shadow-red-500/50',
      text: 'text-red-400',
      accent: 'bg-red-500/10'
    },
    green: {
      bg: 'from-green-500/10 via-green-600/5 to-transparent',
      border: 'border-green-500/20 hover:border-green-500/40',
      iconBg: 'from-green-500 to-green-600',
      iconGlow: 'shadow-green-500/50',
      text: 'text-green-400',
      accent: 'bg-green-500/10'
    },
    blue: {
      bg: 'from-cyan-500/10 via-cyan-600/5 to-transparent',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'from-cyan-500 to-cyan-600',
      iconGlow: 'shadow-cyan-500/50',
      text: 'text-cyan-400',
      accent: 'bg-cyan-500/10'
    },
    yellow: {
      bg: 'from-yellow-500/10 via-yellow-600/5 to-transparent',
      border: 'border-yellow-500/20 hover:border-yellow-500/40',
      iconBg: 'from-yellow-500 to-yellow-600',
      iconGlow: 'shadow-yellow-500/50',
      text: 'text-yellow-400',
      accent: 'bg-yellow-500/10'
    }
  };
  const colors = colorClasses[color];
  return <div className={`group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gradient-to-br ${colors.bg} border ${colors.border} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {/* Accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${colors.accent} opacity-60`}></div>
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {value}
              </p>
              {trend && <span className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full ${trend.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {trend.value}
                </span>}
            </div>
          </div>
          {/* Icon with enhanced styling */}
          <div className="relative">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${colors.iconBg} flex items-center justify-center shadow-lg ${colors.iconGlow} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            {/* Pulsing ring */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colors.iconBg} opacity-20 blur-md animate-pulse`}></div>
          </div>
        </div>
        {/* Bottom accent bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <div className={`w-2 h-2 rounded-full ${colors.accent} animate-pulse`}></div>
          <span className="text-xs text-slate-500 font-medium">Live Data</span>
        </div>
      </div>
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </div>;
}