import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, LogOutIcon, AlertTriangleIcon } from 'lucide-react';
interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm
}: LogoutConfirmationModalProps) {
  if (!isOpen) return null;
  return <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

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
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative p-6 border-b border-slate-700 bg-gradient-to-r from-red-950/30 to-orange-950/30">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                  <AlertTriangleIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Confirm Logout
                  </h2>
                  <p className="text-sm text-slate-400">
                    End your current session
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all" aria-label="Close">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-slate-300 text-center mb-6">
              Are you sure you want to logout? You will need to sign in again to
              access the dashboard.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 hover:border-slate-600">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                <LogOutIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>;
}