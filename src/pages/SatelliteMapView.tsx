import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import { SatelliteIcon, LayersIcon, ZoomInIcon, ZoomOutIcon, MaximizeIcon, HomeIcon, RadioIcon, FlameIcon, MapPinIcon, XIcon, FilterIcon } from 'lucide-react';
import { DeviceMarker } from '../components/DeviceMarker';
import { FireIncidentMarker } from '../components/FireIncidentMarker';
import { DeviceDetailModal } from '../components/DeviceDetailModal';
import { FireIncidentModal } from '../components/FireIncidentModal';
import { TimeOverlay } from '../components/TimeOverlay';
import { useDevices } from '../hooks/useDevices';
import { useFireIncidents } from '../hooks/useFireIncidents';
import { TANDAG_CENTER, mockRiskAreas } from '../utils/mockData';
import { Device, FireIncident } from '../types';
import 'leaflet/dist/leaflet.css';
function MapControls() {
  const map = useMap();
  return <div className="absolute top-4 right-4 z-[1000] space-y-2">
      <button onClick={() => map.zoomIn()} className="w-12 h-12 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-xl flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110 shadow-xl" title="Zoom In">
        <ZoomInIcon className="w-5 h-5" />
      </button>
      <button onClick={() => map.zoomOut()} className="w-12 h-12 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-xl flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110 shadow-xl" title="Zoom Out">
        <ZoomOutIcon className="w-5 h-5" />
      </button>
      <button onClick={() => map.setView([TANDAG_CENTER.lat, TANDAG_CENTER.lng], 14)} className="w-12 h-12 glass-dark border border-slate-700 hover:border-cyan-500/50 rounded-xl flex items-center justify-center text-white hover:text-cyan-400 transition-all hover:scale-110 shadow-xl" title="Reset View">
        <MaximizeIcon className="w-5 h-5" />
      </button>
    </div>;
}
export function SatelliteMapView() {
  const {
    devices
  } = useDevices();
  const {
    incidents,
    activeIncidents,
    criticalIncidents
  } = useFireIncidents();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const [showDevices, setShowDevices] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showHouseholds, setShowHouseholds] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileLegendOpen, setMobileLegendOpen] = useState(false);
  const onlineDevices = devices.filter(d => d.isOnline).length;
  const triggeredDevices = devices.filter(d => d.status === 'triggered').length;
  return <div className="h-screen flex flex-col bg-slate-950">
      {/* Desktop Header */}
      <div className="hidden lg:flex glass-dark border-b border-slate-700 p-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
              <SatelliteIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-gradient-fire">Satellite Monitoring</span>
            </h1>
            <p className="text-sm text-slate-400">
              Real-time fire detection & IoT device tracking - 2025
            </p>
          </div>
        </div>

        {/* Desktop Stats */}
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <FlameIcon className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400">Active Fires:</span>
              <span className="text-sm font-bold text-red-400">
                {activeIncidents.length}
              </span>
            </div>
          </div>
          <div className="glass px-4 py-2.5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <RadioIcon className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Devices:</span>
              <span className="text-sm font-bold text-green-400">
                {onlineDevices}
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/50">
                <SatelliteIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Satellite View</h1>
              <p className="text-xs text-slate-400">Live monitoring</p>
            </div>
          </div>
          <button onClick={() => setMobileFiltersOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-all">
            <FilterIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-red-400">
              {activeIncidents.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Active
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-orange-400">
              {criticalIncidents.length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Critical
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-green-400">
              {onlineDevices}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              Online
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

          {/* Risk Zone Circles */}
          {showRiskZones && mockRiskAreas.map((area, index) => <Circle key={index} center={[area.latitude, area.longitude]} radius={area.radius} pathOptions={{
          color: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
          fillColor: area.riskScore > 70 ? '#DC2626' : area.riskScore > 50 ? '#F59E0B' : '#10B981',
          fillOpacity: 0.15,
          weight: 2
        }} />)}

          {/* Device Markers */}
          {showDevices && devices.map(device => <DeviceMarker key={device.id} device={device} onViewDetails={setSelectedDevice} />)}

          {/* Fire Incident Markers */}
          {showIncidents && incidents.map(incident => <FireIncidentMarker key={incident.id} incident={incident} onViewDetails={setSelectedIncident} />)}

          <MapControls />
        </MapContainer>

        {/* Time Overlay - Desktop */}
        <div className="hidden lg:block absolute top-4 left-4 z-[1000]">
          <TimeOverlay />
        </div>

        {/* Layer Controls - Desktop */}
        <div className="hidden lg:block absolute bottom-4 left-4 z-[1000] space-y-2">
          <div className="glass-dark border border-slate-700 rounded-xl p-4 shadow-xl min-w-[250px]">
            <div className="flex items-center gap-2 mb-4">
              <LayersIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Map Layers</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <FlameIcon className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Fire Incidents
                  </span>
                </div>
                <input type="checkbox" checked={showIncidents} onChange={e => setShowIncidents(e.target.checked)} className="w-4 h-4 accent-red-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <RadioIcon className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    IoT Devices
                  </span>
                </div>
                <input type="checkbox" checked={showDevices} onChange={e => setShowDevices(e.target.checked)} className="w-4 h-4 accent-green-500" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    Risk Zones
                  </span>
                </div>
                <input type="checkbox" checked={showRiskZones} onChange={e => setShowRiskZones(e.target.checked)} className="w-4 h-4 accent-yellow-500" />
              </label>
            </div>
          </div>
        </div>

        {/* Legend - Desktop */}
        <div className="hidden lg:block absolute bottom-4 right-4 z-[1000]">
          <div className="glass-dark border border-slate-700 rounded-xl p-4 shadow-xl min-w-[280px]">
            <h3 className="text-sm font-bold text-white mb-4">
              Severity Legend
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                <span className="text-sm text-slate-300">Critical Fire</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                <span className="text-sm text-slate-300">High Severity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                <span className="text-sm text-slate-300">Medium Risk</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                <span className="text-sm text-slate-300">Normal / Low</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-slate-300">
                  Resolved / Offline
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Floating Legend Button */}
        <button onClick={() => setMobileLegendOpen(true)} className="lg:hidden fixed bottom-20 right-4 z-[1000] w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 text-white hover:scale-110 transition-transform">
          <LayersIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && <div className="lg:hidden fixed inset-0 z-[2000] animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 glass-dark border-t border-slate-700 rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Map Layers</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 glass rounded-xl border border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FlameIcon className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">Fire Incidents</span>
                </div>
                <input type="checkbox" checked={showIncidents} onChange={e => setShowIncidents(e.target.checked)} className="w-5 h-5 accent-red-500" />
              </label>
              <label className="flex items-center justify-between p-4 glass rounded-xl border border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <RadioIcon className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">IoT Devices</span>
                </div>
                <input type="checkbox" checked={showDevices} onChange={e => setShowDevices(e.target.checked)} className="w-5 h-5 accent-green-500" />
              </label>
              <label className="flex items-center justify-between p-4 glass rounded-xl border border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Risk Zones</span>
                </div>
                <input type="checkbox" checked={showRiskZones} onChange={e => setShowRiskZones(e.target.checked)} className="w-5 h-5 accent-yellow-500" />
              </label>
            </div>
            <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg shadow-red-500/50">
              Apply Layers
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
                  Severity Levels
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <span className="text-sm text-slate-300">
                      Critical Fire
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                    <span className="text-sm text-slate-300">
                      High Severity
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                    <span className="text-sm text-slate-300">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                    <span className="text-sm text-slate-300">Normal / Low</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-slate-300">
                      Resolved / Offline
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setMobileLegendOpen(false)} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all shadow-lg shadow-red-500/50">
              Close
            </button>
          </div>
        </div>}

      {/* Modals */}
      {selectedDevice && <DeviceDetailModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />}
      {selectedIncident && <FireIncidentModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />}
    </div>;
}