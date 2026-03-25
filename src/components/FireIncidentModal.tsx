import React, { useState } from 'react';
import { XIcon, FlameIcon, MapPinIcon, ClockIcon, UsersIcon, TruckIcon, AlertTriangleIcon, ChevronDownIcon, ChevronUpIcon, RadioIcon, ThermometerIcon, CloudIcon, WindIcon, BellIcon, SettingsIcon } from 'lucide-react';
import { FireIncident } from '../types';
import { useDevices } from '../hooks/useDevices';
interface FireIncidentModalProps {
  incident: FireIncident;
  onClose: () => void;
}
export function FireIncidentModal({
  incident,
  onClose
}: FireIncidentModalProps) {
  const {
    devices
  } = useDevices();
  const [devicePanelExpanded, setDevicePanelExpanded] = useState(false);
  // Find the linked device
  const linkedDevice = incident.deviceId ? devices.find(d => d.id === incident.deviceId) : null;
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getSeverityColor = () => {
    switch (incident.severity) {
      case 'critical':
        return 'from-red-600 to-red-700';
      case 'high':
        return 'from-orange-600 to-orange-700';
      case 'medium':
        return 'from-yellow-600 to-yellow-700';
      case 'low':
        return 'from-green-600 to-green-700';
    }
  };
  const getStatusColor = () => {
    switch (incident.status) {
      case 'active':
        return 'bg-red-500/20 text-red-400 border-red-500';
      case 'responding':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'contained':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'resolved':
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };
  const getSensorStatus = (value: number, type: 'smoke' | 'temp' | 'gas') => {
    if (type === 'smoke' || type === 'gas') {
      if (value > 70) return {
        color: 'text-red-400',
        bg: 'bg-red-500',
        label: 'Critical'
      };
      if (value > 30) return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500',
        label: 'Warning'
      };
      return {
        color: 'text-green-400',
        bg: 'bg-green-500',
        label: 'Normal'
      };
    }
    if (type === 'temp') {
      if (value > 60) return {
        color: 'text-red-400',
        bg: 'bg-red-500',
        label: 'Critical'
      };
      if (value > 35) return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500',
        label: 'Warning'
      };
      return {
        color: 'text-green-400',
        bg: 'bg-green-500',
        label: 'Normal'
      };
    }
    return {
      color: 'text-slate-400',
      bg: 'bg-slate-500',
      label: 'Unknown'
    };
  };
  const handleTestAlarm = () => {
    alert(`Testing alarm for device ${linkedDevice?.id}`);
  };
  const handleConfigure = () => {
    alert(`Opening configuration for device ${linkedDevice?.id}`);
  };
  return <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-dark border border-slate-700 rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className={`relative p-6 bg-gradient-to-r ${getSeverityColor()} border-b border-slate-700`}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FlameIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {incident.type.replace(/_/g, ' ').toUpperCase()}
                </h2>
                <p className="text-sm text-white/80">
                  Incident ID: {incident.id}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex flex-wrap gap-3">
            <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor()}`}>
              {incident.status.toUpperCase()}
            </span>
            <span className={`px-4 py-2 rounded-xl text-sm font-bold ${incident.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500' : incident.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500' : incident.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' : 'bg-green-500/20 text-green-400 border border-green-500'}`}>
              {incident.severity.toUpperCase()} SEVERITY
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 space-y-6">
          {/* Location */}
          <div className="glass rounded-xl p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 mb-1">Location</p>
                <p className="text-white font-medium">{incident.address}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {incident.latitude.toFixed(6)},{' '}
                  {incident.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass rounded-xl p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-slate-400 mb-2">Timeline</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">Detected</span>
                    <span className="text-sm text-slate-400">
                      {formatDateTime(incident.detectedAt)}
                    </span>
                  </div>
                  {incident.resolvedAt && <div className="flex justify-between items-center">
                      <span className="text-sm text-white">Resolved</span>
                      <span className="text-sm text-slate-400">
                        {formatDateTime(incident.resolvedAt)}
                      </span>
                    </div>}
                </div>
              </div>
            </div>
          </div>

          {/* Impact */}
          {incident.affectedHouseholds > 0 && <div className="glass rounded-xl p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">
                    Affected Households
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {incident.affectedHouseholds}
                  </p>
                </div>
              </div>
            </div>}

          {/* Response Units */}
          {incident.responseUnits && incident.responseUnits.length > 0 && <div className="glass rounded-xl p-4 border border-slate-700">
              <div className="flex items-start gap-3">
                <TruckIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-slate-400 mb-2">Response Units</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.responseUnits.map((unit, index) => <span key={index} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-cyan-400 font-medium">
                        {unit}
                      </span>)}
                  </div>
                </div>
              </div>
            </div>}

          {/* Description */}
          <div className="glass rounded-xl p-4 border border-slate-700">
            <div className="flex items-start gap-3">
              <AlertTriangleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Incident Description
                </p>
                <p className="text-white leading-relaxed">
                  {incident.description}
                </p>
              </div>
            </div>
          </div>

          {/* Device Link with Expandable Panel */}
          {incident.deviceId && <div className="glass rounded-xl border border-slate-700 overflow-hidden">
              <button onClick={() => setDevicePanelExpanded(!devicePanelExpanded)} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <RadioIcon className="w-5 h-5 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-sm text-slate-400">Linked Device</p>
                    <p className="text-white font-medium">
                      {incident.deviceId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-400 font-medium">
                    {devicePanelExpanded ? 'Hide Details' : 'View Device'}
                  </span>
                  {devicePanelExpanded ? <ChevronUpIcon className="w-5 h-5 text-cyan-400" /> : <ChevronDownIcon className="w-5 h-5 text-cyan-400" />}
                </div>
              </button>

              {/* Expandable Device Details Panel */}
              {devicePanelExpanded && linkedDevice && <div className="border-t border-slate-700 p-4 space-y-4 bg-slate-900/30 animate-slide-up">
                  {/* Device Status */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                    <div className={`w-3 h-3 rounded-full ${linkedDevice.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-slate-300">
                      {linkedDevice.isOnline ? 'Online' : 'Offline'} •{' '}
                      {linkedDevice.ownerName}
                    </span>
                  </div>

                  {/* Sensor Readings with Gauges */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Smoke */}
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Smoke</span>
                      </div>
                      <p className={`text-xl font-bold ${getSensorStatus(linkedDevice.lastReading.smoke, 'smoke').color}`}>
                        {linkedDevice.lastReading.smoke.toFixed(0)}%
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                        <div className={`h-full rounded-full ${getSensorStatus(linkedDevice.lastReading.smoke, 'smoke').bg} transition-all`} style={{
                    width: `${linkedDevice.lastReading.smoke}%`
                  }}></div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ThermometerIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Temp</span>
                      </div>
                      <p className={`text-xl font-bold ${getSensorStatus(linkedDevice.lastReading.temperature, 'temp').color}`}>
                        {linkedDevice.lastReading.temperature.toFixed(0)}°C
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                        <div className={`h-full rounded-full ${getSensorStatus(linkedDevice.lastReading.temperature, 'temp').bg} transition-all`} style={{
                    width: `${Math.min(linkedDevice.lastReading.temperature / 100 * 100, 100)}%`
                  }}></div>
                      </div>
                    </div>

                    {/* Gas */}
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <WindIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-400">Gas</span>
                      </div>
                      <p className={`text-xl font-bold ${getSensorStatus(linkedDevice.lastReading.gas, 'gas').color}`}>
                        {linkedDevice.lastReading.gas.toFixed(0)}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">PPM</p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button onClick={handleConfigure} className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all">
                      <SettingsIcon className="w-4 h-4" />
                      Configure
                    </button>
                    <button onClick={handleTestAlarm} className="flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 rounded-lg text-sm font-medium transition-all">
                      <BellIcon className="w-4 h-4" />
                      Test Alarm
                    </button>
                  </div>
                </div>}
            </div>}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50">
          <button onClick={onClose} className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg">
            Close Details
          </button>
        </div>
      </div>
    </div>;
}