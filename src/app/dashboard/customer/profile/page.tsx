'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;


function formatMemberSince(dateStr?: string) {
  if (!dateStr) return 'Member since Oct 2023';
  try {
    const date = new Date(dateStr);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  } catch {
    return 'Member since Oct 2023';
  }
}

export default function CustomerProfilePage() {
  const { user, refreshSession } = useAuth();

  // Personal Info Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password Form State
  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handlers
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoMessage(null);

    if (!name.trim()) {
      setInfoMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }
    if (!phone.trim()) {
      setInfoMessage({ type: 'error', text: 'Phone number cannot be empty.' });
      return;
    }

    setIsSavingInfo(true);
    try {
      await api.patch('/users/me', { name, phone });
      await refreshSession();
      setInfoMessage({ type: 'success', text: 'Personal information updated successfully!' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setInfoMessage({
        type: 'error',
        text: e.response?.data?.message || e.message || 'Failed to update personal information.',
      });
    } finally {
      setIsSavingInfo(false);
    }
  };

  const handleUpdatePassword = async (data: ChangePasswordFormValues) => {
    setPassMessage(null);
    setIsUpdatingPass(true);
    try {
      await api.patch('/users/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      resetPass();
      setPassMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setPassMessage({
        type: 'error',
        text: e.response?.data?.message || e.message || 'Failed to update password. Verify current password.',
      });
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details and account settings.
        </p>
      </div>

      {/* ─── Profile Overview Card ─── */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Container */}
          <div className="relative w-24 h-24 rounded-full bg-blue-50 border border-slate-100 flex items-center justify-center text-blue-600 shadow-inner">
            <span className="text-3xl font-black select-none">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>

          {/* Profile details */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {user?.name}
            </h2>
            <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-semibold">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{user?.phone || 'No phone added'}</span>
              </div>
            </div>
            <div className="pt-1">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                {formatMemberSince(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>
      </div>

      {/* ─── Grid: Personal Info + Password ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card 1: Personal Information */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Personal Information</h3>
          </div>
          <form onSubmit={handleSaveInfo} className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {infoMessage && (
                <div className={`p-4 rounded-xl flex items-start gap-2 text-xs font-semibold ${
                  infoMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {infoMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                  )}
                  <span>{infoMessage.text}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-450 rounded-xl text-xs font-semibold cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 italic font-medium">Email cannot be changed</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSavingInfo}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center"
              >
                {isSavingInfo ? 'Saving Changes…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Change Password */}
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Change Password</h3>
          </div>
          <form onSubmit={handlePassSubmit(handleUpdatePassword)} className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {passMessage && (
                <div className={`p-4 rounded-xl flex items-start gap-2 text-xs font-semibold ${
                  passMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-100' 
                    : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {passMessage.type === 'success' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                  )}
                  <span>{passMessage.text}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <input 
                    type={showOldPass ? 'text' : 'password'}
                    {...registerPass('oldPassword')}
                    className={`w-full pl-4 pr-11 py-3 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                      passErrors.oldPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passErrors.oldPassword && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1 font-semibold mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {passErrors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? 'text' : 'password'}
                    {...registerPass('newPassword')}
                    className={`w-full pl-4 pr-11 py-3 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                      passErrors.newPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passErrors.newPassword && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1 font-semibold mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {passErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPass ? 'text' : 'password'}
                    {...registerPass('confirmPassword')}
                    className={`w-full pl-4 pr-11 py-3 bg-slate-50 border rounded-xl text-xs font-semibold focus:outline-none transition-all ${
                      passErrors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passErrors.confirmPassword && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1 font-semibold mt-1">
                    <AlertCircle className="h-3 w-3 shrink-0" /> {passErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingPass}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center"
              >
                {isUpdatingPass ? 'Updating Password…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
