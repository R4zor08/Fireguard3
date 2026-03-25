import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, UserIcon, PhoneIcon, ShieldIcon, SaveIcon, Loader2Icon } from 'lucide-react';
import { ContactType } from './ContactCard';
interface Contact {
  id?: string;
  name: string;
  number: string;
  type: ContactType;
  role?: string;
}
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialData?: Contact | null;
  isSaving?: boolean;
}
export function ContactModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false
}: ContactModalProps) {
  const [formData, setFormData] = useState<Contact>({
    name: '',
    number: '',
    type: 'official',
    role: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        number: '',
        type: 'official',
        role: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSaving, onClose]);
  const validate = () => {
    const newErrors: Partial<Record<keyof Contact, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.number.trim()) {
      newErrors.number = 'Phone number is required';
    } else if (!/^(\+63|0)9\d{9}$/.test(formData.number.replace(/[-\s]/g, ''))) {
      newErrors.number = 'Invalid Philippine mobile number format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && !isSaving) {
      onSave(formData);
    }
  };
  const handleBackdropClick = () => {
    if (!isSaving) {
      onClose();
    }
  };
  return <AnimatePresence>
      {isOpen && <>
          {/* Enhanced Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={handleBackdropClick} className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] cursor-pointer" />

          {/* Modal Container - Responsive */}
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 100
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 100
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300
        }} onClick={e => e.stopPropagation()} className="w-full sm:max-w-2xl md:max-w-xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {initialData ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button onClick={onClose} disabled={isSaving} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center" aria-label="Close modal">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Form - Scrollable */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} disabled={isSaving} className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 sm:py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[42px]`} placeholder="e.g. Juan Dela Cruz" />
                  </div>
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="tel" value={formData.number} onChange={e => setFormData({
                  ...formData,
                  number: e.target.value
                })} disabled={isSaving} className={`w-full bg-slate-800 border ${errors.number ? 'border-red-500' : 'border-slate-700'} rounded-xl py-3 sm:py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[42px]`} placeholder="e.g. 09123456789" />
                  </div>
                  {errors.number && <p className="text-xs text-red-400">{errors.number}</p>}
                </div>

                {/* Type Selection */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">
                    Contact Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['official', 'emergency'] as ContactType[]).map(type => <button key={type} type="button" onClick={() => setFormData({
                  ...formData,
                  type
                })} disabled={isSaving} className={`py-3 sm:py-2 px-3 rounded-xl text-sm font-medium border transition-all min-h-[48px] sm:min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed ${formData.type === type ? type === 'emergency' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>)}
                  </div>
                </div>

                {/* Role Field (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-400">
                    Role / Relationship (Optional)
                  </label>
                  <div className="relative">
                    <ShieldIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={formData.role || ''} onChange={e => setFormData({
                  ...formData,
                  role: e.target.value
                })} disabled={isSaving} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 sm:py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[42px]" placeholder="e.g. Brother, Fire Station, etc." />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3 shrink-0">
                  <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 py-3 sm:py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[44px]">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] sm:min-h-[44px]">
                    {isSaving ? <>
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </> : <>
                        <SaveIcon className="w-4 h-4" />
                        <span>Save Contact</span>
                      </>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>}
    </AnimatePresence>;
}