import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, MailIcon, PhoneIcon, LockIcon, ShieldIcon, SaveIcon, CameraIcon, CheckCircleIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { authAPI } from '../services/api';
export function UserProfile() {
  const {
    user,
    updateUser
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const avatarSrc = useMemo(() => {
    if (!user?.avatarUrl) return null;
    if (user.avatarUrl.startsWith('http://') || user.avatarUrl.startsWith('https://')) return user.avatarUrl;
    return `http://localhost:5000${user.avatarUrl}`;
  }, [user?.avatarUrl]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '0912-345-6789',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const handlePasswordChange = (pass: string) => {
    setFormData(prev => ({
      ...prev,
      newPassword: pass
    }));
    setPasswordStrength(calculateStrength(pass));
    // Clear password mismatch error if typing
    if (errors.confirmPassword) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  };
  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email address';
    if (!formData.phone.match(/^09\d{9}$/) && !formData.phone.match(/^09\d{2}-\d{3}-\d{4}$/)) {
      newErrors.phone = 'Invalid phone format (e.g., 0912-345-6789)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  const handleUpdatePassword = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password required';
    if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setPasswordStrength(0);
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Medium';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'text-slate-500';
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-green-500';
      case 4:
        return 'text-emerald-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleAvatarClick = () => {
    if (isUploadingAvatar) return;
    fileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      const result = await authAPI.updateAvatar(file);
      updateUser(result.data);
      toast.success('Profile picture updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile picture');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-8 pb-20 lg:pb-8 space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">
          Manage your account settings and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{
        animationDelay: '0.1s'
      }}>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-20"></div>

            <div className="relative mb-4 group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden shadow-2xl">
                {avatarSrc ? <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" /> : user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {isUploadingAvatar ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CameraIcon className="w-6 h-6 text-white" />}
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarFileChange} />

            <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
            <p className="text-slate-400 text-sm mb-4">{user?.email}</p>

            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <ShieldIcon className="w-3 h-3 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Account Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">
                    Two-Factor Auth
                  </p>
                  <p className="text-xs text-slate-400">Add extra security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-2">Active Sessions</p>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  Chrome on Windows (Current)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{
        animationDelay: '0.2s'
      }}>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">
                Personal Information
              </h3>
              <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                {isEditing ? 'Cancel' : 'Edit Details'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" disabled={!isEditing} value={formData.name} onChange={e => setFormData({
                  ...formData,
                  name: e.target.value
                })} className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                </div>
                {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" disabled={!isEditing} value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                </div>
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Phone Number
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="tel" disabled={!isEditing} value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} className={`w-full bg-slate-800 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                </div>
                {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
              </div>
            </div>

            <AnimatePresence>
              {isEditing && <motion.div initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }} exit={{
              opacity: 0,
              height: 0
            }} className="mt-6 flex justify-end">
                  <button onClick={handleSaveProfile} disabled={isSaving} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                    {isSaving ? <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </> : <>
                        <SaveIcon className="w-4 h-4" />
                        Save Changes
                      </>}
                  </button>
                </motion.div>}
            </AnimatePresence>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">
              Change Password
            </h3>

            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Current Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={formData.currentPassword} onChange={e => setFormData({
                  ...formData,
                  currentPassword: e.target.value
                })} className={`w-full bg-slate-800 border ${errors.currentPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                </div>
                {errors.currentPassword && <p className="text-xs text-red-400">
                    {errors.currentPassword}
                  </p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={formData.newPassword} onChange={e => handlePasswordChange(e.target.value)} className={`w-full bg-slate-800 border ${errors.newPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                </div>
                {errors.newPassword && <p className="text-xs text-red-400">{errors.newPassword}</p>}

                {/* Strength Indicator */}
                {formData.newPassword && <div className="space-y-1">
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4].map(level => <div key={level} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= level ? passwordStrength < 3 ? 'bg-red-500' : passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-slate-700'}`} />)}
                    </div>
                    <p className={`text-xs font-medium text-right ${getStrengthColor()}`}>
                      {getStrengthLabel()}
                    </p>
                  </div>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="password" value={formData.confirmPassword} onChange={e => setFormData({
                  ...formData,
                  confirmPassword: e.target.value
                })} className={`w-full bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all`} />
                  {formData.confirmPassword && formData.newPassword === formData.confirmPassword && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400">
                    {errors.confirmPassword}
                  </p>}
              </div>

              <div className="pt-2">
                <button onClick={handleUpdatePassword} disabled={isUpdatingPassword || !formData.newPassword || !formData.currentPassword} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2">
                  {isUpdatingPassword ? <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </> : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}