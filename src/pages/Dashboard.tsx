import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { HomeIcon, RadioIcon, AlertTriangleIcon, MapPinIcon, ActivityIcon, TrendingUpIcon, ZapIcon } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AlertFeed } from '../components/AlertFeed';
import { DeviceMarker } from '../components/DeviceMarker';
import { DeviceDetailModal } from '../components/DeviceDetailModal';
import { MobileBottomSheet } from '../components/MobileBottomSheet';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { useDevices } from '../hooks/useDevices';
import { useAlerts } from '../hooks/useAlerts';
import { TANDAG_CENTER } from '../utils/mockData';
import { Device } from '../types';
import 'leaflet/dist/leaflet.css';
export function Dashboard() {
  const {
    devices
  } = useDevices();
  const {
    alerts,
    stats,
    acknowledgeAlert
  } = useAlerts();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const activeDevices = devices.filter(d => d.isOnline).length;
  const triggeredDevices = devices.filter(d => d.status === 'triggered').length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  
  // Use real stats from API
  const displayStats = {
    totalHouses: stats.total || 0,
    activeDevices: activeDevices,
    triggeredDevices: stats.alert || 0,
    unacknowledgedAlerts: unacknowledgedAlerts,
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-20 lg:pb-0">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600 to-orange-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Enhanced Header Section */}
        <div className="animate-slide-up px-2 sm:px-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold">
              <span className="text-white">Command</span>
              <span className="text-gradient-cyan ml-2 sm:ml-3">Center</span>
            </h1>
          </div>
          <p className="text-sm sm:text-lg text-slate-400 ml-0 sm:ml-7 mb-6 max-w-2xl">
            Real-time fire prevention monitoring across Tandag City
          </p>

          {/* Enhanced Quick Stats Bar - Scrollable on mobile */}
          <div className="sm:ml-7 flex flex-nowrap overflow-x-auto pb-2 sm:pb-0 items-center gap-3 sm:gap-6 custom-scrollbar pr-4">
            <div className="flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 whitespace-nowrap">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-green-400">
                System Online
              </span>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 whitespace-nowrap">
              <ActivityIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm text-slate-400">
                <span className="text-cyan-400 font-bold">{activeDevices}</span>{' '}
                Active
              </span>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 whitespace-nowrap">
              <TrendingUpIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs sm:text-sm text-slate-400">
                <span className="text-green-400 font-bold">98.5%</span> Uptime
              </span>
            </div>
            <div className="flex-shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 whitespace-nowrap">
              <ZapIcon className="w-4 h-4 text-purple-400" />
              <span className="text-xs sm:text-sm text-slate-400">
                <span className="text-purple-400 font-bold">&lt;5s</span>{' '}
                Response
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="animate-slide-up" style={{
          animationDelay: '0.1s'
        }}>
            <StatsCard title="Total Alerts" value={displayStats.totalHouses} icon={HomeIcon} color="blue" />
          </div>
          <div className="animate-slide-up" style={{
          animationDelay: '0.2s'
        }}>
            <StatsCard title="Active Devices" value={activeDevices} icon={RadioIcon} color="green" trend={{
            value: `${activeDevices} online`,
            positive: true
          }} />
          </div>
          <div className="animate-slide-up" style={{
          animationDelay: '0.3s'
        }}>
            <StatsCard title="Critical Alerts" value={displayStats.triggeredDevices} icon={AlertTriangleIcon} color="red" />
          </div>
          <div className="animate-slide-up" style={{
          animationDelay: '0.4s'
        }}>
            <StatsCard title="Warning Alerts" value={stats.warning} icon={MapPinIcon} color="yellow" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Map Preview - Collapsible on Mobile */}
          <div className="lg:col-span-2 animate-slide-up" style={{
          animationDelay: '0.5s'
        }}>
            <CollapsibleSection title="Live Device Map" icon={MapPinIcon} subtitle={`${devices.length} devices monitored`} defaultOpen={true}>
              <div className="group relative h-full">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl">
                  {/* Header - Hidden on mobile inside collapsible, visible on desktop */}
                  <div className="hidden lg:block relative p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                            <MapPinIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold text-white">
                            Live Device Map
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {devices.length} devices monitored
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                          Live
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Map Container */}
                  <div className="relative h-[300px] sm:h-[450px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 pointer-events-none"></div>
                    <MapContainer center={[TANDAG_CENTER.lat, TANDAG_CENTER.lng]} zoom={14} style={{
                    height: '100%',
                    width: '100%'
                  }} dragging={true} scrollWheelZoom={false}>
                      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                      {devices.map(device => <DeviceMarker key={device.id} device={device} onViewDetails={setSelectedDevice} />)}
                    </MapContainer>

                    {/* Mobile Map Overlay Hint */}
                    <div className="absolute top-4 right-4 z-[400] lg:hidden">
                      <Link to="/app/satellite" className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-lg text-xs font-medium text-white shadow-lg">
                        Tap markers for details
                      </Link>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/40 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
                          <span className="text-slate-400">
                            <span className="text-green-400 font-bold">
                              {devices.filter(d => d.status === 'normal').length}
                            </span>{' '}
                            Normal
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></span>
                          <span className="text-slate-400">
                            <span className="text-yellow-400 font-bold">
                              {devices.filter(d => d.status === 'warning').length}
                            </span>{' '}
                            Warning
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                          <span className="text-slate-400">
                            <span className="text-red-400 font-bold">
                              {triggeredDevices}
                            </span>{' '}
                            Alert
                          </span>
                        </div>
                      </div>
                      <Link to="/app/satellite" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group flex items-center gap-1">
                        View Full Map
                        <span className="inline-block group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          {/* Enhanced Alert Feed - Desktop View */}
          <div className="hidden lg:block animate-slide-up" style={{
          animationDelay: '0.6s'
        }}>
            <div className="group relative h-full">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative h-full backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/30 transition-all duration-500 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
                        <AlertTriangleIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        Alert Center
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {unacknowledgedAlerts} unacknowledged
                      </p>
                    </div>
                  </div>
                  {/* Alert Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-center">
                      <div className="text-xs text-slate-400 mb-1 font-semibold">
                        Critical
                      </div>
                      <div className="text-xl font-bold text-red-400">
                        {alerts.filter(a => a.severity === 'critical').length}
                      </div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2.5 text-center">
                      <div className="text-xs text-slate-400 mb-1 font-semibold">
                        High
                      </div>
                      <div className="text-xl font-bold text-orange-400">
                        {alerts.filter(a => a.severity === 'high').length}
                      </div>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2.5 text-center">
                      <div className="text-xs text-slate-400 mb-1 font-semibold">
                        Medium
                      </div>
                      <div className="text-xl font-bold text-yellow-400">
                        {alerts.filter(a => a.severity === 'medium').length}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Alert Feed */}
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto custom-scrollbar max-h-[500px]">
                  <AlertFeed alerts={alerts} onAcknowledge={acknowledgeAlert} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet for Alerts */}
      <MobileBottomSheet alertCount={unacknowledgedAlerts} title="Alert Center">
        <div className="space-y-4">
          {/* Alert Stats in Bottom Sheet */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-center">
              <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">
                Critical
              </div>
              <div className="text-lg font-bold text-red-400">
                {alerts.filter(a => a.severity === 'critical').length}
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2 text-center">
              <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">
                High
              </div>
              <div className="text-lg font-bold text-orange-400">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-2 text-center">
              <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase">
                Medium
              </div>
              <div className="text-lg font-bold text-yellow-400">
                {alerts.filter(a => a.severity === 'medium').length}
              </div>
            </div>
          </div>
          <AlertFeed alerts={alerts} onAcknowledge={acknowledgeAlert} />
        </div>
      </MobileBottomSheet>

      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>;
}