import React, { useMemo, useState } from 'react';
import { NetworkIcon, ServerIcon, WifiIcon, BluetoothIcon, ActivityIcon, CheckCircleIcon, AlertTriangleIcon, XCircleIcon, ClockIcon, RefreshCwIcon, SmartphoneIcon, HistoryIcon, LayoutGridIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNetworkConnectivity } from '../hooks/useNetworkConnectivity';
// --- Components ---
const SignalStrengthIndicator = ({
  strength
}: {
  strength: number;
}) => {
  return <div className="flex items-end gap-0.5 h-4 w-6" title={`Signal: ${strength}%`}>
      <div className={`w-1 rounded-sm ${strength > 20 ? 'bg-current' : 'bg-slate-700'} h-[20%]`}></div>
      <div className={`w-1 rounded-sm ${strength > 40 ? 'bg-current' : 'bg-slate-700'} h-[40%]`}></div>
      <div className={`w-1 rounded-sm ${strength > 60 ? 'bg-current' : 'bg-slate-700'} h-[60%]`}></div>
      <div className={`w-1 rounded-sm ${strength > 80 ? 'bg-current' : 'bg-slate-700'} h-[80%]`}></div>
    </div>;
};
const TabButton = ({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => <button onClick={onClick} className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 relative transition-colors ${active ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'}`}>
    {icon}
    <span className="text-xs sm:text-sm font-medium">{label}</span>
    {active && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />}
  </button>;
export function NetworkConnectivity() {
  const { nodes, events, fetchNetwork } = useNetworkConnectivity();
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'history'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  // Pull to refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setTouchStart(e.targetTouches[0].clientY);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart > 0 && window.scrollY === 0) {
      const touchY = e.targetTouches[0].clientY;
      const pull = Math.max(0, touchY - touchStart);
      if (pull < 150) {
        setPullDistance(pull);
      }
    }
  };
  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      handleRefresh();
    }
    setPullDistance(0);
    setTouchStart(0);
  };
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNetwork().finally(() => {
      setTimeout(() => setIsRefreshing(false), 300);
    });
  };

  const latencyData = useMemo(() => {
    const now = Date.now();
    const series = nodes
      .filter(n => typeof n.latency === 'number')
      .slice(0, 12)
      .map((n, idx) => {
        const t = new Date(now - (11 - idx) * 5 * 60 * 1000);
        return {
          time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latency: n.latency,
        };
      });
    return series;
  }, [nodes]);

  const historyEvents = useMemo(() => {
    const nodeNameById = new Map(nodes.map(n => [n.id, n.name] as const));
    return events.slice(0, 50).map(e => {
      const d = new Date(e.timestamp);
      return {
        id: e.id,
        timestamp: d.toLocaleString([], { hour: '2-digit', minute: '2-digit' }),
        type: e.type as any,
        deviceId: e.nodeId,
        deviceName: nodeNameById.get(e.nodeId) || e.nodeId,
        details: e.details,
        status: e.status as any,
      };
    });
  }, [events, nodes]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'offline':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'degraded':
        return <AlertTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'offline':
        return <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'iot':
        return <WifiIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 'cluster':
        return <NetworkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 'server':
        return <ServerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 'bfp':
        return <ActivityIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      default:
        return <NetworkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
    }
  };
  const onlineNodes = nodes.filter(n => n.status === 'online').length;
  const avgLatency = nodes.reduce((acc, n) => acc + (n.latency || 0), 0) / nodes.length;
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Pull to refresh indicator */}
      <div className="fixed top-20 left-0 right-0 flex justify-center z-50 pointer-events-none transition-transform duration-200" style={{
      transform: `translateY(${pullDistance * 0.5}px)`,
      opacity: pullDistance > 0 ? 1 : 0
    }}>
        <div className="bg-slate-800 rounded-full p-2 shadow-lg border border-slate-700">
          <RefreshCwIcon className={`w-6 h-6 text-cyan-400 ${pullDistance > 80 ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <div className="relative z-10 pb-20">
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">
                <span className="text-white">Network</span>
                <span className="text-gradient-cyan ml-2 sm:ml-3">
                  Connectivity
                </span>
              </h1>
            </div>
            {isRefreshing && <RefreshCwIcon className="w-5 h-5 text-cyan-400 animate-spin" />}
          </div>
        </div>

        {/* Sticky Tab Bar */}
        <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
          <div className="flex px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutGridIcon className="w-4 h-4 sm:w-5 sm:h-5" />} label="Overview" />
            <TabButton active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} icon={<SmartphoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />} label="Devices" />
            <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5" />} label="History" />
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <motion.div key="overview" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }} transition={{
            duration: 0.3
          }} className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-green-500/50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {onlineNodes}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Nodes Online
                    </p>
                  </div>

                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-cyan-500/50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <ActivityIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {avgLatency.toFixed(0)}
                        <span className="text-sm sm:text-lg font-normal text-slate-400 ml-1">
                          ms
                        </span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Avg Latency
                    </p>
                  </div>

                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <BluetoothIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-lg sm:text-3xl font-bold text-white">
                        Active
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Bluetooth Mesh
                    </p>
                  </div>

                  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <WifiIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-lg sm:text-3xl font-bold text-white">
                        Stable
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                      Wi-Fi Status
                    </p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="glass rounded-2xl border border-slate-700 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        Connection Quality
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Network latency over last hour
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-green-400">
                        Healthy
                      </span>
                    </div>
                  </div>
                  <div className="h-48 sm:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={latencyData}>
                        <defs>
                          <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="ms" />
                        <Tooltip contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#fff'
                    }} />
                        <Area type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>}

            {activeTab === 'devices' && <motion.div key="devices" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} transition={{
            duration: 0.3
          }} className="space-y-4">
                {nodes.map(node => <div key={node.id} className="glass rounded-xl border border-slate-700 p-4 hover:bg-slate-800/50 transition-colors active:scale-[0.99] touch-manipulation">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${node.type === 'iot' ? 'from-cyan-500 to-blue-500' : node.type === 'cluster' ? 'from-purple-500 to-pink-500' : node.type === 'server' ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-white">
                            {node.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">
                              {node.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-2 py-0.5 rounded-full border ${getStatusColor(node.status)} flex items-center gap-1.5`}>
                          {getStatusIcon(node.status)}
                          <span className="text-[10px] sm:text-xs font-bold uppercase">
                            {node.status}
                          </span>
                        </div>
                        {node.status !== 'offline' && <div className="flex items-center gap-1.5 text-slate-400">
                            <SignalStrengthIndicator strength={100} />
                            <span className="text-xs font-medium">
                              {node.latency}ms
                            </span>
                          </div>}
                      </div>
                    </div>
                  </div>)}
              </motion.div>}

            {activeTab === 'history' && <motion.div key="history" initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: 20
          }} transition={{
            duration: 0.3
          }} className="relative pl-4 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {/* Group events by date (simplified for mock) */}
                <div className="relative">
                  <div className="absolute -left-[21px] sm:-left-[37px] top-0 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-slate-400">
                    Today
                  </div>
                  <div className="space-y-6 pt-6">
                    {historyEvents.slice(0, 3).map((event: any) => <div key={event.id} className="relative">
                        <div className={`absolute -left-[22px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 ${event.status === 'success' ? 'bg-green-500' : event.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="glass rounded-xl border border-slate-700 p-4 ml-2 sm:ml-0">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {event.timestamp}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${event.type === 'connect' ? 'bg-green-500/10 text-green-400' : event.type === 'disconnect' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {event.type.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                            {event.deviceName}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400">
                            {event.details}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] sm:-left-[37px] top-0 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-slate-400">
                    Yesterday
                  </div>
                  <div className="space-y-6 pt-6">
                    {historyEvents.slice(3).map((event: any) => <div key={event.id} className="relative">
                        <div className={`absolute -left-[22px] sm:-left-[38px] top-1.5 w-3 h-3 rounded-full border-2 border-slate-900 ${event.status === 'success' ? 'bg-green-500' : event.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="glass rounded-xl border border-slate-700 p-4 ml-2 sm:ml-0">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              {event.timestamp}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${event.type === 'connect' ? 'bg-green-500/10 text-green-400' : event.type === 'disconnect' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {event.type.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                            {event.deviceName}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-400">
                            {event.details}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>;
}