import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { TrendingUpIcon, AlertTriangleIcon, MapPinIcon, ActivityIcon, ArrowLeftIcon, ChevronRightIcon, ClockIcon, AlertCircleIcon, DownloadIcon, RefreshCwIcon, FlameIcon, WindIcon, ThermometerIcon, DropletsIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRiskAreas, TANDAG_CENTER } from '../utils/mockData';
import { useDevices } from '../hooks/useDevices';
import 'leaflet/dist/leaflet.css';
interface IncidentReport {
  id: string;
  title: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  deviceId: string;
  description: string;
  status: 'active' | 'responding' | 'contained' | 'resolved';
  type: 'fire' | 'smoke' | 'heat' | 'gas';
}
const mockIncidentReports: IncidentReport[] = [{
  id: 'INC001',
  title: 'Fire Detected - DEV003',
  timestamp: new Date(),
  severity: 'critical',
  location: '789 Quezon Blvd',
  deviceId: 'DEV003',
  description: 'Critical fire alert detected. Smoke levels exceeded 80%. Temperature reached 65°C. Immediate response required.',
  status: 'active',
  type: 'fire'
}, {
  id: 'INC002',
  title: 'High Temperature Warning',
  timestamp: new Date(Date.now() - 300000),
  severity: 'high',
  location: '456 Rizal Street',
  deviceId: 'DEV002',
  description: 'Elevated temperature levels detected. Temperature: 45°C. Monitoring situation closely.',
  status: 'responding',
  type: 'heat'
}, {
  id: 'INC003',
  title: 'Smoke Detection - DEV005',
  timestamp: new Date(Date.now() - 3600000),
  severity: 'medium',
  location: '321 Luna Avenue',
  deviceId: 'DEV005',
  description: 'Moderate smoke levels detected. Possible cooking activity. No immediate danger.',
  status: 'resolved',
  type: 'smoke'
}, {
  id: 'INC004',
  title: 'Gas Leak Detected',
  timestamp: new Date(Date.now() - 7200000),
  severity: 'high',
  location: 'Barangay Hall Complex',
  deviceId: 'DEV008',
  description: 'Abnormal gas levels detected near storage area.',
  status: 'contained',
  type: 'gas'
}];
const mockTrendData = [{
  day: 'Mon',
  incidents: 4
}, {
  day: 'Tue',
  incidents: 3
}, {
  day: 'Wed',
  incidents: 7
}, {
  day: 'Thu',
  incidents: 2
}, {
  day: 'Fri',
  incidents: 5
}, {
  day: 'Sat',
  incidents: 8
}, {
  day: 'Sun',
  incidents: 6
}];
export function Analytics() {
  const {
    devices
  } = useDevices();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const fromNotification = location.state?.fromNotification;
  const notificationId = location.state?.notificationId;
  const incidentTitle = location.state?.incidentTitle;
  const savedScrollPosition = location.state?.scrollPosition;
  // Auto-expand incident if coming from notification
  useEffect(() => {
    if (fromNotification && notificationId) {
      const matchingIncident = mockIncidentReports.find(report => report.title === incidentTitle);
      if (matchingIncident) {
        setExpandedIncident(matchingIncident.id);
        setTimeout(() => {
          const element = document.getElementById(`incident-${matchingIncident.id}`);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }, 300);
      }
    }
  }, [fromNotification, notificationId, incidentTitle]);
  const handleBackToNotifications = () => {
    navigate('/app/notifications', {
      state: {
        scrollPosition: savedScrollPosition
      }
    });
  };
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
    setTimeout(() => setIsRefreshing(false), 1500);
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            ACTIVE
          </span>;
      case 'responding':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            RESPONDING
          </span>;
      case 'contained':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            CONTAINED
          </span>;
      case 'resolved':
        return <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            RESOLVED
          </span>;
      default:
        return null;
    }
  };
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <FlameIcon className="w-5 h-5 text-red-400" />;
      case 'smoke':
        return <WindIcon className="w-5 h-5 text-slate-400" />;
      case 'heat':
        return <ThermometerIcon className="w-5 h-5 text-orange-400" />;
      case 'gas':
        return <DropletsIcon className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangleIcon className="w-5 h-5 text-slate-400" />;
    }
  };
  const highRiskDevices = devices.filter(d => d.lastReading.smoke > 30 || d.lastReading.temperature > 35 || d.lastReading.gas > 25);
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-20 lg:pb-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Pull to refresh indicator */}
      <div className="fixed top-20 left-0 right-0 flex justify-center z-50 pointer-events-none transition-transform duration-200" style={{
      transform: `translateY(${pullDistance * 0.5}px)`,
      opacity: pullDistance > 0 ? 1 : 0
    }}>
        <div className="bg-slate-800 rounded-full p-2 shadow-lg border border-slate-700">
          <RefreshCwIcon className={`w-6 h-6 text-cyan-400 ${pullDistance > 80 ? 'animate-spin' : ''}`} />
        </div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <div>
            {fromNotification && <button onClick={handleBackToNotifications} className="flex items-center gap-1 text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-2 group">
                <ArrowLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Notifications
              </button>}
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              Incident <span className="text-gradient-cyan">Analytics</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time incident monitoring & reports
            </p>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          <div className="glass rounded-xl p-3 sm:p-4 border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/20">
                <AlertTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {mockIncidentReports.length}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">
                Total Incidents
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-4 border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2 shadow-lg shadow-green-500/20">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                4.2
                <span className="text-sm sm:text-lg font-normal ml-1">m</span>
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">
                Avg Response
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-4 border border-slate-700 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-2 shadow-lg shadow-red-500/20">
                <AlertCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {mockIncidentReports.filter(i => i.severity === 'critical').length}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-wide">
                Critical Alerts
              </p>
            </div>
          </div>
        </div>

        {/* Trend Chart Section */}
        <div className="glass rounded-xl border border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              Incident Trend
            </h2>
            <select className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-cyan-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-48 sm:h-64 w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }} />
                  <Area type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Incidents List */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 px-1">
            Recent Incidents
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {mockIncidentReports.map(incident => {
            const isExpanded = expandedIncident === incident.id;
            return <motion.div key={incident.id} id={`incident-${incident.id}`} layout initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} className={`glass rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-cyan-500/50 bg-slate-800/50' : 'border-slate-700 hover:border-slate-600'}`}>
                  <div onClick={() => setExpandedIncident(isExpanded ? null : incident.id)} className="p-3 sm:p-4 cursor-pointer">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br shadow-lg ${incident.severity === 'critical' ? 'from-red-500 to-red-600 shadow-red-500/20' : incident.severity === 'high' ? 'from-orange-500 to-orange-600 shadow-orange-500/20' : incident.severity === 'medium' ? 'from-yellow-500 to-yellow-600 shadow-yellow-500/20' : 'from-green-500 to-green-600 shadow-green-500/20'}`}>
                        {getIncidentIcon(incident.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-white truncate pr-2">
                            {incident.title}
                          </h3>
                          {getStatusBadge(incident.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-slate-400">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate">{incident.location}</span>
                          <span className="text-slate-600">•</span>
                          <span>2h ago</span>
                        </div>
                      </div>
                      <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

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
                  duration: 0.3
                }} className="border-t border-slate-700/50 bg-slate-900/30">
                        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 border border-slate-700/50">
                              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mb-1">
                                Device ID
                              </p>
                              <p className="text-xs sm:text-sm font-mono text-cyan-400 font-semibold">
                                {incident.deviceId}
                              </p>
                            </div>
                            <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 border border-slate-700/50">
                              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mb-1">
                                Timestamp
                              </p>
                              <p className="text-xs sm:text-sm text-white font-medium">
                                {incident.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide mb-1">
                              Description
                            </p>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                              {incident.description}
                            </p>
                          </div>
                          <div className="flex gap-2 sm:gap-3 pt-2">
                            <button className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20">
                              View Details
                            </button>
                            <button className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors border border-slate-600">
                              Mark Resolved
                            </button>
                          </div>
                        </div>
                      </motion.div>}
                  </AnimatePresence>
                </motion.div>;
          })}
          </div>
        </div>

        {/* Risk Summary Cards (Existing) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-800">
          <h2 className="col-span-full text-base sm:text-lg font-bold text-white mb-2">
            Risk Analysis
          </h2>
          <div className="glass rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-red-500/50 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center glow-red">
                <AlertTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {highRiskDevices.length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  High Risk Devices
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-yellow-500/50 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center glow-yellow">
                <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {mockRiskAreas.length}
                </p>
                <p className="text-xs sm:text-sm text-slate-400">Risk Zones</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center glow-cyan">
                <TrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">12</p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Incidents This Week
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-green-500/50 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center glow-green">
                <ActivityIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  98.5%
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  System Uptime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse glow-red"></div>
              Fire Risk Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Areas with elevated fire risk based on historical data
            </p>
          </div>
          <div className="h-[300px] sm:h-[500px]">
            <MapContainer center={[TANDAG_CENTER.lat, TANDAG_CENTER.lng]} zoom={14} style={{
            height: '100%',
            width: '100%'
          }} dragging={!L.Browser.mobile} tap={!L.Browser.mobile}>
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; <a href="https://www.esri.com/">Esri</a>' />
              {mockRiskAreas.map((area, index) => <Circle key={index} center={[area.latitude, area.longitude]} radius={area.radius} pathOptions={{
              color: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
              fillColor: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
              fillOpacity: 0.3,
              weight: 3
            }} />)}
            </MapContainer>
          </div>
        </div>

        {/* Risk Areas Table - Scrollable on mobile */}
        <div className="glass rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-700 bg-slate-900/50">
            <h2 className="text-base sm:text-lg font-bold text-white">
              High Risk Areas
            </h2>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[600px]">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Incidents
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Radius
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {mockRiskAreas.map((area, index) => <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-300 font-mono">
                      {area.latitude.toFixed(4)}, {area.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-800 rounded-full h-2 max-w-[100px] sm:max-w-[120px]">
                          <div className={`h-2 rounded-full ${area.riskScore > 70 ? 'bg-gradient-to-r from-red-600 to-red-500 glow-red' : area.riskScore > 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 glow-yellow' : 'bg-gradient-to-r from-green-600 to-green-500 glow-green'}`} style={{
                        width: `${area.riskScore}%`
                      }}></div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {area.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-300 font-semibold">
                      {area.incidents}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-slate-300">
                      {area.radius}m
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full ${area.riskScore > 70 ? 'bg-red-950/50 text-red-400 border border-red-800 glow-red' : area.riskScore > 50 ? 'bg-yellow-950/50 text-yellow-400 border border-yellow-800 glow-yellow' : 'bg-green-950/50 text-green-400 border border-green-800 glow-green'}`}>
                        {area.riskScore > 70 ? 'Critical' : area.riskScore > 50 ? 'Elevated' : 'Normal'}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}