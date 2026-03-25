import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaveIcon, RotateCcwIcon, BellIcon, SmartphoneIcon, MailIcon, WifiIcon, BatteryIcon, SignalIcon, CpuIcon, ThermometerIcon, FlameIcon, WindIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { SensorGauge } from '../components/SensorGauge';
export function UserSettings() {
  const [thresholds, setThresholds] = useState({
    smoke: 30,
    temperature: 45,
    gas: 15
  });
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: true,
    criticalOnly: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  // Debounce auto-save
  useEffect(() => {
    if (hasChanges) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [thresholds, notifications, hasChanges]);
  const handleAutoSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setLastSaved(new Date().toLocaleTimeString());
      setHasChanges(false);
      toast.success('Settings auto-saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date().toLocaleTimeString());
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };
  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      setThresholds({
        smoke: 30,
        temperature: 45,
        gas: 15
      });
      setNotifications({
        push: true,
        email: true,
        sms: true,
        criticalOnly: false
      });
      setHasChanges(true);
      toast.info('Settings reset to defaults');
    }
  };
  const updateThreshold = (key: keyof typeof thresholds, value: number) => {
    setThresholds(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };
  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };
  const getThresholdStatus = (type: 'smoke' | 'temperature' | 'gas', value: number) => {
    if (type === 'smoke') {
      if (value < 20) return {
        color: 'text-red-400',
        message: 'Too sensitive (false alarms likely)'
      };
      if (value > 70) return {
        color: 'text-yellow-400',
        message: 'Low sensitivity (delayed detection)'
      };
    }
    if (type === 'temperature') {
      if (value < 35) return {
        color: 'text-yellow-400',
        message: 'May trigger on hot days'
      };
      if (value > 70) return {
        color: 'text-red-400',
        message: 'Dangerous heat levels only'
      };
    }
    if (type === 'gas') {
      if (value < 10) return {
        color: 'text-red-400',
        message: 'Extremely sensitive'
      };
      if (value > 40) return {
        color: 'text-yellow-400',
        message: 'High tolerance'
      };
    }
    return {
      color: 'text-green-400',
      message: 'Optimal range'
    };
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8 pb-20 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Device Configuration
          </h1>
          <div className="flex items-center gap-3 text-slate-400">
            <p>Manage sensor thresholds and notification preferences</p>
            {lastSaved && <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700 flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3 text-green-500" />
                Saved {lastSaved}
              </span>}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[44px] font-medium">
            <RotateCcwIcon className="w-4 h-4" />
            Reset
          </button>
          <button onClick={handleManualSave} disabled={isSaving || !hasChanges} className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 min-h-[44px]">
            {isSaving ? <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </> : <>
                <SaveIcon className="w-4 h-4" />
                {hasChanges ? 'Save Changes' : 'Saved'}
              </>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Device Info Column */}
        <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{
        animationDelay: '0.1s'
      }}>
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CpuIcon className="w-5 h-5 text-cyan-400" />
              Device Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 text-sm font-medium">
                  Device ID
                </span>
                <span className="text-white font-mono text-sm font-semibold">
                  USR-001-XYZ
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 text-sm font-medium">
                  Firmware
                </span>
                <span className="text-white font-mono text-sm font-semibold">
                  v2.4.1
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <span className="text-slate-300 text-sm font-medium">
                  Last Sync
                </span>
                <span className="text-white text-sm font-semibold">
                  Just now
                </span>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <WifiIcon className="w-6 h-6 text-green-400" />
                <span className="text-xs text-slate-300 font-semibold">
                  Online
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <BatteryIcon className="w-6 h-6 text-cyan-400" />
                <span className="text-xs text-slate-300 font-semibold">
                  87%
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                <SignalIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-xs text-slate-300 font-semibold">
                  Good
                </span>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Current Reading</span>
                  <span className="text-white font-bold">12%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[12%]"></div>
                </div>
                <div className="mt-2 text-xs text-slate-500 flex justify-between">
                  <span>Alert triggers at {thresholds.smoke}%</span>
                  <span className="text-cyan-400">Normal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{
        animationDelay: '0.2s'
      }}>
          {/* Alert Thresholds */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FlameIcon className="w-5 h-5 text-red-400" />
              Smart Alert Thresholds
            </h3>

            <div className="space-y-8">
              {/* Smoke Threshold */}
              <div className="space-y-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex justify-between items-center">
                  <label htmlFor="smoke-threshold" className="text-slate-100 font-semibold flex items-center gap-2">
                    <FlameIcon className="w-4 h-4 text-slate-400" />
                    Smoke Sensitivity
                  </label>
                  <span className="text-cyan-400 font-bold text-lg">
                    {thresholds.smoke}%
                  </span>
                </div>
                <input id="smoke-threshold" type="range" min="10" max="90" value={thresholds.smoke} onChange={e => updateThreshold('smoke', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Low (10%)</span>
                  <span className={getThresholdStatus('smoke', thresholds.smoke).color}>
                    {getThresholdStatus('smoke', thresholds.smoke).message}
                  </span>
                  <span className="text-slate-500">High (90%)</span>
                </div>
              </div>

              {/* Temp Threshold */}
              <div className="space-y-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex justify-between items-center">
                  <label htmlFor="temp-threshold" className="text-slate-100 font-semibold flex items-center gap-2">
                    <ThermometerIcon className="w-4 h-4 text-slate-400" />
                    Temperature Alert
                  </label>
                  <span className="text-red-400 font-bold text-lg">
                    {thresholds.temperature}°C
                  </span>
                </div>
                <input id="temp-threshold" type="range" min="30" max="80" value={thresholds.temperature} onChange={e => updateThreshold('temperature', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">30°C</span>
                  <span className={getThresholdStatus('temperature', thresholds.temperature).color}>
                    {getThresholdStatus('temperature', thresholds.temperature).message}
                  </span>
                  <span className="text-slate-500">80°C</span>
                </div>
              </div>

              {/* Gas Threshold */}
              <div className="space-y-3 p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex justify-between items-center">
                  <label htmlFor="gas-threshold" className="text-slate-100 font-semibold flex items-center gap-2">
                    <WindIcon className="w-4 h-4 text-slate-400" />
                    Gas Level Limit
                  </label>
                  <span className="text-yellow-400 font-bold text-lg">
                    {thresholds.gas} ppm
                  </span>
                </div>
                <input id="gas-threshold" type="range" min="5" max="50" value={thresholds.gas} onChange={e => updateThreshold('gas', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-900" />
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Sensitive (5 ppm)</span>
                  <span className={getThresholdStatus('gas', thresholds.gas).color}>
                    {getThresholdStatus('gas', thresholds.gas).message}
                  </span>
                  <span className="text-slate-500">Tolerant (50 ppm)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-blue-400" />
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl">
                    <SmartphoneIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      Push Notifications
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Receive alerts on your mobile device
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.push} onChange={e => updateNotification('push', e.target.checked)} className="sr-only peer" aria-label="Enable push notifications" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl">
                    <MailIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email Alerts</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Weekly reports and critical warnings
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.email} onChange={e => updateNotification('email', e.target.checked)} className="sr-only peer" aria-label="Enable email alerts" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-500/10 rounded-xl">
                    <SmartphoneIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">SMS Alerts</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Emergency text messages
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={notifications.sms} onChange={e => updateNotification('sms', e.target.checked)} className="sr-only peer" aria-label="Enable SMS alerts" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}