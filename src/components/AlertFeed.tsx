import React, { useState } from 'react';
import { Alert } from '../types';
import { AlertTriangleIcon, FlameIcon, CloudIcon, ThermometerIcon, CheckCircleIcon, ClockIcon, ChevronDownIcon, ChevronRightIcon, MapPinIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface AlertFeedProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}
export function AlertFeed({
  alerts,
  onAcknowledge
}: AlertFeedProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'fire':
        return FlameIcon;
      case 'smoke':
        return CloudIcon;
      case 'heat':
        return ThermometerIcon;
      default:
        return AlertTriangleIcon;
    }
  };
  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 shadow-red-500/50';
      case 'high':
        return 'bg-orange-500 shadow-orange-500/50';
      case 'medium':
        return 'bg-yellow-500 shadow-yellow-500/50';
      case 'low':
        return 'bg-cyan-500 shadow-cyan-500/50';
    }
  };
  const getSeverityBorder = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500/50';
      case 'high':
        return 'border-orange-500/50';
      case 'medium':
        return 'border-yellow-500/50';
      case 'low':
        return 'border-cyan-500/50';
    }
  };
  // Group alerts by date
  const groupedAlerts = alerts.reduce((groups, alert) => {
    const date = new Date(alert.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    let key = date.toLocaleDateString();
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(alert);
    return groups;
  }, {} as Record<string, Alert[]>);
  if (alerts.length === 0) {
    return <div className="text-center py-16 px-6">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/50">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">All Clear</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          No active alerts. All systems are operating normally.
        </p>
      </div>;
  }
  return <div className="relative pl-4 sm:pl-6">
      {/* Continuous Timeline Line */}
      <div className="absolute left-[23px] sm:left-[31px] top-4 bottom-0 w-0.5 bg-slate-800"></div>

      {Object.entries(groupedAlerts).map(([date, dateAlerts]) => <div key={date} className="mb-8 relative">
          {/* Sticky Date Header */}
          <div className="sticky top-0 z-10 py-2 mb-4 bg-slate-950/90 backdrop-blur-md -ml-4 sm:-ml-6 pl-4 sm:pl-6 border-b border-slate-800/50">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
              {date}
            </span>
          </div>

          <div className="space-y-4">
            {dateAlerts.map(alert => {
          const Icon = getAlertIcon(alert.type);
          const isExpanded = expandedIds.has(alert.id);
          const severityColor = getSeverityColor(alert.severity);
          return <div key={alert.id} className="relative pl-8 sm:pl-10">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[3px] sm:left-[11px] top-4 w-3 h-3 rounded-full ${severityColor} shadow-lg z-10 ring-4 ring-slate-950`}></div>

                  {/* Card */}
                  <div onClick={() => toggleExpand(alert.id)} className={`glass rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded ? `bg-slate-800/40 ${getSeverityBorder(alert.severity)}` : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'}`}>
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        {/* Header Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm sm:text-base font-bold text-white truncate pr-2">
                              {alert.message}
                            </h4>
                            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                              <ClockIcon className="w-3 h-3" />
                              <span>
                                {alert.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                              </span>
                            </div>
                            {!isExpanded && <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${alert.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : alert.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : alert.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                                {alert.severity}
                              </span>}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && <motion.div initial={{
                    height: 0,
                    opacity: 0
                  }} animate={{
                    height: 'auto',
                    opacity: 1
                  }} exit={{
                    height: 0,
                    opacity: 0
                  }} transition={{
                    duration: 0.2
                  }} className="overflow-hidden">
                            <div className="pt-4 mt-2 border-t border-slate-700/50 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                                    <MapPinIcon className="w-3 h-3" />
                                    <span>Device ID</span>
                                  </div>
                                  <p className="text-sm font-mono text-cyan-400">
                                    {alert.deviceId}
                                  </p>
                                </div>
                                <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                                    <AlertTriangleIcon className="w-3 h-3" />
                                    <span>Severity</span>
                                  </div>
                                  <p className={`text-sm font-bold capitalize ${alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'high' ? 'text-orange-400' : alert.severity === 'medium' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                    {alert.severity}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-800">
                                <p className="text-xs text-slate-400 mb-1">
                                  Full Message
                                </p>
                                <p className="text-sm text-slate-200 leading-relaxed">
                                  {alert.message}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${alert.acknowledged ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                                  <span className="text-xs text-slate-400">
                                    {alert.acknowledged ? 'Acknowledged' : 'Action Required'}
                                  </span>
                                </div>

                                {!alert.acknowledged ? <button onClick={e => {
                          e.stopPropagation();
                          onAcknowledge(alert.id);
                        }} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                                    <CheckCircleIcon className="w-3.5 h-3.5" />
                                    Acknowledge
                                  </button> : <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                                    <span className="text-xs font-bold text-green-400">
                                      Done
                                    </span>
                                  </div>}
                              </div>
                            </div>
                          </motion.div>}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>;
        })}
          </div>
        </div>)}
    </div>;
}