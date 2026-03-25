import React, { useState } from 'react';
import { XIcon, SaveIcon, UserIcon, MapPinIcon, PhoneIcon, AlertTriangleIcon, CheckCircleIcon, Loader2Icon } from 'lucide-react';
interface Household {
  id: string;
  ownerName: string;
  address: string;
  contactNumber: string;
  emergencyContact?: string;
}
interface EditHouseholdModalProps {
  household: Household;
  onClose: () => void;
  onSave: (updatedData: Partial<Household>) => void;
}
export function EditHouseholdModal({
  household,
  onClose,
  onSave
}: EditHouseholdModalProps) {
  const [formData, setFormData] = useState({
    ownerName: household.ownerName,
    address: household.address,
    contactNumber: household.contactNumber,
    emergencyContact: household.emergencyContact || ''
  });
  const [errors, setErrors] = useState({
    ownerName: '',
    address: '',
    contactNumber: '',
    emergencyContact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'ownerName':
        if (!value.trim()) error = 'Owner name is required';else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';else if (value.length < 10) error = 'Please provide a complete address';
        break;
      case 'contactNumber':
        if (!value.trim()) error = 'Contact number is required';else if (!/^\+?[\d\s-]{10,}$/.test(value)) error = 'Invalid phone number format';
        break;
      case 'emergencyContact':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value.replace(/[^\d+]/g, ''))) if (value.length > 0 && !/\d/.test(value))
          // Simple check if it contains a number
          error = 'Please include a contact number';
        break;
    }
    return error;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const newErrors = {
      ownerName: validateField('ownerName', formData.ownerName),
      address: validateField('address', formData.address),
      contactNumber: validateField('contactNumber', formData.contactNumber),
      emergencyContact: validateField('emergencyContact', formData.emergencyContact)
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(err => err !== '')) {
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSubmitting(false);
    setShowSuccess(true);
    // Close after showing success
    setTimeout(() => {
      onClose();
    }, 1500);
  };
  return <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg glass-dark border border-slate-700 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Household</h2>
            <p className="text-sm text-slate-400">ID: {household.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Owner Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Owner Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.ownerName ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="Full Name" />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            {errors.ownerName && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.ownerName}
              </p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.address ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="Complete Address" />
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            {errors.address && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.address}
              </p>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Contact Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.contactNumber ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="+63 9XX XXX XXXX" />
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            {errors.contactNumber && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.contactNumber}
              </p>}
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Emergency Contact (Optional)
            </label>
            <div className="relative">
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} className={`w-full px-4 py-2.5 bg-slate-900/50 border ${errors.emergencyContact ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all pl-10`} placeholder="Name & Number" />
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
            {errors.emergencyContact && <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertTriangleIcon className="w-3 h-3" />
                {errors.emergencyContact}
              </p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-700 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 glass border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || showSuccess} className={`flex-1 px-4 py-3 bg-gradient-to-r ${showSuccess ? 'from-green-600 to-emerald-600' : 'from-cyan-600 to-blue-600'} text-white rounded-xl font-semibold hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isSubmitting ? <>
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                  Saving...
                </> : showSuccess ? <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Saved!
                </> : <>
                  <SaveIcon className="w-5 h-5" />
                  Save Changes
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>;
}