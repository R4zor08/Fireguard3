import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ThermometerIcon, FlameIcon, MapPinIcon, FileTextIcon, Loader2Icon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    deviceId: string;
    temperature: number;
    smokeLevel: number;
    status: string;
    location?: string;
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export function CreateAlertModal({ isOpen, onClose, onSubmit }: CreateAlertModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    deviceId: '',
    temperature: 25,
    smokeLevel: 5,
    status: 'SAFE',
    location: '',
    notes: '',
  });

  const statusOptions = [
    { value: 'SAFE', label: 'Safe', icon: CheckCircleIcon, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    { value: 'WARNING', label: 'Warning', icon: InfoIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    { value: 'ALERT', label: 'Alert', icon: AlertTriangleIcon, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!formData.deviceId.trim()) {
        throw new Error('Device ID is required');
      }

      const result = await onSubmit(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create alert');
      }

      setSuccess('Alert created successfully!');
      setTimeout(() => {
        onClose();
        setFormData({
          deviceId: '',
          temperature: 25,
          smokeLevel: 5,
          status: 'SAFE',
          location: '',
          notes: '',
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-red-950/50 to-slate-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <AlertTriangleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Create Alert</h2>
                      <p className="text-sm text-slate-400">Report a new fire monitoring event</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
                  >
                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm"
                  >
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                    {success}
                  </motion.div>
                )}

                {/* Device ID */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Device ID *</label>
                  <input
                    type="text"
                    value={formData.deviceId}
                    onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                    placeholder="e.g., DEVICE-001"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                {/* Temperature & Smoke Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <ThermometerIcon className="w-4 h-4 text-orange-400" />
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <FlameIcon className="w-4 h-4 text-red-400" />
                      Smoke Level (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.smokeLevel}
                      onChange={(e) => setFormData({ ...formData, smokeLevel: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {statusOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = formData.status === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: option.value })}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                            isSelected
                              ? `${option.bg} ${option.border} ${option.color}`
                              : 'bg-slate-950/50 border-slate-700 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-cyan-400" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Building A, Floor 2"
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <FileTextIcon className="w-4 h-4 text-purple-400" />
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional details about this alert..."
                    rows={3}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-all border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Alert'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
