import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboardIcon, BellIcon, RadioIcon, HomeIcon, NetworkIcon, InboxIcon, MenuIcon, XIcon, ChevronDownIcon, ChevronRightIcon, SatelliteIcon, LogOutIcon, PhoneIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';
import { useAuth } from '../hooks/useAuth';
interface DashboardLayoutProps {
  children: React.ReactNode;
  userMode?: boolean;
}
interface NavItem {
  path: string;
  icon: any;
  label: string;
  badge?: number;
  subItems?: {
    path: string;
    label: string;
  }[];
}
export function DashboardLayout({
  children,
  userMode = false
}: DashboardLayoutProps) {
  const location = useLocation();
  const {
    logout,
    user
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };
  const adminNavItems: NavItem[] = [{
    path: '/app',
    icon: LayoutDashboardIcon,
    label: 'Dashboard Overview'
  }, {
    path: '/app/satellite',
    icon: SatelliteIcon,
    label: 'Satellite Monitoring'
  }, {
    path: '/app/alerts',
    icon: BellIcon,
    label: 'Alerts & Incidents',
    badge: 3
  }, {
    path: '/app/devices',
    icon: RadioIcon,
    label: 'Device Management'
  }, {
    path: '/app/households',
    icon: HomeIcon,
    label: 'Household Monitoring'
  }, {
    path: '/app/network',
    icon: NetworkIcon,
    label: 'Network Connectivity'
  }, {
    path: '/app/notifications',
    icon: InboxIcon,
    label: 'Notifications Center',
    badge: 5
  }];
  const userNavItems: NavItem[] = [{
    path: '/app/user-dashboard',
    icon: LayoutDashboardIcon,
    label: 'My Dashboard'
  }, {
    path: '/app/user-dashboard/alerts',
    icon: BellIcon,
    label: 'My Alerts',
    badge: 1
  }, {
    path: '/app/user-dashboard/contacts',
    icon: PhoneIcon,
    label: 'Emergency Contacts'
  }, {
    path: '/app/user-dashboard/profile',
    icon: UserIcon,
    label: 'My Profile'
  }];
  const navItems = userMode ? userNavItems : adminNavItems;
  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => prev.includes(path) ? prev.filter(item => item !== path) : [...prev, path]);
  };
  const isActive = (path: string) => {
    if (path === '/app' || path === '/app/user-dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  return <div className="flex h-screen bg-slate-950 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-slate-900 dark:bg-slate-900 border-r border-slate-800 dark:border-slate-700 flex-col relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-cyan-950/20 opacity-50"></div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-slate-800 dark:border-slate-700">
          <Link to={userMode ? '/app/user-dashboard' : '/app'} className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center glow-red transition-transform duration-300 group-hover:scale-110 ring-2 ring-red-500/30 ring-offset-2 ring-offset-slate-900 overflow-hidden">
              <img src="/Gemini_Generated_Image_gmlzg8gmlzg8gmlz.png" alt="FIREGUARD3" className="w-full h-full object-cover rounded-full" />
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white group-hover:text-gradient-fire transition-colors">
                FIREGUARD3
              </h1>
              <p className="text-xs text-cyan-400 font-medium tracking-wider">
                {userMode ? 'USER PORTAL' : 'BFP COMMAND CENTER'}
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.includes(item.path);
          return <div key={item.path}>
                <Link to={item.path} onClick={e => {
              if (hasSubItems) {
                e.preventDefault();
                toggleExpanded(item.path);
              }
            }} className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${active ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg glow-red' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 dark:hover:bg-slate-800/50'}`}>
                  {active && <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 blur-xl opacity-50"></div>}
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    {item.badge && <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}>
                        {item.badge}
                      </span>}
                    {hasSubItems && (isExpanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />)}
                  </div>
                </Link>

                {/* Sub Items */}
                {hasSubItems && isExpanded && <div className="ml-4 mt-1 space-y-1 animate-slide-up">
                    {item.subItems!.map(subItem => <Link key={subItem.path} to={subItem.path} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/30 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        {subItem.label}
                      </Link>)}
                  </div>}
              </div>;
        })}
        </nav>

        {/* Footer with Logout */}
        <div className="relative z-10 p-4 border-t border-slate-800 dark:border-slate-700 glass-dark">
          <div className="text-xs text-slate-400 space-y-1 mb-3">
            <p className="font-semibold text-cyan-400">
              {user?.name || 'User'}
            </p>
            <p>{user?.email}</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse glow-green"></div>
              <span className="text-green-400 font-medium">System Online</span>
            </div>
          </div>

          {/* Logout Button */}
          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl font-semibold transition-all border border-red-500/20 hover:border-red-500/40">
            <LogOutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] glass-dark border-b border-slate-800 dark:border-slate-700 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <Link to={userMode ? '/app/user-dashboard' : '/app'} className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center ring-1 ring-red-500/30 ring-offset-1 ring-offset-slate-900 overflow-hidden">
              <img src="/Gemini_Generated_Image_gmlzg8gmlzg8gmlz.png" alt="FIREGUARD3" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-base font-bold text-white block">
                FIRE<span className="text-gradient-fire">GUARD3</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-medium tracking-wider">
                {userMode ? 'USER PORTAL' : 'BFP COMMAND'}
              </span>
            </div>
          </Link>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 hover:bg-slate-800 dark:hover:bg-slate-800 rounded-lg transition-colors focus-ring" aria-label="Toggle menu">
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay with Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} transition={{
          duration: 0.2
        }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-[9998] lg:hidden" aria-hidden="true" />

            {/* Menu Panel */}
            <motion.div initial={{
          x: '-100%',
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} exit={{
          x: '-100%',
          opacity: 0
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200
        }} className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 z-[9999] lg:hidden overflow-hidden border-r border-slate-800">
              {/* Menu Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <Link to={userMode ? '/app/user-dashboard' : '/app'} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center ring-1 ring-red-500/30 overflow-hidden">
                    <img src="/Gemini_Generated_Image_gmlzg8gmlzg8gmlz.png" alt="FIREGUARD3" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white block">
                      FIRE<span className="text-gradient-fire">GUARD3</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-medium tracking-wider">
                      {userMode ? 'USER PORTAL' : 'BFP COMMAND CENTER'}
                    </span>
                  </div>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors" aria-label="Close menu">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-2 h-[calc(100%-240px)] overflow-y-auto custom-scrollbar">
                {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center justify-between gap-3 px-4 py-4 rounded-xl transition-all ${active ? 'bg-gradient-to-r from-red-600 to-red-700 text-white glow-red' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6" />
                        <span className="font-medium text-base">
                          {item.label}
                        </span>
                      </div>
                      {item.badge && <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-400'}`}>
                          {item.badge}
                        </span>}
                    </Link>;
            })}
              </nav>

              {/* Menu Footer with Logout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm space-y-3">
                {/* Logout Button */}
                <button onClick={() => {
              setMobileMenuOpen(false);
              setShowLogoutModal(true);
            }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-xl font-semibold transition-all border border-red-500/20 hover:border-red-500/40">
                  <LogOutIcon className="w-5 h-5" />
                  Logout
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse glow-green"></div>
                  <span className="text-green-400 font-medium text-sm">
                    System Online
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  &copy; 2025 Bureau of Fire Protection
                  <br />
                  Tandag City, Surigao del Sur
                </p>
              </div>
            </motion.div>
          </>}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 lg:mt-0 mt-16">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
    </div>;
}