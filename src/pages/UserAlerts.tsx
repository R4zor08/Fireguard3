
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangleIcon, FlameIcon, CheckCircleIcon, DownloadIcon, FilterIcon, SearchIcon, CalendarIcon, RefreshCwIcon } from 'lucide-react';
import { AlertHistoryTable, Alert } from '../components/AlertHistoryTable';
import { StatsCard } from '../components/StatsCard';
import { LoadingState } from '../components/LoadingState';
import { useAlerts } from '../hooks/useAlerts';
import { useAuth } from '../hooks/useAuth';
import { useDevicesRealTime } from '../hooks/useDevicesRealTime';

export function UserAlerts() {
  const { user } = useAuth();
  const { devices } = useDevicesRealTime();
  const { alerts: realAlerts, loading, fetchAlerts, stats: alertStats } = useAlerts();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const myDeviceIds = useMemo(() => {
    if (!user?.name) return [] as string[];
    return devices.filter(d => d.ownerName === user.name).map(d => d.id);
  }, [devices, user?.name]);

  useEffect(() => {
    if (myDeviceIds.length === 1) {
      fetchAlerts(1, 50, { deviceId: myDeviceIds[0] });
    } else {
      fetchAlerts(1, 50);
    }
  }, [fetchAlerts, myDeviceIds]);

  const scopedAlerts = useMemo(() => {
    if (myDeviceIds.length === 0) return realAlerts;
    return realAlerts.filter(a => myDeviceIds.includes(a.deviceId));
  }, [myDeviceIds, realAlerts]);

  // Convert real alerts to Alert format for display
  const alerts: Alert[] = useMemo(() => {
    if (scopedAlerts.length === 0) {
      return [{
        id: 1,
        type: 'info',
        message: 'No alerts yet - System monitoring active',
        timestamp: 'Just now',
        status: 'resolved',
        details: 'Your fire monitoring system is online and monitoring for potential hazards.'
      }];
    }
    
    return scopedAlerts.map((alert, index) => ({
      id: parseInt(alert.id.replace(/-/g, '').slice(0, 8), 16) || index,
      type: alert.status === 'ALERT' ? 'critical' : alert.status === 'WARNING' ? 'warning' : 'info',
      message: alert.notes || `Alert from ${alert.deviceId}`,
      timestamp: new Date(alert.timestamp).toLocaleString(),
      status: alert.status === 'ALERT' ? 'investigating' : 'resolved',
      details: `Temperature: ${alert.temperature}°C, Smoke: ${alert.smokeLevel}%, Location: ${alert.location || 'Unknown'}`
    }));
  }, [scopedAlerts]);

  const filteredAlerts = alerts.filter(alert => 
    alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
    alert.details?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: alertStats.total || alerts.length,
    critical: alertStats.alert || alerts.filter(a => a.type === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    active: alerts.filter(a => a.status !== 'resolved').length
  };

  if (loading) return <LoadingState />;
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8 pb-20 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert History</h1>
          <p className="text-slate-400">
            View and manage all system notifications and incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
          if (myDeviceIds.length === 1) {
            fetchAlerts(1, 50, { deviceId: myDeviceIds[0] });
          } else {
            fetchAlerts(1, 50);
          }
        }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all">
            <RefreshCwIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all">
            <DownloadIcon className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{
      animationDelay: '0.1s'
    }}>
        <StatsCard title="Total Alerts" value={stats.total} icon={AlertTriangleIcon} color="blue" />
        <StatsCard title="Critical Incidents" value={stats.critical} icon={FlameIcon} color="red" />
        <StatsCard title="Active Issues" value={stats.active} icon={AlertTriangleIcon} color="yellow" />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircleIcon} color="green" />
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{
      animationDelay: '0.2s'
    }}>
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="animate-slide-up" style={{
      animationDelay: '0.3s'
    }}>
        <AlertHistoryTable alerts={filteredAlerts} />
      </div>
    </div>;
}