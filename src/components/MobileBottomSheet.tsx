import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUpIcon, BellIcon, XIcon } from 'lucide-react';
interface MobileBottomSheetProps {
  children: React.ReactNode;
  alertCount: number;
  title?: string;
}
export function MobileBottomSheet({
  children,
  alertCount,
  title = 'Alerts'
}: MobileBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden" />}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <motion.div className={`fixed bottom-0 left-0 right-0 z-[50] lg:hidden bg-slate-900 border-t border-white/10 rounded-t-3xl shadow-2xl shadow-black/50 flex flex-col transition-all duration-300 ${isOpen ? 'h-[85vh]' : 'h-16'}`} initial={false} animate={isOpen ? {
      y: 0
    } : {
      y: 0
    }}>
        {/* Handle / Header */}
        <div className="flex items-center justify-between px-6 h-16 cursor-pointer border-b border-white/5 bg-slate-800/50 rounded-t-3xl" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellIcon className={`w-5 h-5 ${alertCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
              {alertCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>}
            </div>
            <span className="font-semibold text-white">{title}</span>
            {alertCount > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-400 rounded-full border border-red-500/20">
                {alertCount} New
              </span>}
          </div>

          <div className="flex items-center gap-2">
            {!isOpen && <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Tap to view
                </span>
              </div>}
            <div className={`p-1 rounded-full bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronUpIcon className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {isOpen && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar bg-slate-950/50">
              {children}
            </motion.div>}
        </AnimatePresence>
      </motion.div>
    </>;
}