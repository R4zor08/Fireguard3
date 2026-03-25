import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { XIcon, MapPinIcon, HomeIcon, FlameIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TANDAG_CENTER } from '../utils/mockData';
// Fix for Leaflet default icon not showing
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});
// Custom Icons
const householdIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const fireStationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
interface Household {
  id: string;
  ownerName: string;
  address: string;
  deviceCount: number;
}
interface HouseholdMapModalProps {
  household: Household;
  onClose: () => void;
}
export function HouseholdMapModal({
  household,
  onClose
}: HouseholdMapModalProps) {
  // Generate a consistent location based on ID (mock)
  const idNum = parseInt(household.id.replace(/\D/g, '')) || 1;
  const lat = TANDAG_CENTER.lat + (idNum * 0.002 - 0.005);
  const lng = TANDAG_CENTER.lng + (idNum * 0.003 - 0.005);
  // Mock fire stations
  const fireStations = [{
    id: 'FS-01',
    name: 'Tandag Central Fire Station',
    lat: TANDAG_CENTER.lat + 0.005,
    lng: TANDAG_CENTER.lng + 0.005
  }, {
    id: 'FS-02',
    name: 'San Agustin Sub-Station',
    lat: TANDAG_CENTER.lat - 0.008,
    lng: TANDAG_CENTER.lng - 0.003
  }];
  return <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl h-[80vh] glass-dark border border-slate-700 rounded-2xl shadow-2xl animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Household Location
              </h2>
              <p className="text-sm text-slate-400">{household.address}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer center={[lat, lng]} zoom={15} style={{
          height: '100%',
          width: '100%'
        }}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; <a href="https://www.esri.com/">Esri</a>' />

            {/* Household Marker */}
            <Marker position={[lat, lng]} icon={householdIcon}>
              <Popup className="custom-popup">
                <div className="p-2">
                  <h3 className="font-bold text-slate-900">
                    {household.ownerName}
                  </h3>
                  <p className="text-sm text-slate-600">{household.address}</p>
                  <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                    {household.deviceCount} Devices Active
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Fire Stations */}
            {fireStations.map(station => <Marker key={station.id} position={[station.lat, station.lng]} icon={fireStationIcon}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-slate-900">{station.name}</h3>
                    <p className="text-xs text-red-600 font-bold mt-1">
                      FIRE STATION
                    </p>
                  </div>
                </Popup>
              </Marker>)}
          </MapContainer>

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] glass-dark p-3 rounded-xl border border-slate-700 shadow-xl">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
              Map Legend
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Household Location</span>
              </div>
              <div className="flex items-center gap-2">
                <FlameIcon className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white">Fire Station</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}