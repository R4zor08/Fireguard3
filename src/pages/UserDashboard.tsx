import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { WifiIcon, BatteryIcon, SignalIcon, ThermometerIcon, FlameIcon, WindIcon, ClockIcon, MapPinIcon, WrenchIcon, RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';
import { TANDAG_CENTER } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SensorGauge } from '../components/SensorGauge';
import { ContactCard, ContactType } from '../components/ContactCard';
import { MaintenanceLogModal } from '../components/MaintenanceLogModal';
import { CreateAlertModal } from '../components/CreateAlertModal';
import { LoadingState } from '../components/LoadingState';
import { StatsCard } from '../components/StatsCard';
import { useAuth } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';
import { useContacts } from '../hooks/useContacts';
import { useDevicesRealTime } from '../hooks/useDevicesRealTime';
// Leaflet Icon Fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
export function UserDashboard() {
  const {
    user
  } = useAuth();
  const { alerts: realAlerts, loading: alertsLoading, fetchAlerts, createAlert } = useAlerts();
  const { contacts, loading: contactsLoading } = useContacts();
  const { devices, loading: devicesLoading, fetchDevices } = useDevicesRealTime();
  const [now, setNow] = useState(() => new Date());
  // Modal States
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);

  const primaryDevice = useMemo(() => {
    if (devices.length === 0) return undefined;
    if (user?.name) {
      const match = devices.find(d => d.ownerName === user.name);
      if (match) return match;
    }
    return devices[0];
  }, [devices, user?.name]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const lastSyncDate = useMemo(() => {
    const candidate = realAlerts[0]?.timestamp ?? primaryDevice?.lastReading?.timestamp;
    return candidate ? new Date(candidate) : now;
  }, [now, primaryDevice?.lastReading?.timestamp, realAlerts]);

  const mapCenter = useMemo(() => {
    const lat = primaryDevice?.latitude;
    const lng = primaryDevice?.longitude;
    if (typeof lat === 'number' && typeof lng === 'number' && (lat !== 0 || lng !== 0)) {
      return [lat, lng] as [number, number];
    }
    return [TANDAG_CENTER.lat, TANDAG_CENTER.lng] as [number, number];
  }, [primaryDevice?.latitude, primaryDevice?.longitude]);
  
  // Use latest alert for sensor readings or defaults
  const latestAlert = realAlerts[0];
  const sensorReadings = {
    smoke: latestAlert?.smokeLevel ?? 12,
    temperature: latestAlert?.temperature ?? 28,
    gas: 0.3
  };
  
  const maintenance = {
    health: 'Good',
    batteryStatus: 'Optimal',
    lastCheck: '15 days ago',
    nextCheck: '75 days'
  };
  if (alertsLoading || devicesLoading || contactsLoading) {
    return <LoadingState />;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-20 lg:pb-0">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
      </div>

      <div className="relative z-10 p-2 sm:p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="animate-slide-up px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="text-white">Welcome,</span>
                  <span className="text-gradient-cyan ml-2">
                    {user?.name || 'User'}
                  </span>
                </h1>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Real-time monitoring for {primaryDevice?.id || 'your device'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setShowCreateAlertModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25" title="Create Alert">
                <AlertTriangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Create Alert</span>
              </button>
              <button onClick={() => { fetchAlerts(); fetchDevices(); }} className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all" title="Refresh Data">
                <RefreshCwIcon className={`w-5 h-5 ${alertsLoading ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute inset-0"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10"></div>
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  System Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Status Grid - Using StatsCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }}>
            <StatsCard title="Connection" value={primaryDevice?.isOnline ? 'Online' : 'Offline'} icon={WifiIcon} color={primaryDevice?.isOnline ? 'green' : 'red'} trend={{
            value: primaryDevice?.isOnline ? 'Stable' : 'Disconnected',
            positive: Boolean(primaryDevice?.isOnline)
          }} />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            <StatsCard title="Battery Level" value={`${primaryDevice?.batteryLevel ?? 0}%`} icon={BatteryIcon} color={(primaryDevice?.batteryLevel ?? 0) > 20 ? 'blue' : 'red'} />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }}>
            <StatsCard title="Signal Strength" value={`${primaryDevice?.signalStrength ?? 0}%`} icon={SignalIcon} color="yellow" />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.4
        }}>
            <StatsCard title="Last Sync" value={lastSyncDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })} icon={ClockIcon} color="blue" />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sensor Readings & Map Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Sensor Readings */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5
          }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SensorGauge label="Smoke Level" value={sensorReadings.smoke} unit="%" max={100} thresholds={{
              warning: 30,
              critical: 60
            }} trend="stable" icon={FlameIcon} />
              <SensorGauge label="Temperature" value={sensorReadings.temperature} unit="°C" max={100} thresholds={{
              warning: 45,
              critical: 60
            }} trend="up" trendValue="+2°C" icon={ThermometerIcon} />
              <SensorGauge label="Gas / CO" value={sensorReadings.gas} unit="ppm" max={10} thresholds={{
              warning: 3,
              critical: 6
            }} trend="stable" icon={WindIcon} />
            </motion.div>

            {/* Location Map */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="group relative rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <MapPinIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Device Location
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tandag City, Surigao del Sur
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>

              <div className="h-[300px] relative z-0">
                <MapContainer center={mapCenter} zoom={15} style={{
                height: '100%',
                width: '100%'
              }} scrollWheelZoom={false} dragging={true}>
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                  <Marker position={mapCenter}>
                    <Popup>
                      <div className="text-slate-900 font-bold">
                        {primaryDevice?.id || 'Device'}
                      </div>
                      <div className="text-slate-600 text-xs">
                        Status: {primaryDevice?.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Maintenance Card */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.6
          }} className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <WrenchIcon className="w-32 h-32 text-orange-500" />
              </div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <WrenchIcon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">System Health</h3>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
                    <span className="text-sm font-bold text-emerald-400">
                      {maintenance.health}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Last Check</span>
                  <span className="text-sm font-medium text-white">
                    {maintenance.lastCheck}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-white/5">
                  <span className="text-sm text-slate-400">Next Scheduled</span>
                  <span className="text-sm font-medium text-white">
                    {maintenance.nextCheck}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={() => setShowMaintenanceModal(true)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-white/20 shadow-lg">
                  View Maintenance Log
                </button>
              </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.7
          }} className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6">Emergency Contacts</h3>

              <div className="space-y-4">
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      name={contact.name}
                      number={contact.number}
                      type={contact.type as ContactType}
                      role={contact.role || undefined}
                      onCall={() => console.log(`Calling ${contact.name}`)}
                      onMessage={() => console.log(`Messaging ${contact.name}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>No emergency contacts available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MaintenanceLogModal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} />
      <CreateAlertModal isOpen={showCreateAlertModal} onClose={() => setShowCreateAlertModal(false)} onSubmit={createAlert} />
    </div>;
}