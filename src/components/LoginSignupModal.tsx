import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, MailIcon, LockIcon, UserIcon, ArrowRightIcon, CheckCircleIcon, EyeIcon, EyeOffIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
interface LoginSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}
export function LoginSignupModal({
  isOpen,
  onClose,
  initialMode = 'login'
}: LoginSignupModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    rememberMe: false,
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {
    login,
    register
  } = useAuth();
  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccessMessage('');
      setFormData({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        rememberMe: false,
        agreeToTerms: false
      });
    }
  }, [isOpen, initialMode]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (mode === 'login') {
        // Login Logic
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        
        // Use real API authentication
        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
          throw new Error(result.error || 'Login failed');
        }
        
        onClose();
        // Navigation is handled inside the login function based on role
      } else {
        // Signup Logic
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error('Please fill in all fields');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (!formData.agreeToTerms) {
          throw new Error('You must agree to the privacy policy');
        }
        
        // Call register from auth context
        const result = await register(formData.email, formData.password, formData.name);
        
        if (!result.success) {
          throw new Error(result.error || 'Registration failed');
        }
        
        setSuccessMessage('Account created successfully! Please login.');
        setMode('login');
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setSuccessMessage('');
  };
  if (!isOpen) return null;
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]" />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
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
        }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>

              {/* Close Button */}
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors z-10">
                <XIcon className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-4 shadow-lg relative group">
                    <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <ShieldCheckIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {mode === 'login' ? 'Enter your credentials to access the dashboard' : 'Join FireGuard to protect your home and family'}
                  </p>
                </div>

                {/* Success Message */}
                {successMessage && <motion.div initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-medium">
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                    {successMessage}
                  </motion.div>}

                {/* Error Message */}
                {error && <motion.div initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {error}
                  </motion.div>}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 ml-1">
                        Full Name
                      </label>
                      <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input type="text" value={formData.name} onChange={e => setFormData({
                    ...formData,
                    name: e.target.value
                  })} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="John Doe" />
                      </div>
                    </div>}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input type="email" value={formData.email} onChange={e => setFormData({
                    ...formData,
                    email: e.target.value
                  })} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="name@example.com" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">
                      Password
                    </label>
                    <div className="relative group">
                      <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({
                    ...formData,
                    password: e.target.value
                  })} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 ml-1">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={e => setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all" placeholder="••••••••" />
                      </div>
                    </div>}

                  {/* Additional Options */}
                  <div className="flex items-center justify-between pt-1">
                    {mode === 'login' ? <>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.rememberMe ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                            {formData.rememberMe && <CheckCircleIcon className="w-3 h-3 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={formData.rememberMe} onChange={e => setFormData({
                      ...formData,
                      rememberMe: e.target.checked
                    })} />
                          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            Remember me
                          </span>
                        </label>
                        <button type="button" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                          Forgot password?
                        </button>
                      </> : <label className="flex items-start gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${formData.agreeToTerms ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                          {formData.agreeToTerms && <CheckCircleIcon className="w-3 h-3 text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.agreeToTerms} onChange={e => setFormData({
                    ...formData,
                    agreeToTerms: e.target.checked
                  })} />
                        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                          I agree with the{' '}
                          <a href="#" className="text-cyan-400 hover:underline">
                            privacy policy
                          </a>{' '}
                          and terms of service
                        </span>
                      </label>}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2">
                    {isLoading ? <>
                        <Loader2Icon className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </> : <>
                        <span>
                          {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </>}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={toggleMode} className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                      {mode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>}
    </AnimatePresence>;
}