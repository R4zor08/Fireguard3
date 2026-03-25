import React, { useEffect, useState } from 'react';
import { RadioIcon, BatteryChargingIcon, SignalIcon, PlusIcon, SettingsIcon, RefreshCwIcon, PowerIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, XIcon, SaveIcon, MapPinIcon, Volume2Icon, VolumeXIcon, LayoutGridIcon, SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useDevicesRealTime } from '../hooks/useDevicesRealTime';
import { Device } from '../types';
import { TANDAG_CENTER } from '../utils/mockData';
export function DeviceManagement() {
  const {
    devices,
    fetchDevices
  } = useDevicesRealTime();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [configSettings, setConfigSettings] = useState({
    autoRefresh: true,
    alertSounds: true,
    displayDensity: 'comfortable' as 'compact' | 'comfortable' | 'spacious'
  });
  const [formData, setFormData] = useState({
    deviceId: '',
    ownerName: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({
    deviceId: '',
    ownerName: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Mobile specific states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'status' | 'name' | 'battery'>('name');
  const [expandedDeviceId, setExpandedDeviceId] = useState<string | null>(null);
  // Auto-refresh effect
  useEffect(() => {
    if (configSettings.autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [configSettings.autoRefresh]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDevices();
    } catch (error) {
      console.error('Failed to refresh devices:', error);
    } finally {
      setIsRefreshing(false);
      setLastRefreshTime(new Date());
    }
  };
  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'triggered':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'offline':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5" />;
      case 'triggered':
        return <XCircleIcon className="w-5 h-5" />;
      case 'offline':
        return <PowerIcon className="w-5 h-5" />;
    }
  };
  // Generate random coordinates near Tandag Center
  const generateCoordinates = () => {
    const latOffset = (Math.random() - 0.5) * 0.02; // ~1km radius
    const lngOffset = (Math.random() - 0.5) * 0.02;
    return {
      latitude: TANDAG_CENTER.lat + latOffset,
      longitude: TANDAG_CENTER.lng + lngOffset
    };
  };
  // Validate form field
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'deviceId':
        if (!value.trim()) {
          error = 'Device ID is required';
        } else if (value.length < 6) {
          error = 'Device ID must be at least 6 characters';
        } else if (devices.some(d => d.id === value)) {
          error = 'Device ID already exists';
        }
        break;
      case 'ownerName':
        if (!value.trim()) {
          error = 'Owner name is required';
        } else if (value.length < 3) {
          error = 'Owner name must be at least 3 characters';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.length < 10) {
          error = 'Please provide a complete address';
        }
        break;
    }
    return error;
  };
  // Handle input change with inline validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Validate on change
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const errors = {
      deviceId: validateField('deviceId', formData.deviceId),
      ownerName: validateField('ownerName', formData.ownerName),
      address: validateField('address', formData.address)
    };
    setFormErrors(errors);
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    // Generate coordinates
    const coords = generateCoordinates();
    // Here you would normally add the device to your state/backend
    console.log('Adding device:', {
      ...formData,
      ...coords,
      status: 'normal',
      isOnline: true,
      batteryLevel: 100,
      signalStrength: -45,
      firmwareVersion: 'v1.2.3'
    });
    // Reset form for next device
    setFormData({
      deviceId: '',
      ownerName: '',
      address: ''
    });
    setFormErrors({
      deviceId: '',
      ownerName: '',
      address: ''
    });
    setIsSubmitting(false);
    // Keep form open for adding multiple devices
    // User can close manually
  };
  // Filter and Sort Logic
  const filteredDevices = devices.filter(device => {
    const query = searchQuery.toLowerCase();
    return device.id.toLowerCase().includes(query) || device.ownerName?.toLowerCase().includes(query) || device.address?.toLowerCase().includes(query);
  }).sort((a, b) => {
    switch (sortBy) {
      case 'status':
        return a.status.localeCompare(b.status);
      case 'battery':
        return (b.batteryLevel || 0) - (a.batteryLevel || 0);
      case 'name':
      default:
        return a.id.localeCompare(b.id);
    }
  });
  const onlineDevices = devices.filter(d => d.isOnline).length;
  const offlineDevices = devices.filter(d => !d.isOnline).length;
  const triggeredDevices = devices.filter(d => d.status === 'triggered').length;
  const toggleDeviceExpand = (deviceId: string) => {
    setExpandedDeviceId(expandedDeviceId === deviceId ? null : deviceId);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden pb-24 sm:pb-8">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-2 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="animate-slide-up px-2 sm:px-0">
          <div className="flex items-center gap-3 mb-2 sm:mb-4">
            <div className="relative">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-white">Device</span>
              <span className="text-gradient-cyan ml-2 sm:ml-3">
                Management
              </span>
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-slate-400 ml-5 sm:ml-7">
            Monitor and manage all registered IoT fire detection devices
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-slide-up delay-100 px-2 sm:px-0">
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-cyan-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <RadioIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {devices.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Total Devices
            </p>
          </div>

          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-green-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {onlineDevices}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Online
            </p>
          </div>

          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-slate-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <PowerIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {offlineDevices}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Offline
            </p>
          </div>

          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700 hover:border-red-500/50 transition-all card-lift">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <AlertTriangleIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {triggeredDevices}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Triggered
            </p>
          </div>
        </div>

        {/* Desktop Actions Bar */}
        <div className="hidden sm:flex flex-wrap items-center gap-3 animate-slide-up delay-200">
          <button onClick={() => setShowAddForm(!showAddForm)} className={`px-4 py-2 ${showAddForm ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-gradient-to-r from-cyan-600 to-blue-600'} text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all btn-press focus-ring flex items-center gap-2 shadow-lg`}>
            {showAddForm ? <XIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
            {showAddForm ? 'Cancel' : 'Add Device'}
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing} className="px-4 py-2 glass border border-slate-700 text-white rounded-xl font-semibold hover:border-cyan-500/50 transition-all btn-press focus-ring flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCwIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => setShowConfigPanel(!showConfigPanel)} className={`px-4 py-2 glass border ${showConfigPanel ? 'border-purple-500/50 bg-purple-500/10' : 'border-slate-700'} text-white rounded-xl font-semibold hover:border-purple-500/50 transition-all btn-press focus-ring flex items-center gap-2`}>
            <SettingsIcon className="w-5 h-5" />
            Configure
          </button>
        </div>

        {/* Refresh Indicator */}
        {isRefreshing && <div className="glass rounded-xl border border-cyan-500/30 overflow-hidden animate-slide-up mx-2 sm:mx-0">
            <div className="p-3 flex items-center gap-3">
              <RefreshCwIcon className="w-4 h-4 text-cyan-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-white">
                  Refreshing device data...
                </p>
                <p className="text-xs text-slate-400">
                  Last updated: {lastRefreshTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>}

        {/* Configure Settings Panel */}
        {showConfigPanel && <div className="glass rounded-xl border border-purple-500/30 overflow-hidden animate-slide-up shadow-lg mx-2 sm:mx-0">
            <div className="p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-b border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">Quick Settings</h3>
              </div>
              <button onClick={() => setShowConfigPanel(false)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Auto-refresh Toggle */}
              <div className="flex items-center justify-between p-3 glass rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  <RefreshCwIcon className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Auto-Refresh
                    </p>
                    <p className="text-xs text-slate-400">Every 30s</p>
                  </div>
                </div>
                <button onClick={() => setConfigSettings(prev => ({
              ...prev,
              autoRefresh: !prev.autoRefresh
            }))} className={`relative w-11 h-6 rounded-full transition-colors ${configSettings.autoRefresh ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${configSettings.autoRefresh ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              {/* Alert Sounds Toggle */}
              <div className="flex items-center justify-between p-3 glass rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                  {configSettings.alertSounds ? <Volume2Icon className="w-4 h-4 text-green-400" /> : <VolumeXIcon className="w-4 h-4 text-slate-400" />}
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Alert Sounds
                    </p>
                    <p className="text-xs text-slate-400">Notifications</p>
                  </div>
                </div>
                <button onClick={() => setConfigSettings(prev => ({
              ...prev,
              alertSounds: !prev.alertSounds
            }))} className={`relative w-11 h-6 rounded-full transition-colors ${configSettings.alertSounds ? 'bg-green-500' : 'bg-slate-700'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${configSettings.alertSounds ? 'translate-x-5' : 'translate-x-0'}`}></span>
                </button>
              </div>

              {/* Display Density */}
              <div className="p-3 glass rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <LayoutGridIcon className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-semibold text-white">
                    Display Density
                  </p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setConfigSettings(prev => ({
                ...prev,
                displayDensity: 'compact'
              }))} className={`flex-1 px-2 py-1 text-xs rounded ${configSettings.displayDensity === 'compact' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'} transition-colors`}>
                    Compact
                  </button>
                  <button onClick={() => setConfigSettings(prev => ({
                ...prev,
                displayDensity: 'comfortable'
              }))} className={`flex-1 px-2 py-1 text-xs rounded ${configSettings.displayDensity === 'comfortable' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'} transition-colors`}>
                    Normal
                  </button>
                  <button onClick={() => setConfigSettings(prev => ({
                ...prev,
                displayDensity: 'spacious'
              }))} className={`flex-1 px-2 py-1 text-xs rounded ${configSettings.displayDensity === 'spacious' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'} transition-colors`}>
                    Spacious
                  </button>
                </div>
              </div>
            </div>
          </div>}

        {/* Inline Add Device Form */}
        {showAddForm && <div className="glass rounded-2xl border-2 border-cyan-500/50 overflow-hidden animate-slide-up shadow-2xl shadow-cyan-500/20 mx-2 sm:mx-0">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-b border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <PlusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Quick Add Device
                    </h3>
                    <p className="text-xs text-cyan-400">
                      Coordinates will be auto-generated
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowAddForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Device ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Device ID <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input type="text" name="deviceId" value={formData.deviceId} onChange={handleInputChange} placeholder="e.g., FG3-TND-001" className={`w-full px-4 py-2.5 bg-slate-900/50 border ${formErrors.deviceId ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`} />
                    <RadioIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  </div>
                  {formErrors.deviceId && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {formErrors.deviceId}
                    </p>}
                </div>

                {/* Owner Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Owner Name <span className="text-red-400">*</span>
                  </label>
                  <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="e.g., Juan Dela Cruz" className={`w-full px-4 py-2.5 bg-slate-900/50 border ${formErrors.ownerName ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`} />
                  {formErrors.ownerName && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {formErrors.ownerName}
                    </p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="e.g., 123 Main St, Tandag City" className={`w-full px-4 py-2.5 bg-slate-900/50 border ${formErrors.address ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all`} />
                    <MapPinIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  </div>
                  {formErrors.address && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangleIcon className="w-3 h-3" />
                      {formErrors.address}
                    </p>}
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-cyan-400 font-semibold">
                      Auto-Generated Coordinates
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      GPS coordinates will be automatically assigned near Tandag
                      City center. You can adjust them later in device settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all btn-press focus-ring flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <>
                      <RefreshCwIcon className="w-5 h-5 animate-spin" />
                      Saving...
                    </> : <>
                      <SaveIcon className="w-5 h-5" />
                      Save & Add Another
                    </>}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 glass border border-slate-700 text-white rounded-xl font-semibold hover:border-slate-600 transition-all btn-press focus-ring">
                  Done
                </button>
              </div>
            </form>
          </div>}

        {/* Device List Container */}
        <div className="glass rounded-xl sm:rounded-2xl border border-slate-700 overflow-hidden animate-slide-up delay-300 mx-2 sm:mx-0">
          {/* List Header & Controls */}
          <div className="p-4 sm:p-6 border-b border-slate-700 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Registered Devices
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {filteredDevices.length} devices found
                </p>
              </div>

              {/* Mobile Search & Sort */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search devices..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20" />
                </div>

                <div className="relative sm:w-40">
                  <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full pl-9 pr-8 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 appearance-none">
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                    <option value="battery">Sort by Battery</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredDevices.length === 0 ? <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No devices found
              </h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                {searchQuery ? `No devices matching "${searchQuery}"` : "You haven't added any devices yet."}
              </p>
              {!searchQuery && <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg">
                  Add Your First Device
                </button>}
            </div> : <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/40">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Device ID
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Owner
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Location
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Battery
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Signal
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Firmware
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.map(device => <tr key={device.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <RadioIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-mono text-white">
                              {device.id}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-300">
                            {device.ownerName}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-400">
                            {device.address}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(device.status)}`}>
                            {getStatusIcon(device.status)}
                            <span className="text-xs font-semibold uppercase">
                              {device.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BatteryChargingIcon className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-slate-300">
                              {device.batteryLevel || 85}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <SignalIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-slate-300">
                              {device.signalStrength || -45} dBm
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-mono text-slate-400">
                            {device.firmwareVersion || 'v1.2.3'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Configure
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="sm:hidden divide-y divide-slate-800">
                {filteredDevices.map(device => <div key={device.id} className="bg-slate-900/20">
                    {/* Card Header - Always Visible */}
                    <div className="p-4 flex items-center justify-between active:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleDeviceExpand(device.id)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getStatusColor(device.status).replace('text-', 'border-').split(' ')[2]?.replace('border-', '') || 'slate-700'} bg-slate-800/50`}>
                          {getStatusIcon(device.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">
                              {device.id}
                            </h3>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getStatusColor(device.status)}`}>
                              {device.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">
                            {device.ownerName}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-400">
                        {expandedDeviceId === device.id ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Card Body - Expandable */}
                    {expandedDeviceId === device.id && <div className="px-4 pb-4 pt-0 animate-slide-down">
                        <div className="bg-slate-800/30 rounded-lg p-3 space-y-3 text-sm">
                          <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                            <span className="text-slate-400 flex items-center gap-2">
                              <MapPinIcon className="w-3.5 h-3.5" /> Address
                            </span>
                            <span className="text-slate-200 text-right max-w-[60%] truncate">
                              {device.address}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                              <span className="text-xs text-slate-500 block mb-1">
                                Battery
                              </span>
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <BatteryChargingIcon className="w-3.5 h-3.5 text-green-400" />
                                {device.batteryLevel || 85}%
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                              <span className="text-xs text-slate-500 block mb-1">
                                Signal
                              </span>
                              <div className="flex items-center gap-1.5 text-slate-200">
                                <SignalIcon className="w-3.5 h-3.5 text-cyan-400" />
                                {device.signalStrength || -45} dBm
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-xs text-slate-500 font-mono">
                              FW: {device.firmwareVersion || 'v1.2.3'}
                            </span>
                            <button className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded text-xs font-medium hover:bg-cyan-500/20 transition-colors">
                              Configure Device
                            </button>
                          </div>
                        </div>
                      </div>}
                  </div>)}
              </div>
            </>}
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 sm:hidden z-30 pb-safe">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddForm(true)} className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add Device
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing} className="p-3 glass border border-slate-700 text-white rounded-xl active:scale-95 transition-transform disabled:opacity-50">
            <RefreshCwIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowConfigPanel(true)} className="p-3 glass border border-slate-700 text-white rounded-xl active:scale-95 transition-transform">
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>;
}