import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, WrenchIcon, CheckCircleIcon, ClockIcon, BatteryIcon, ShieldCheckIcon, RefreshCwIcon, ServerIcon, CpuIcon } from 'lucide-react';
interface MaintenanceLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface MaintenanceEvent {
  id: string;
  type: 'check' | 'update' | 'battery' | 'repair';
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  status: 'completed' | 'scheduled' | 'in_progress';
}
export function MaintenanceLogModal({
  isOpen,
  onClose
}: MaintenanceLogModalProps) {
  // Mock Data
  const events: MaintenanceEvent[] = [{
    id: '1',
    type: 'check',
    title: 'Routine Diagnostic Check',
    description: 'All sensors passed sensitivity tests. Network latency within optimal range (12ms).',
    timestamp: 'Today, 09:00 AM',
    performedBy: 'System (Automated)',
    status: 'completed'
  }, {
    id: '2',
    type: 'update',
    title: 'Firmware Update v2.4.1',
    description: 'Security patches applied. Improved smoke detection algorithm installed.',
    timestamp: 'Yesterday, 02:30 AM',
    performedBy: 'System (Automated)',
    status: 'completed'
  }, {
    id: '3',
    type: 'battery',
    title: 'Battery Health Check',
    description: 'Battery level at 87%. Estimated remaining life: 14 months before replacement.',
    timestamp: 'Jan 15, 2025',
    performedBy: 'Admin (Technician)',
    status: 'completed'
  }, {
    id: '4',
    type: 'repair',
    title: 'Sensor Calibration',
    description: 'Gas sensor recalibrated to adjust for ambient humidity changes.',
    timestamp: 'Jan 10, 2025',
    performedBy: 'Admin (Technician)',
    status: 'completed'
  }, {
    id: '5',
    type: 'check',
    title: 'Network Connectivity Test',
    description: 'Signal strength verified at 92%. Backup cellular connection tested successfully.',
    timestamp: 'Jan 01, 2025',
    performedBy: 'System (Automated)',
    status: 'completed'
  }];
  const getIcon = (type: MaintenanceEvent['type']) => {
    switch (type) {
      case 'check':
        return <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />;
      case 'update':
        return <RefreshCwIcon className="w-5 h-5 text-blue-400" />;
      case 'battery':
        return <BatteryIcon className="w-5 h-5 text-yellow-400" />;
      case 'repair':
        return <WrenchIcon className="w-5 h-5 text-orange-400" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-slate-400" />;
    }
  };
  const getStatusBadge = (status: MaintenanceEvent['status']) => {
    const styles = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      in_progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[status]}`}>
        {status.replace('_', ' ')}
      </span>;
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" />

          {/* Modal */}
          <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-3xl md:h-[80vh] bg-slate-900 border-0 md:border border-slate-800 md:rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <WrenchIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Maintenance Log
                  </h2>
                  <p className="text-sm text-slate-400">
                    System health and maintenance history
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar p-4 sm:p-6 space-y-8">
              {/* System Health Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      System Status
                    </p>
                    <p className="text-lg font-bold text-white">Healthy</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BatteryIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Battery
                    </p>
                    <p className="text-lg font-bold text-white">87%</p>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Next Check
                    </p>
                    <p className="text-lg font-bold text-white">75 Days</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative pl-4 sm:pl-0">
                {/* Vertical Line */}
                <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-slate-800 transform sm:-translate-x-1/2"></div>

                <div className="space-y-8">
                  {events.map((event, index) => <div key={event.id} className={`relative flex flex-col sm:flex-row items-start ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                      {/* Timeline Dot */}
                      <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-500 transform -translate-x-1/2 mt-1.5 z-10 shadow-[0_0_0_4px_rgba(15,23,42,1)]"></div>

                      {/* Content Card */}
                      <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getIcon(event.type)}
                              <span className="font-semibold text-white">
                                {event.title}
                              </span>
                            </div>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700/50 pt-3">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{event.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ServerIcon className="w-3 h-3" />
                              <span>{event.performedBy}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </motion.div>
        </>}
    </AnimatePresence>;
}