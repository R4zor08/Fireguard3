import React, { useEffect, useMemo, useState, Fragment, createElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, SearchIcon, FilterIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon, ActivityIcon, DownloadIcon, FileTextIcon, TableIcon } from 'lucide-react';
import { Alert, AlertType } from './AlertHistoryTable';
import { toast } from 'sonner';
interface AlertHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}
export function AlertHistoryModal({
  isOpen,
  onClose,
  alerts
}: AlertHistoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Alert>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const itemsPerPage = 10;
  // ESC key handler and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  // Filter and Sort Logic
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || (alert.details?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || alert.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (!aValue || !bValue) return 0;
      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [alerts, searchQuery, filterType, sortField, sortDirection]);
  // Pagination Logic
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handleSort = (field: keyof Alert) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  const handleExport = (format: 'csv' | 'json') => {
    try {
      const dataToExport = filteredAlerts.map(alert => ({
        ID: alert.id,
        Type: alert.type,
        Message: alert.message,
        Timestamp: alert.timestamp,
        Status: alert.status,
        Details: alert.details || 'N/A'
      }));
      if (format === 'csv') {
        const headers = Object.keys(dataToExport[0]).join(',');
        const rows = dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','));
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `alert_history_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
      } else {
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], {
          type: 'application/json'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `alert_history_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }
      toast.success(`Exported as ${format.toUpperCase()} successfully`);
      setShowExportMenu(false);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };
  const getTypeBadge = (type: AlertType) => {
    const styles = {
      critical: 'bg-red-500/10 text-red-400 border-red-500/30',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      success: 'bg-green-500/10 text-green-400 border-green-500/30',
      info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${styles[type]}`}>
        {type}
      </span>;
  };
  const getStatusBadge = (status: string) => {
    const styles = {
      resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
      active: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
      investigating: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.investigating}`}>
        {status}
      </span>;
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop with improved blur and dimming */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-[60]" />

          {/* Modal Container - Perfectly Centered */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }} className="w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                    <ActivityIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Alert History
                    </h2>
                    <p className="text-sm text-slate-400">
                      Full log of system alerts and incidents
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-all text-sm font-medium">
                      <DownloadIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>

                    <AnimatePresence>
                      {showExportMenu && <motion.div initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }} animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }} exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95
                  }} className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                          <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-2">
                            <TableIcon className="w-4 h-4 text-green-400" />
                            Export as CSV
                          </button>
                          <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700">
                            <FileTextIcon className="w-4 h-4 text-blue-400" />
                            Export as JSON
                          </button>
                        </motion.div>}
                    </AnimatePresence>
                  </div>

                  <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/30 space-y-4 flex-shrink-0">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" />
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <div className="relative min-w-[140px]">
                      <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      <select value={filterType} onChange={e => setFilterType(e.target.value as AlertType | 'all')} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer">
                        <option value="all">All Types</option>
                        <option value="critical">Critical</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-slate-600 transition-all whitespace-nowrap">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Date Range</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm">
                    <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('type')}>
                        Type
                      </th>
                      <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('message')}>
                        Message
                      </th>
                      <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('timestamp')}>
                        Time
                      </th>
                      <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                        Status
                      </th>
                      <th className="px-6 py-4 font-semibold text-right">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedAlerts.length > 0 ? paginatedAlerts.map(alert => <Fragment key={alert.id}>
                          <tr className={`group hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedRow === alert.id ? 'bg-slate-800/30' : ''}`} onClick={() => setExpandedRow(expandedRow === alert.id ? null : alert.id)}>
                            <td className="px-6 py-4">
                              {getTypeBadge(alert.type)}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                {alert.message}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                              {alert.timestamp}
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(alert.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors">
                                {expandedRow === alert.id ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                              </button>
                            </td>
                          </tr>
                          {expandedRow === alert.id && <tr className="bg-slate-800/20">
                              <td colSpan={5} className="px-6 py-4">
                                <div className="text-sm text-slate-300 space-y-2">
                                  <p className="font-semibold text-slate-100">
                                    Detailed Log:
                                  </p>
                                  <p className="text-slate-400 leading-relaxed">
                                    {alert.details || 'No additional details available for this alert.'}
                                  </p>
                                  <div className="pt-2 flex gap-4 text-xs text-slate-500">
                                    <span>ID: #{alert.id}</span>
                                    <span>
                                      Device: {alert.deviceId || 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                            </tr>}
                        </Fragment>) : <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-3">
                            <SearchIcon className="w-12 h-12 opacity-20" />
                            <p>No alerts found matching your criteria</p>
                          </div>
                        </td>
                      </tr>}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center flex-shrink-0">
                <div className="text-sm text-slate-400">
                  Showing{' '}
                  <span className="font-medium text-white">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium text-white">
                    {Math.min(currentPage * itemsPerPage, filteredAlerts.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-white">
                    {filteredAlerts.length}
                  </span>{' '}
                  results
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>}
    </AnimatePresence>;
}