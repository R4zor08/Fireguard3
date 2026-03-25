import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, BoxIcon } from 'lucide-react';
interface CollapsibleSectionProps {
  title: string;
  icon: BoxIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  subtitle?: string;
}
export function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  className = '',
  subtitle
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return <div className={`lg:block ${className}`}>
      {/* Mobile Accordion Header */}
      <div className="lg:hidden mb-4">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-white/10 rounded-xl backdrop-blur-sm active:bg-slate-800/50 transition-colors touch-manipulation min-h-[64px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
              <Icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white text-base">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <div className={`p-2 rounded-full bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
          </div>
        </button>
      </div>

      {/* Mobile Content (Collapsible) */}
      <div className="lg:hidden">
        <AnimatePresence initial={false}>
          {isOpen && <motion.div initial={{
          height: 0,
          opacity: 0
        }} animate={{
          height: 'auto',
          opacity: 1
        }} exit={{
          height: 0,
          opacity: 0
        }} transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }} className="overflow-hidden">
              <div className="pb-4">{children}</div>
            </motion.div>}
        </AnimatePresence>
      </div>

      {/* Desktop Content (Always Visible) */}
      <div className="hidden lg:block h-full">{children}</div>
    </div>;
}