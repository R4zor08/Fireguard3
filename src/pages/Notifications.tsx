import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InboxIcon, BellIcon, AlertTriangleIcon, WrenchIcon, InfoIcon, CheckIcon, TrashIcon, FilterIcon, CheckSquareIcon, XIcon, Loader2Icon } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types';
export function Notifications() {
  const navigate = useNavigate();
  const { notifications: liveNotifications, loading: liveLoading } = useNotifications();
  // --- State ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setNotifications(liveNotifications);
  }, [liveNotifications]);
  // --- Helpers ---
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'maintenance':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'info':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <BellIcon className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangleIcon className="w-5 h-5" />;
      case 'maintenance':
        return <WrenchIcon className="w-5 h-5" />;
      case 'info':
        return <InfoIcon className="w-5 h-5" />;
    }
  };
  // --- Actions ---
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };
  const selectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };
  const handleBatchMarkRead = () => {
    setNotifications(prev => prev.map(n => selectedIds.has(n.id) ? {
      ...n,
      read: true
    } : n));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };
  const handleBatchDelete = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      read: true
    })));
  };
  const handleNotificationClick = (notification: Notification) => {
    if (isSelectionMode) {
      toggleSelection(notification.id);
      return;
    }
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notification.id ? {
      ...n,
      read: true
    } : n));
    // Navigate
    navigate('/app/analytics', {
      state: {
        fromNotification: true,
        notificationId: notification.id,
        incidentTitle: notification.title
      }
    });
  };
  // --- Filtering ---
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const isLoading = liveLoading;
  return <div className="min-h-screen bg-slate-950 relative">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-900/10 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Action Bar */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60 shadow-lg transition-all duration-300">
          <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Title & Filter */}
              <div className="flex items-center gap-3">
                {isSelectionMode ? <div className="flex items-center gap-3 animate-fade-in">
                    <button onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedIds(new Set());
                }} className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                      <XIcon className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-white">
                      {selectedIds.size} Selected
                    </span>
                  </div> : <>
                    <div className="relative">
                      <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all">
                        <FilterIcon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">
                          {filter}
                        </span>
                      </button>

                      {/* Filter Dropdown */}
                      {isFilterOpen && <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                          <div className="absolute top-full left-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {(['all', 'unread', 'read'] as const).map(f => <button key={f} onClick={() => {
                        setFilter(f);
                        setIsFilterOpen(false);
                      }} className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-800 transition-colors ${filter === f ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-300'}`}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                              </button>)}
                          </div>
                        </>}
                    </div>
                  </>}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {isSelectionMode ? <div className="flex items-center gap-2 animate-fade-in">
                    <button onClick={selectAll} className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" title="Select All">
                      <CheckSquareIcon className="w-5 h-5" />
                    </button>
                    {selectedIds.size > 0 && <>
                        <button onClick={handleBatchMarkRead} className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors" title="Mark Selected as Read">
                          <CheckIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleBatchDelete} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Selected">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </>}
                  </div> : <div className="flex items-center gap-2">
                    <button onClick={markAllRead} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-cyan-400 hover:bg-cyan-950/30 transition-colors">
                      <CheckIcon className="w-4 h-4" />
                      Mark All Read
                    </button>
                    <button onClick={() => setIsSelectionMode(true)} className="p-2 rounded-lg bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors" title="Select Notifications">
                      <CheckSquareIcon className="w-5 h-5" />
                    </button>
                  </div>}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Header Text (Desktop only) */}
          <div className="hidden sm:block mb-6 px-2">
            <h1 className="text-2xl font-bold text-white mb-1">
              Notifications
            </h1>
            <p className="text-slate-400 text-sm">
              Stay updated with system alerts and events
            </p>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 && !isLoading ? <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-700">
                  <InboxIcon className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  All caught up!
                </h3>
                <p className="text-slate-400 max-w-xs mx-auto">
                  You have no {filter !== 'all' ? filter : ''} notifications at
                  the moment.
                </p>
                {filter !== 'all' && <button onClick={() => setFilter('all')} className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium transition-colors">
                    View All Notifications
                  </button>}
              </div> : filteredNotifications.map((notification, index) => <div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`
                    group relative overflow-hidden rounded-xl border transition-all duration-200 cursor-pointer
                    ${isSelectionMode && selectedIds.has(notification.id) ? 'bg-cyan-900/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : notification.read ? 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 shadow-md'}
                  `} style={{
            animationDelay: `${index * 50}ms`
          }}>
                  {/* Unread Indicator Dot */}
                  {!notification.read && !isSelectionMode && <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse" />}

                  <div className="flex items-start p-4 sm:p-5 gap-4">
                    {/* Selection Checkbox */}
                    {isSelectionMode && <div className="flex items-center self-center animate-in slide-in-from-left-2 duration-200">
                        <div className={`
                          w-5 h-5 rounded border flex items-center justify-center transition-colors
                          ${selectedIds.has(notification.id) ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-slate-600 bg-slate-800/50'}
                        `}>
                          {selectedIds.has(notification.id) && <CheckIcon className="w-3.5 h-3.5" />}
                        </div>
                      </div>}

                    {/* Icon */}
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105
                      ${getTypeColor(notification.type)}
                    `}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-base sm:text-lg font-semibold truncate pr-6 ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        {!isSelectionMode && <span className="text-xs text-slate-500 whitespace-nowrap flex-shrink-0 hidden sm:block">
                            {notification.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                          </span>}
                      </div>

                      <p className={`text-sm sm:text-base line-clamp-2 mb-3 ${notification.read ? 'text-slate-500' : 'text-slate-300'}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <span className="text-slate-500 sm:hidden">
                          {notification.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </span>
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider
                          ${notification.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : notification.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}
                        `}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>)}

            {/* Loading Indicator */}
            <div className="py-8 flex justify-center">
              {isLoading && <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                  <Loader2Icon className="w-5 h-5 animate-spin text-cyan-500" />
                  <span className="text-sm">Loading...</span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
}