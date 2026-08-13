'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getServices, Service } from '@/lib/services';
import { getMyTechnicianProfile, assignServices, removeService } from '@/lib/technicianProfile';
import { getTechnicianById } from '@/lib/technicians';

function ServicesSkeleton() {
  return (
    <div className="space-y-8 animate-pulse text-left max-w-5xl mx-auto">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-80 bg-slate-100 dark:bg-slate-850 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left Column (3/5 Width) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="h-36 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5" />
            ))}
          </div>
        </div>

        {/* Right Column (2/5 Width) */}
        <div className="lg:col-span-2">
          <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6" />
        </div>
      </div>
    </div>
  );
}

export default function TechnicianServicesPage() {
  const [assignedServices, setAssignedServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchServicesData = async () => {
    try {
      const profileData = await getMyTechnicianProfile();
      const [fullProfile, allServicesResponse] = await Promise.all([
        getTechnicianById(profileData.id),
        getServices({ limit: 100 }),
      ]);
      const assigned = fullProfile.services || [];
      setAssignedServices(assigned);

      // Compute available services (all services minus assigned ones)
      const available = allServicesResponse.data.filter(
        s => !assigned.some(as => as.id === s.id)
      );
      setAvailableServices(available);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load services data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const handleAddService = async (serviceId: string) => {
    try {
      await assignServices([serviceId]);
      toast.success('Service added to your profile!');
      fetchServicesData();
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to add service');
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    try {
      await removeService(serviceId);
      toast.success('Service removed from your profile.');
      fetchServicesData();
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'Failed to remove service');
    }
  };

  if (isLoading) {
    return <ServicesSkeleton />;
  }

  // Filter available services based on search query
  const filteredAvailableServices = availableServices.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      
      {/* ─── Page Title Header ─── */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Services</h1>
        <p className="text-sm text-slate-500 font-medium mt-1.5">
          Manage which services you offer to customers.
        </p>
      </div>

      {/* ─── Two-Column Layout Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Column (3/5 Width): Assigned Services list */}
        <div className="lg:col-span-3 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Assigned Services
            </h2>
          </div>

          {assignedServices.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-12 text-center text-xs font-semibold text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
              No services currently assigned. Add a service from the right panel.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assignedServices.map((service) => (
                <div 
                  key={service.id}
                  className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300"
                >
                  {/* Close/Remove x button */}
                  <button 
                    onClick={() => handleRemoveService(service.id)}
                    className="absolute top-4 right-4 p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-655 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4 shrink-0" />
                  </button>
                  
                  <div className="space-y-4">
                    {/* Category tag */}
                    <div>
                      <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold rounded-md border border-blue-100/50 dark:border-blue-900/30 uppercase tracking-wider">
                        {service.category?.name || 'Service'}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                      {service.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <span>Base Price:</span>
                      <span className="text-blue-650 dark:text-blue-400 font-extrabold text-sm flex items-center">
                        ৳ {service.basePrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (2/5 Width): Add a Service Panel */}
        <div className="lg:col-span-2">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add a Service</h3>
            </div>

            {/* Search Input Box */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 border border-slate-200/80 dark:border-slate-800/85 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 w-full">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search available services..." 
                className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-700 dark:text-slate-200 font-semibold"
              />
            </div>

            {/* Available Services List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {filteredAvailableServices.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No matching services found.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {filteredAvailableServices.map((service) => (
                    <div 
                      key={service.id}
                      className="border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                          {service.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          Standard pricing <span className="font-bold text-slate-705 dark:text-slate-300">৳ {service.basePrice}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handleAddService(service.id)}
                        className="px-4 py-2 bg-[#78350F] hover:bg-[#632a0a] text-white font-bold rounded-xl text-[10px] transition-all shadow-sm shrink-0 active:scale-95 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
