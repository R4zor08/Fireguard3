import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Device } from '../types';
import { MapPinIcon } from 'lucide-react';
interface DeviceMarkerProps {
  device: Device;
  onViewDetails: (device: Device) => void;
}
export function DeviceMarker({
  device,
  onViewDetails
}: DeviceMarkerProps) {
  const getMarkerColor = () => {
    switch (device.status) {
      case 'normal':
        return '#10B981';
      // green
      case 'warning':
        return '#F59E0B';
      // yellow
      case 'triggered':
        return '#DC2626';
      // red
      case 'offline':
        return '#6B7280';
      // gray
    }
  };
  const markerIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getMarkerColor()}" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
  return <Marker position={[device.latitude, device.longitude]} icon={markerIcon}>
      <Popup>
        <div className="p-2 min-w-[200px]">
          <h3 className="font-bold text-gray-900 mb-2">{device.ownerName}</h3>
          <p className="text-sm text-gray-600 mb-2">{device.address}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${device.status === 'normal' ? 'bg-green-500' : device.status === 'warning' ? 'bg-yellow-500' : device.status === 'triggered' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
            <span className="text-sm font-medium capitalize">
              {device.status}
            </span>
          </div>
          <button onClick={() => onViewDetails(device)} className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700">
            View Details
          </button>
        </div>
      </Popup>
    </Marker>;
}