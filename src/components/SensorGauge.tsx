import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
interface SensorGaugeProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  thresholds: {
    warning: number;
    critical: number;
  };
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ElementType;
}
export function SensorGauge({
  label,
  value,
  unit,
  max,
  thresholds,
  trend = 'stable',
  trendValue,
  icon: Icon
}: SensorGaugeProps) {
  // Calculate percentage for gauge
  const percentage = Math.min(Math.max(value / max * 100, 0), 100);
  // Determine color based on value and thresholds - improved contrast
  const getColor = () => {
    if (value >= thresholds.critical) return '#ef4444'; // red-500
    if (value >= thresholds.warning) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };
  const color = getColor();
  // Get status text with better contrast
  const getStatusInfo = () => {
    if (value >= thresholds.critical) {
      return {
        text: 'Critical Level',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30'
      };
    }
    if (value >= thresholds.warning) {
      return {
        text: 'Warning Level',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30'
      };
    }
    return {
      text: 'Normal Status',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    };
  };
  const statusInfo = getStatusInfo();
  // Gauge geometry
  const radius = 80;
  const strokeWidth = 12;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage / 100 * (circumference / 2);
  return <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-500/30 rounded-3xl p-6 flex flex-col items-center justify-between group transition-all duration-500 shadow-2xl" role="region" aria-label={`${label} sensor reading: ${value} ${unit}`}>
      {/* Icon with improved contrast */}
      <div className="absolute top-4 left-4 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
        <Icon className="w-5 h-5 text-slate-100 group-hover:text-white transition-colors" />
      </div>

      <div className="relative mt-4">
        {/* Gauge SVG */}
        <svg width={center * 2} height={center + strokeWidth} className="transform overflow-visible" aria-hidden="true">
          {/* Background Track - improved contrast */}
          <path d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${center * 2 - strokeWidth} ${center}`} fill="none" stroke="#334155" // slate-700 - better contrast
        strokeWidth={strokeWidth} strokeLinecap="round" />

          {/* Value Arc */}
          <motion.path d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${center * 2 - strokeWidth} ${center}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference / 2} strokeDashoffset={circumference / 2} animate={{
          strokeDashoffset: offset
        }} transition={{
          duration: 1.5,
          ease: 'easeOut'
        }} style={{
          filter: `drop-shadow(0 0 6px ${color}60)`
        }} />
        </svg>

        {/* Center Value - improved contrast */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.5
        }} className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-white tracking-tight" style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
              {value}
            </span>
            <span className="text-base text-slate-300 font-semibold">
              {unit}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Label and Trend - improved contrast */}
      <div className="w-full mt-6 flex items-center justify-between px-2">
        <span className="text-sm font-semibold text-slate-100">{label}</span>

        {trend && <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${trend === 'up' ? 'bg-red-500/10 text-red-400 border-red-500/30' : trend === 'down' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
            {trend === 'up' && <ArrowUpIcon className="w-3.5 h-3.5" />}
            {trend === 'down' && <ArrowDownIcon className="w-3.5 h-3.5" />}
            {trend === 'stable' && <MinusIcon className="w-3.5 h-3.5" />}
            <span>{trendValue || (trend === 'stable' ? 'Stable' : '')}</span>
          </div>}
      </div>

      {/* Status Badge - improved contrast and accessibility */}
      <div className={`mt-3 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
        {statusInfo.text}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
    </div>;
}