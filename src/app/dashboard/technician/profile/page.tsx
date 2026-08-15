'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Check, 
  X, 
  Plus,
  Camera
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { 
  getMyTechnicianProfile, 
  updateTechnicianProfile, 
  updateAvailability, 
  TechnicianProfile,
  getWorkingHours,
  updateWorkingHours
} from '@/lib/technicianProfile';

function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left max-w-5xl mx-auto">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-80 bg-slate-100 dark:bg-slate-850 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column (3/5 Width) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="h-36 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
          <div className="h-64 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
        </div>

        {/* Right Column (2/5 Width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
          <div className="h-48 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
          <div className="h-32 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
        </div>
      </div>
    </div>
  );
}

export default function TechnicianProfilePage() {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);

    setIsUploadingPhoto(true);
    try {
      await api.post('/users/me/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile photo uploaded successfully!');
      await fetchProfile();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to upload photo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const [bioInput, setBioInput] = useState<string>('');
  const [rateInput, setRateInput] = useState<string>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');

  const [workingHours, setWorkingHours] = useState<{[key: number]: { isOpen: boolean; startTime: string; endTime: string }}>({
    0: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    1: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    2: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    3: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    4: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    5: { isOpen: false, startTime: '09:00', endTime: '17:00' },
    6: { isOpen: false, startTime: '09:00', endTime: '17:00' }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavingBio, setIsSavingBio] = useState<boolean>(false);
  const [isUpdatingRate, setIsUpdatingRate] = useState<boolean>(false);
  const [isSavingHours, setIsSavingHours] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      const [data, hoursData] = await Promise.all([
        getMyTechnicianProfile(),
        getWorkingHours()
      ]);
      setProfile(data);
      setBioInput(data.bio || '');
      setRateInput(data.hourlyRate ? String(data.hourlyRate) : '');
      setSkills(data.skills || []);

      const updated: Record<number, { isOpen: boolean; startTime: string; endTime: string }> = {
        0: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        1: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        2: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        3: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        4: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        5: { isOpen: false, startTime: '09:00', endTime: '17:00' },
        6: { isOpen: false, startTime: '09:00', endTime: '17:00' }
      };
      
      hoursData.forEach((w) => {
        updated[w.dayOfWeek] = {
          isOpen: true,
          startTime: w.startTime,
          endTime: w.endTime
        };
      });
      setWorkingHours(updated);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleToggleAvailability = async () => {
    if (!profile) return;
    const previousState = profile.isAvailable;
    const newState = !previousState;

    setProfile(prev => prev ? { ...prev, isAvailable: newState } : null);

    try {
      await updateAvailability(newState);
      toast.success(newState ? 'Availability turned ON' : 'Availability turned OFF');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to update availability status');
      setProfile(prev => prev ? { ...prev, isAvailable: previousState } : null);
    }
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bioInput.length > 500) {
      toast.error('Bio cannot exceed 500 characters.');
      return;
    }
    setIsSavingBio(true);
    try {
      const updated = await updateTechnicianProfile({ bio: bioInput });
      setProfile(updated);
      toast.success('Bio description updated successfully!');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to save bio');
    } finally {
      setIsSavingBio(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = newSkill.trim();
    if (!cleanSkill) return;
    
    if (skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      toast.error('Skill already exists.');
      return;
    }
    
    const updatedSkills = [...skills, cleanSkill];
    try {
      const updated = await updateTechnicianProfile({ skills: updatedSkills });
      setSkills(updated.skills);
      setNewSkill('');
      toast.success(`"${cleanSkill}" skill added!`);
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    try {
      const updated = await updateTechnicianProfile({ skills: updatedSkills });
      setSkills(updated.skills);
      toast.success(`Removed "${skillToRemove}" skill`);
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to remove skill');
    }
  };

  const handleUpdateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = Number(rateInput);
    if (!rateInput || isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid hourly rate.');
      return;
    }
    setIsUpdatingRate(true);
    try {
      const updated = await updateTechnicianProfile({ hourlyRate: rateVal });
      setProfile(updated);
      toast.success('Hourly rate updated successfully!');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to update hourly rate');
    } finally {
      setIsUpdatingRate(false);
    }
  };

  const handleSaveWorkingHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHours(true);
    try {
      const payload = Object.entries(workingHours)
        .filter(([, value]) => value.isOpen)
        .map(([key, value]) => ({
          dayOfWeek: Number(key),
          startTime: value.startTime,
          endTime: value.endTime,
        }));

      await updateWorkingHours(payload);
      toast.success('Working hours updated successfully!');
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to save working hours');
    } finally {
      setIsSavingHours(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const memberSinceStr = profile?.user?.createdAt 
    ? new Date(profile.user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Oct 2023';

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* ─── Page Title Header ─── */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile & Skills</h1>
        <p className="text-sm text-slate-500 font-medium mt-1.5">
          Manage your professional identity and service offerings.
        </p>
      </div>

      {/* ─── Two-Column Grid Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Column (3/5 Width): Profile Details & Bio */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card 1: Profile Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Avatar */}
              <div 
                onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
                className="group relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm shrink-0 cursor-pointer"
                title="Click to upload profile photo"
              >
                <Image 
                  src={profile?.user?.profilePhoto ?? '/technician-placeholder.jpg'} 
                  alt={profile?.user?.name || 'Technician'} 
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                
                {/* Hover overlay with Camera Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                  <Camera className="w-5 h-5 text-white" />
                </div>

                {/* Spinner during upload */}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {profile?.isVerified && (
                  <span className="absolute bottom-1 right-1 flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white shadow-sm z-10">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
                accept="image/*"
              />
              
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {profile?.user?.name || 'Technician'}
                  </h2>
                  {profile?.isVerified && (
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold rounded-full border border-blue-100/50 dark:border-blue-900/30 uppercase tracking-wide self-center">
                      Verified Pro
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">
                  Member since {memberSinceStr}
                </p>
              </div>
            </div>

            <button
              onClick={() => !isUploadingPhoto && fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-655 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Edit Photo'}
            </button>
          </div>

          {/* Card 2: About & Bio */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">About & Bio</h3>
            
            <form onSubmit={handleSaveBio} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed text-slate-700 dark:text-slate-200"
                  placeholder="Tell clients about your expertise and work history..."
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 font-bold">
                  {bioInput.length}/500
                </span>
                <button
                  type="submit"
                  disabled={isSavingBio}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center min-w-[90px] cursor-pointer"
                >
                  {isSavingBio ? 'Saving...' : 'Save Bio'}
                </button>
              </div>
            </form>
          </div>

          {/* Card 6: Working Hours */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Working Hours</h3>
            <p className="text-xs font-bold text-slate-550 dark:text-slate-450 mt-1 mb-5">
              Set your weekly work schedule. Clients can only book appointments during these hours.
            </p>

            <form onSubmit={handleSaveWorkingHours} className="space-y-4">
              <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800/60">
                {[
                  { label: 'Sunday', value: 0 },
                  { label: 'Monday', value: 1 },
                  { label: 'Tuesday', value: 2 },
                  { label: 'Wednesday', value: 3 },
                  { label: 'Thursday', value: 4 },
                  { label: 'Friday', value: 5 },
                  { label: 'Saturday', value: 6 },
                ].map((day) => {
                  const config = workingHours[day.value] || { isOpen: false, startTime: '09:00', endTime: '17:00' };
                  return (
                    <div key={day.value} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3.5 first:pt-0 first:border-t-0">
                      {/* Day Label & Toggle */}
                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 min-w-[80px]">
                          {day.label}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.value]: {
                                ...prev[day.value],
                                isOpen: !prev[day.value]?.isOpen
                              }
                            }));
                          }}
                          className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            config.isOpen ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              config.isOpen ? 'translate-x-4.5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {config.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>

                      {/* Time selectors (only visible if Day is Open) */}
                      {config.isOpen ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={config.startTime}
                            onChange={(e) => {
                              setWorkingHours(prev => ({
                                ...prev,
                                [day.value]: {
                                  ...prev[day.value],
                                  startTime: e.target.value
                                }
                              }));
                            }}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                          />
                          <span className="text-xs text-slate-400 font-bold">to</span>
                          <input
                            type="time"
                            value={config.endTime}
                            onChange={(e) => {
                              setWorkingHours(prev => ({
                                ...prev,
                                [day.value]: {
                                  ...prev[day.value],
                                  endTime: e.target.value
                                }
                              }));
                            }}
                            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 sm:pr-8 italic">
                          Unavailable
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSavingHours}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center min-w-[130px] cursor-pointer"
                >
                  {isSavingHours ? 'Saving...' : 'Save Working Hours'}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column (2/5 Width): Skills, Hourly Rate & Availability */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 3: Skills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Skills</h3>
            
            <div className="space-y-5">
              {/* Badges Grid */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 dark:bg-blue-950/20 text-blue-755 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100/50 dark:border-blue-900/30"
                  >
                    <span>{skill}</span>
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3 shrink-0" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Card 4: Hourly Rate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Hourly Rate</h3>
            
            <form onSubmit={handleUpdateRate} className="space-y-4.5">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-black text-sm select-none">
                  ৳
                </span>
                <input 
                  type="text" 
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                  placeholder="Enter hourly rate"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold italic">
                This is your base hourly rate for services
              </p>
              
              <button
                type="submit"
                disabled={isUpdatingRate}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {isUpdatingRate ? 'Updating...' : 'Update Rate'}
              </button>
            </form>
          </div>

          {/* Card 5: Availability */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Availability</h3>
                <p className="text-xs font-bold text-slate-655 dark:text-slate-350 mt-1">Available for new bookings</p>
              </div>
              
              <button
                onClick={handleToggleAvailability}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  profile?.isAvailable ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                    profile?.isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold leading-normal">
              When off, you won&apos;t receive new booking requests, but existing bookings remain active.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
