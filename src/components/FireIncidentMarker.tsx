import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { FireIncident } from '../types';
import { FlameIcon, AlertTriangleIcon, ThermometerIcon, WindIcon } from 'lucide-react';
interface FireIncidentMarkerProps {
  incident: FireIncident;
  onViewDetails: (incident: FireIncident) => void;
}
export function FireIncidentMarker({
  incident,
  onViewDetails
}: FireIncidentMarkerProps) {
  const getMarkerColor = () => {
    if (incident.status === 'resolved') return '#6B7280'; // gray
    switch (incident.severity) {
      case 'critical':
        return '#DC2626';
      // red
      case 'high':
        return '#F59E0B';
      // orange
      case 'medium':
        return '#FBBF24';
      // yellow
      case 'low':
        return '#10B981';
      // green
      default:
        return '#6B7280';
    }
  };
  const getIncidentSymbol = () => {
    switch (incident.type) {
      case 'active_fire':
        return 'F';
      // F for Fire
      case 'smoke_detected':
        return 'S';
      // S for Smoke
      case 'heat_anomaly':
        return 'H';
      // H for Heat
      case 'gas_leak':
        return 'G';
      // G for Gas
      default:
        return 'R';
      // R for Resolved
    }
  };
  const markerIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="${getMarkerColor()}" stroke="white" stroke-width="2">
        <circle cx="24" cy="24" r="20" fill="${getMarkerColor()}" opacity="0.3"/>
        <circle cx="24" cy="24" r="16" fill="${getMarkerColor()}" opacity="0.6"/>
        <circle cx="24" cy="24" r="12" fill="${getMarkerColor()}"/>
        <text x="24" y="30" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${getIncidentSymbol()}</text>
      </svg>
    `)}`,
    iconSize: incident.severity === 'critical' ? [48, 48] : [40, 40],
    iconAnchor: incident.severity === 'critical' ? [24, 24] : [20, 20],
    popupAnchor: [0, -20],
    className: incident.severity === 'critical' && incident.status !== 'resolved' ? 'animate-pulse' : ''
  });
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <Marker position={[incident.latitude, incident.longitude]} icon={markerIcon}>
      <Popup>
        <div className="p-3 min-w-[250px]">
          <div className="flex items-center gap-2 mb-2">
            {incident.type === 'active_fire' && <FlameIcon className="w-5 h-5 text-red-500" />}
            {incident.type === 'smoke_detected' && <WindIcon className="w-5 h-5 text-gray-500" />}
            {incident.type === 'heat_anomaly' && <ThermometerIcon className="w-5 h-5 text-orange-500" />}
            {incident.type === 'gas_leak' && <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />}
            <h3 className="font-bold text-gray-900 text-base">
              {incident.type.replace(/_/g, ' ').toUpperCase()}
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-2">{incident.address}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${incident.severity === 'critical' ? 'bg-red-100 text-red-700' : incident.severity === 'high' ? 'bg-orange-100 text-orange-700' : incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {incident.severity.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${incident.status === 'active' ? 'bg-red-100 text-red-700' : incident.status === 'responding' ? 'bg-blue-100 text-blue-700' : incident.status === 'contained' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {incident.status.toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-gray-600 space-y-1 mb-3">
            <p>
              <span className="font-semibold">Detected:</span>{' '}
              {formatTime(incident.detectedAt)}
            </p>
            {incident.affectedHouseholds > 0 && <p>
                <span className="font-semibold">Affected:</span>{' '}
                {incident.affectedHouseholds} household(s)
              </p>}
            {incident.responseUnits && incident.responseUnits.length > 0 && <p>
                <span className="font-semibold">Response:</span>{' '}
                {incident.responseUnits.length} unit(s)
              </p>}
          </div>

          <button onClick={() => onViewDetails(incident)} className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors">
            View Full Details
          </button>
        </div>
      </Popup>
    </Marker>;
}