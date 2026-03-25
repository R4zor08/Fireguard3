import React from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, MessageSquareIcon, ShieldIcon, UserIcon, HeartIcon } from 'lucide-react';
export type ContactType = 'emergency' | 'official' | 'personal';
interface ContactCardProps {
  name: string;
  number: string;
  type: ContactType;
  role?: string;
  avatarUrl?: string;
  onCall?: () => void;
  onMessage?: () => void;
}
export function ContactCard({
  name,
  number,
  type,
  role,
  avatarUrl,
  onCall,
  onMessage
}: ContactCardProps) {
  const getTypeConfig = (type: ContactType) => {
    switch (type) {
      case 'emergency':
        return {
          icon: ShieldIcon,
          color: 'red',
          label: 'Emergency',
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-400'
        };
      case 'official':
        return {
          icon: UserIcon,
          color: 'blue',
          label: 'Official',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400'
        };
      case 'personal':
        return {
          icon: HeartIcon,
          color: 'pink',
          label: 'Family',
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          text: 'text-pink-400'
        };
    }
  };
  const config = getTypeConfig(type);
  const TypeIcon = config.icon;
  // Generate initials for avatar placeholder
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return <motion.div whileHover={{
    y: -4
  }} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:border-slate-700 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${config.bg} ${config.text} border ${config.border}`}>
            {avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
          </div>

          <div>
            <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
              {name}
            </h4>
            <p className="text-xs text-slate-400">{role || config.label}</p>
          </div>
        </div>

        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
          {config.label}
        </div>
      </div>

      <div className="text-sm text-slate-300 font-mono mb-4 pl-1">{number}</div>

      <div className="flex gap-2">
        <button onClick={onCall} className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-green-600/20 text-slate-300 hover:text-green-400 border border-slate-700 hover:border-green-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium group/btn">
          <PhoneIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Call
        </button>
        <button onClick={onMessage} className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-slate-700 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm font-medium group/btn">
          <MessageSquareIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Message
        </button>
      </div>
    </motion.div>;
}