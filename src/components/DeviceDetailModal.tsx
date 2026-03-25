import React from 'react';
import { X, ThermometerIcon, CloudIcon, WindIcon, BellIcon, ShieldIcon, ActivityIcon, MapPinIcon } from 'lucide-react';
import { Device } from '../types';
interface DeviceDetailModalProps {
  device: Device | null;
  onClose: () => void;
}
export function DeviceDetailModal({
  device,
  onClose
}: DeviceDetailModalProps) {
  if (!device) return null;
  const handleTriggerAlarm = () => {
    alert(`Alarm triggered for device ${device.id}`);
  };
  const handleEnableSuppression = () => {
    alert(`Suppression system activated for device ${device.id}`);
  };
  const getSensorStatus = (value: number, type: 'smoke' | 'temp' | 'gas') => {
    if (type === 'smoke' || type === 'gas') {
      if (value > 70) return {
        color: 'text-red-400',
        bg: 'from-red-500/20 to-red-600/10',
        status: 'Critical'
      };
      if (value > 30) return {
        color: 'text-yellow-400',
        bg: 'from-yellow-500/20 to-yellow-600/10',
        status: 'Warning'
      };
      return {
        color: 'text-green-400',
        bg: 'from-green-500/20 to-green-600/10',
        status: 'Normal'
      };
    }
    if (type === 'temp') {
      if (value > 60) return {
        color: 'text-red-400',
        bg: 'from-red-500/20 to-red-600/10',
        status: 'Critical'
      };
      if (value > 35) return {
        color: 'text-yellow-400',
        bg: 'from-yellow-500/20 to-yellow-600/10',
        status: 'Warning'
      };
      return {
        color: 'text-green-400',
        bg: 'from-green-500/20 to-green-600/10',
        status: 'Normal'
      };
    }
    return {
      color: 'text-slate-400',
      bg: 'from-slate-500/20 to-slate-600/10',
      status: 'Unknown'
    };
  };
  const smokeStatus = getSensorStatus(device.lastReading.smoke, 'smoke');
  const tempStatus = getSensorStatus(device.lastReading.temperature, 'temp');
  const gasStatus = getSensorStatus(device.lastReading.gas, 'gas');
  return <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="glass-dark rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-blue-600/10 to-transparent"></div>
            <div className="relative p-6 sm:p-8 border-b border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                      <ActivityIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        {device.ownerName}
                      </h2>
                      <p className="text-sm text-slate-400 font-mono">
                        {device.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mt-3">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{device.address}</span>
                  </div>
                </div>
                <button onClick={onClose} className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all duration-300 hover:scale-110">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Device Status */}
          <div className="p-6 sm:p-8 border-b border-slate-700/50">
            <div className="flex flex-wrap items-center gap-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${device.status === 'normal' ? 'bg-green-500/20 border-green-500/30' : device.status === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30' : device.status === 'triggered' ? 'bg-red-500/20 border-red-500/30 animate-pulse' : 'bg-gray-500/20 border-gray-500/30'} border`}>
                <span className={`w-3 h-3 rounded-full ${device.status === 'normal' ? 'bg-green-500' : device.status === 'warning' ? 'bg-yellow-500' : device.status === 'triggered' ? 'bg-red-500' : 'bg-gray-500'} ${device.status === 'triggered' ? 'animate-pulse' : ''}`}></span>
                <span className={`text-sm font-bold uppercase tracking-wider ${device.status === 'normal' ? 'text-green-400' : device.status === 'warning' ? 'text-yellow-400' : device.status === 'triggered' ? 'text-red-400' : 'text-gray-400'}`}>
                  {device.status}
                </span>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${device.isOnline ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'} border`}>
                <span className={`w-2 h-2 rounded-full ${device.isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className={`text-sm font-bold ${device.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {device.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                <ActivityIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">
                  Last Update:{' '}
                  <span className="text-white font-semibold">
                    {device.lastReading.timestamp.toLocaleTimeString()}
                  </span>
                </span>
              </div>
            </div>
          </div>
          {/* Sensor Readings */}
          <div className="p-6 sm:p-8 border-b border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              Live Sensor Readings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Smoke Sensor */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${smokeStatus.bg} border border-white/10 p-5 group hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <CloudIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${smokeStatus.color} bg-white/10`}>
                    {smokeStatus.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-semibold mb-2">
                  Smoke Level
                </p>
                <p className={`text-4xl font-bold ${smokeStatus.color} mb-3`}>
                  {device.lastReading.smoke.toFixed(1)}%
                </p>
                <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${smokeStatus.color === 'text-red-400' ? 'from-red-500 to-red-600' : smokeStatus.color === 'text-yellow-400' ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'} transition-all duration-500`} style={{
                  width: `${device.lastReading.smoke}%`
                }}></div>
                </div>
              </div>
              {/* Temperature Sensor */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tempStatus.bg} border border-white/10 p-5 group hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <ThermometerIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${tempStatus.color} bg-white/10`}>
                    {tempStatus.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-semibold mb-2">
                  Temperature
                </p>
                <p className={`text-4xl font-bold ${tempStatus.color} mb-3`}>
                  {device.lastReading.temperature.toFixed(1)}°C
                </p>
                <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${tempStatus.color === 'text-red-400' ? 'from-red-500 to-red-600' : tempStatus.color === 'text-yellow-400' ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'} transition-all duration-500`} style={{
                  width: `${Math.min(device.lastReading.temperature / 100 * 100, 100)}%`
                }}></div>
                </div>
              </div>
              {/* Gas Sensor */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gasStatus.bg} border border-white/10 p-5 group hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <WindIcon className="w-5 h-5 text-slate-300" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${gasStatus.color} bg-white/10`}>
                    {gasStatus.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 font-semibold mb-2">
                  Gas Level
                </p>
                <p className={`text-4xl font-bold ${gasStatus.color} mb-3`}>
                  {device.lastReading.gas.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">PPM</p>
              </div>
            </div>
          </div>
          {/* Remote Controls */}
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-bold text-white mb-6">
              Remote Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handleTriggerAlarm} className="group relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105">
                <BellIcon className="w-5 h-5 group-hover:animate-pulse" />
                Trigger Alarm
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              <button onClick={handleEnableSuppression} className="group relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105">
                <ShieldIcon className="w-5 h-5 group-hover:animate-pulse" />
                Enable Suppression
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Remote commands will be sent to the device immediately
            </p>
          </div>
        </div>
      </div>
    </div>;
}