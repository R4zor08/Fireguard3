import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import { FilterIcon, XIcon, LayersIcon, MapPinIcon, ZoomInIcon, ZoomOutIcon, MaximizeIcon, MenuIcon } from 'lucide-react';
import { DeviceMarker } from '../components/DeviceMarker';
import { DeviceDetailModal } from '../components/DeviceDetailModal';
import { useDevices } from '../hooks/useDevices';
import { TANDAG_CENTER, mockRiskAreas } from '../utils/mockData';
import { Device } from '../types';
import 'leaflet/dist/leaflet.css';
export function MapView() {
  const {
    devices
  } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showRiskAreas, setShowRiskAreas] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileLegendOpen, setMobileLegendOpen] = useState(false);
  const normalDevices = devices.filter(d => d.status === 'normal').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const alertDevices = devices.filter(d => d.status === 'triggered').length;
  const offlineDevices = devices.filter(d => !d.isOnline).length;
  const onlineDevices = devices.filter(d => d.isOnline).length;
  return <div className="h-screen flex flex-col bg-slate-950">
      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden lg:flex glass-dark border-b border-slate-700 p-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <MapPinIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-gradient-cyan">Interactive Map</span>
            </h1>
            <p className="text-sm text-slate-400">
              <span className="text-green-400 font-semibold">
                {onlineDevices}
              </span>{' '}
              devices online |
              <span className="text-red-400 font-semibold ml-2">
                {alertDevices}
              </span>{' '}
              active alerts
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop Filters */}
          <label className="flex items-center gap-2 cursor-pointer glass px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all group">
            <input type="checkbox" checked={showRiskAreas} onChange={e => setShowRiskAreas(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
            <LayersIcon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-sm text-slate-300 font-medium">
              Risk Zones
            </span>
          </label>
          {/* Desktop Legend */}
          <div className="flex items-center gap-4 glass px-5 py-2.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
              <span className="text-xs text-slate-300 font-medium">
                {normalDevices}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></span>
              <span className="text-xs text-slate-300 font-medium">
                {warningDevices}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
              <span className="text-xs text-slate-300 font-medium">
                {alertDevices}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
              <span className="text-xs text-slate-300 font-medium">
                {offlineDevices}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden glass-dark border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <MapPinIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Map View</h1>
              <p className="text-xs text-slate-400">
                <span className="text-green-400 font-semibold">
                  {onlineDevices}
                </span>{' '}
                online
              </p>
            </div>
          </div>
          <button onClick={() => setMobileFiltersOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-all">
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Mobile Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-400">
              {normalDevices}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Normal
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-yellow-400">
              {warningDevices}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Warning
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-red-400">{alertDevices}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Alert
            </div>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-gray-400">
              {offlineDevices}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Offline
            </div>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer center={[TANDAG_CENTER.lat, TANDAG_CENTER.lng]} zoom={14} style={{
        height: '100%',
        width: '100%'
      }} zoomControl={false}>
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; <a href="https://www.esri.com/">Esri</a>' />
          {/* Risk Area Circles */}
          {showRiskAreas && mockRiskAreas.map((area, index) => <Circle key={index} center={[area.latitude, area.longitude]} radius={area.radius} pathOptions={{
          color: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
          fillColor: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
          fillOpacity: 0.2,
          weight: 2
        }} />)}
          {/* Device Markers */}
          {devices.map(device => <DeviceMarker key={device.id} device={device} onViewDetails={setSelectedDevice} />)}
        </MapContainer>
        {/* Mobile Floating Legend Button */}
        <button onClick={() => setMobileLegendOpen(true)} className="lg:hidden fixed bottom-20 right-4 z-[1000] w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 text-white hover:scale-110 transition-transform">
          <LayersIcon className="w-6 h-6" />
        </button>
        {/* Desktop Map Controls */}
        <div className="hidden lg:block absolute top-4 right-4 z-[1000] space-y-2">
          <button className="w-10 h-10 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-lg flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110">
            <ZoomInIcon className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-lg flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110">
            <ZoomOutIcon className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-lg flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110">
            <MaximizeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && <div className="lg:hidden fixed inset-0 z-[2000] animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 glass-dark border-t border-slate-700 rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Map Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 glass rounded-xl border border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <LayersIcon className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">
                    Show Risk Zones
                  </span>
                </div>
                <input type="checkbox" checked={showRiskAreas} onChange={e => setShowRiskAreas(e.target.checked)} className="w-5 h-5 accent-cyan-500" />
              </label>
              <div className="p-4 glass rounded-xl border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Device Status
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
                      <span className="text-sm text-slate-300">Normal</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">
                      {normalDevices}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></span>
                      <span className="text-sm text-slate-300">Warning</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">
                      {warningDevices}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                      <span className="text-sm text-slate-300">Alert</span>
                    </div>
                    <span className="text-sm font-bold text-red-400">
                      {alertDevices}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      <span className="text-sm text-slate-300">Offline</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400">
                      {offlineDevices}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50">
              Apply Filters
            </button>
          </div>
        </div>}
      {/* Mobile Legend Drawer */}
      {mobileLegendOpen && <div className="lg:hidden fixed inset-0 z-[2000] animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileLegendOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 glass-dark border-t border-slate-700 rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Map Legend</h3>
              <button onClick={() => setMobileLegendOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 glass rounded-xl border border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Device Status
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span>
                      <span className="text-xs text-slate-300 font-medium">
                        Normal
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {normalDevices}
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></span>
                      <span className="text-xs text-slate-300 font-medium">
                        Warning
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {warningDevices}
                    </div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
                      <span className="text-xs text-slate-300 font-medium">
                        Alert
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-400">
                      {alertDevices}
                    </div>
                  </div>
                  <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                      <span className="text-xs text-slate-300 font-medium">
                        Offline
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-400">
                      {offlineDevices}
                    </div>
                  </div>
                </div>
              </div>
              {showRiskAreas && <div className="p-4 glass rounded-xl border border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Risk Zones
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 bg-red-500/30 border-2 border-red-500 rounded-full"></span>
                      <span className="text-sm text-slate-300">
                        High Risk (70%+)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 bg-yellow-500/30 border-2 border-yellow-500 rounded-full"></span>
                      <span className="text-sm text-slate-300">
                        Medium Risk (50-70%)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 bg-green-500/30 border-2 border-green-500 rounded-full"></span>
                      <span className="text-sm text-slate-300">
                        Low Risk (&lt;50%)
                      </span>
                    </div>
                  </div>
                </div>}
            </div>
            <button onClick={() => setMobileLegendOpen(false)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/50">
              Close
            </button>
          </div>
        </div>}
      {/* Device Detail Modal */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
    </div>;
}