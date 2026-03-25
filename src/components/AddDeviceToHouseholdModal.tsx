import React, { useState } from 'react';
import { XIcon, PlusIcon, QrCodeIcon, RadioIcon, MapPinIcon, AlertTriangleIcon, CheckCircleIcon, Loader2Icon, SmartphoneIcon } from 'lucide-react';
interface AddDeviceToHouseholdModalProps {
  householdId: string;
  householdName: string;
  onClose: () => void;
  onSave: (deviceData: any) => void;
}
export function AddDeviceToHouseholdModal({
  householdId,
  householdName,
  onClose,
  onSave
}: AddDeviceToHouseholdModalProps) {
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceType: 'smoke_detector',
    location: ''
  });
  const [errors, setErrors] = useState({
    deviceId: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'deviceId':
        if (!value.trim()) error = 'Device ID is required';else if (value.length < 6) error = 'Device ID must be at least 6 chars';
        break;
      case 'location':
        if (!value.trim()) error = 'Location is required';
        break;
    }
    return error;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name !== 'deviceType') {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };
  const handleScanQR = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      // Generate random device ID
      const randomId = `FG3-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData(prev => ({
        ...prev,
        deviceId: randomId
      }));
      setErrors(prev => ({
        ...prev,
        deviceId: ''
      }));
      setIsScanning(false);
    }, 1500);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      deviceId: validateField('deviceId', formData.deviceId),
      location: validateField('location', formData.location)
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave({
      ...formData,
      householdId,
      status: 'normal',
      isOnline: true,
      lastReading: {
        smoke: 0,
        temperature: 25,
        gas: 0,
        timestamp: new Date()
      }
    });
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  return <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg glass-dark border border-slate-700 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Device</h2>
            <p className="text-sm text-slate-400">For: {householdName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Device ID with Scan Button */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Device ID <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input type="text" name="deviceId" value={formData.deviceId} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.deviceId ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="Scan or enter ID" />
                <RadioIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              </div>
              <button type="button" onClick={handleScanQR} disabled={isScanning} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-white transition-colors flex items-center gap-2 disabled:opacity-50">
                {isScanning ? <Loader2Icon className="w-5 h-5 animate-spin" /> : <QrCodeIcon className="w-5 h-5" />}
                <span className="hidden sm:inline">Scan</span>
              </button>
            </div>
            {errors.deviceId && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.deviceId}
              </p>}
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Device Type <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select name="deviceType" value={formData.deviceType} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10 appearance-none">
                <option value="smoke_detector">Smoke Detector</option>
                <option value="heat_sensor">Heat Sensor</option>
                <option value="gas_sensor">Gas Leak Sensor</option>
                <option value="multi_sensor">Multi-Sensor (All-in-One)</option>
              </select>
              <SmartphoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Location in House <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.location ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="e.g. Kitchen, Master Bedroom" />
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            {errors.location && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.location}
              </p>}
          </div>

          {/* Info Box */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex gap-3">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <RadioIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Auto-Connection
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Device will automatically connect to the network once powered
                on.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700 mt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 glass border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || showSuccess} className={`flex-1 px-4 py-3 bg-gradient-to-r ${showSuccess ? 'from-green-600 to-emerald-600' : 'from-cyan-600 to-blue-600'} text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isSubmitting ? <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Registering...
                </> : showSuccess ? <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Added!
                </> : <>
                  <PlusIcon className="w-5 h-5" />
                  Register Device
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>;
}