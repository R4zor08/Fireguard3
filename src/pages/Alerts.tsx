import React, { useState } from 'react';
import { AlertFeed } from '../components/AlertFeed';
import { useAlerts } from '../hooks/useAlerts';
import { MobileBottomSheet } from '../components/MobileBottomSheet';
import { BellIcon, FilterIcon, XIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';
type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'acknowledged' | 'unacknowledged';
export function Alerts() {
  const {
    alerts,
    acknowledgeAlert
  } = useAlerts();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'acknowledged') return alert.acknowledged;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.severity === filter;
  });
  const FilterChip = ({
    type,
    label
  }: {
    type: FilterType;
    label: string;
  }) => <button onClick={() => {
    setFilter(type);
    setIsFilterOpen(false);
  }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === type ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25' : 'glass border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {label}
    </button>;
  return <div className="min-h-screen pb-24 relative">
      <div className="p-4 sm:p-6">
        <div className="mb-6 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Alert <span className="text-gradient-red">Timeline</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Monitor fire detection events in real-time
          </p>
        </div>

        {/* Compact Alert Stats for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-6">
          <div className="glass rounded-xl p-4 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <BellIcon className="w-12 h-12" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {alerts.length}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Total Alerts
            </p>
          </div>

          <div className="glass rounded-xl p-4 border border-red-500/30 bg-red-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10 text-red-500">
              <AlertTriangleIcon className="w-12 h-12" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
              {unacknowledged}
            </p>
            <p className="text-xs sm:text-sm text-red-300/70 font-medium">
              Action Needed
            </p>
          </div>

          <div className="glass rounded-xl p-4 border border-green-500/30 bg-green-500/5 relative overflow-hidden col-span-2 sm:col-span-1">
            <div className="absolute top-0 right-0 p-2 opacity-10 text-green-500">
              <CheckCircleIcon className="w-12 h-12" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-400 mb-1">
              {alerts.length - unacknowledged}
            </p>
            <p className="text-xs sm:text-sm text-green-300/70 font-medium">
              Resolved
            </p>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {filter !== 'all' && <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <span className="text-xs text-slate-400">Filtered by:</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-xs font-bold text-cyan-400 capitalize">
                {filter}
              </span>
              <button onClick={() => setFilter('all')} className="p-0.5 hover:bg-cyan-500/20 rounded-full text-cyan-400">
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          </div>}

        {/* Timeline Feed */}
        <div className="animate-slide-up delay-100">
          <AlertFeed alerts={filteredAlerts} onAcknowledge={acknowledgeAlert} />
        </div>
      </div>

      {/* Floating Filter Button */}
      <button onClick={() => setIsFilterOpen(true)} className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
        <FilterIcon className="w-6 h-6" />
      </button>

      {/* Filter Bottom Sheet */}
      {isFilterOpen && <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Filter Alerts</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip type="all" label="All Alerts" />
                  <FilterChip type="unacknowledged" label="Unacknowledged" />
                  <FilterChip type="acknowledged" label="Acknowledged" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Severity
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip type="critical" label="Critical" />
                  <FilterChip type="high" label="High" />
                  <FilterChip type="medium" label="Medium" />
                  <FilterChip type="low" label="Low" />
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
}