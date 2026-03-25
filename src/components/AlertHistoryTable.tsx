import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, AlertTriangleIcon, InfoIcon, CheckCircleIcon, FlameIcon, FilterIcon, SearchIcon, ActivityIcon } from 'lucide-react';
export type AlertType = 'critical' | 'warning' | 'info' | 'success';
export interface Alert {
  id: string | number;
  type: AlertType;
  message: string;
  timestamp: string;
  details?: string;
  status: 'resolved' | 'active' | 'investigating';
}
interface AlertHistoryTableProps {
  alerts: Alert[];
  onViewFullHistory?: () => void;
}
export function AlertHistoryTable({
  alerts,
  onViewFullHistory
}: AlertHistoryTableProps) {
  const [sortField, setSortField] = useState<keyof Alert>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<AlertType | 'all'>('all');
  const [expandedRow, setExpandedRow] = useState<string | number | null>(null);
  const handleSort = (field: keyof Alert) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  const filteredAlerts = alerts.filter(alert => filter === 'all' || alert.type === filter).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (!aValue || !bValue) return 0;
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'critical':
        return <FlameIcon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      default:
        return <InfoIcon className="w-5 h-5 text-cyan-400" />;
    }
  };
  const getTypeBadge = (type: AlertType) => {
    const styles = {
      critical: 'bg-red-500/10 text-red-400 border-red-500/30',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      success: 'bg-green-500/10 text-green-400 border-green-500/30',
      info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${styles[type]}`}>
        {getIcon(type)}
        <span className="text-sm font-semibold capitalize">{type}</span>
      </div>;
  };
  const getStatusBadge = (status: string) => {
    const styles = {
      resolved: 'bg-green-500/10 text-green-400 border-green-500/30',
      active: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
      investigating: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    };
    return <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.investigating}`}>
        {status}
      </span>;
  };
  return <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl overflow-hidden">
      {/* Header Controls */}
      <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50">
            <ActivityIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Alert History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {filteredAlerts.length} total alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select value={filter} onChange={e => setFilter(e.target.value as AlertType | 'all')} className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 appearance-none cursor-pointer hover:border-slate-600 transition-all min-h-[44px]" aria-label="Filter alerts by type">
              <option value="all">All Alerts</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-300 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white hover:bg-slate-800/70 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500" onClick={() => handleSort('type')} onKeyDown={e => e.key === 'Enter' && handleSort('type')} tabIndex={0} role="button" aria-label="Sort by type">
                Type
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white hover:bg-slate-800/70 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500" onClick={() => handleSort('message')} onKeyDown={e => e.key === 'Enter' && handleSort('message')} tabIndex={0} role="button" aria-label="Sort by message">
                Message
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white hover:bg-slate-800/70 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500" onClick={() => handleSort('timestamp')} onKeyDown={e => e.key === 'Enter' && handleSort('timestamp')} tabIndex={0} role="button" aria-label="Sort by time">
                Time
              </th>
              <th className="px-6 py-4 font-semibold cursor-pointer hover:text-white hover:bg-slate-800/70 transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500" onClick={() => handleSort('status')} onKeyDown={e => e.key === 'Enter' && handleSort('status')} tabIndex={0} role="button" aria-label="Sort by status">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <AnimatePresence>
              {filteredAlerts.length > 0 ? filteredAlerts.map(alert => <Fragment key={alert.id}>
                    <motion.tr initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} exit={{
                opacity: 0
              }} className={`group hover:bg-slate-800/30 transition-colors cursor-pointer ${expandedRow === alert.id ? 'bg-slate-800/30' : ''}`} onClick={() => setExpandedRow(expandedRow === alert.id ? null : alert.id)} onKeyDown={e => e.key === 'Enter' && setExpandedRow(expandedRow === alert.id ? null : alert.id)} tabIndex={0} role="button" aria-expanded={expandedRow === alert.id} aria-label={`Alert: ${alert.message}. Press Enter to ${expandedRow === alert.id ? 'collapse' : 'expand'} details`}>
                      <td className="px-6 py-4">{getTypeBadge(alert.type)}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-100 group-hover:text-white transition-colors">
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
                        <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[44px] min-h-[44px] inline-flex items-center justify-center" aria-label={expandedRow === alert.id ? 'Collapse details' : 'Expand details'} onClick={e => {
                    e.stopPropagation();
                    setExpandedRow(expandedRow === alert.id ? null : alert.id);
                  }}>
                          {expandedRow === alert.id ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                        </button>
                      </td>
                    </motion.tr>

                    {expandedRow === alert.id && <motion.tr initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: 'auto'
              }} exit={{
                opacity: 0,
                height: 0
              }}>
                        <td colSpan={5} className="px-6 py-4 bg-slate-800/20 border-t border-slate-800/50">
                          <div className="text-sm text-slate-300 leading-relaxed">
                            <p className="font-semibold text-slate-100 mb-2">
                              Detailed Log:
                            </p>
                            <p className="text-slate-400">
                              {alert.details || 'No additional details available for this alert.'}
                            </p>
                          </div>
                        </td>
                      </motion.tr>}
                  </Fragment>) : <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <SearchIcon className="w-12 h-12 opacity-30" />
                      <p className="text-base font-medium">
                        No alerts found matching current filter
                      </p>
                    </div>
                  </td>
                </tr>}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 bg-slate-900/40 backdrop-blur-sm flex justify-between items-center text-sm text-slate-400">
        <span className="font-medium">
          Showing {filteredAlerts.length} alerts
        </span>
        <button onClick={onViewFullHistory} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-3 py-1.5 min-h-[44px]">
          See more...
        </button>
      </div>
    </div>;
}