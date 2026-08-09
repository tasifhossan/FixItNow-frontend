'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Star, ShieldAlert } from 'lucide-react';
import { getTechnicians, Technician, GetTechniciansParams } from '../../lib/technicians';
import { PaginationMeta } from '../../lib/services';

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="glass-card rounded-xl overflow-hidden flex flex-col animate-pulse border border-white/40 text-left">
          <div className="h-48 bg-slate-200 dark:bg-slate-800" />
          <div className="p-6 space-y-4">
            <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TechniciansCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL search params
  const currentMinRating = searchParams.get('minRating') || '';
  const currentIsAvailable = searchParams.get('isAvailable') || '';
  const currentSearchTerm = searchParams.get('searchTerm') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [localSearch, setLocalSearch] = useState(currentSearchTerm);
  const [isLoading, setIsLoading] = useState(true);

  // Sync local search input with URL parameter changes (e.g. browser history action)
  useEffect(() => {
    setLocalSearch(currentSearchTerm);
  }, [currentSearchTerm]);

  // Fetch Technicians on parameter modifications
  useEffect(() => {
    const fetchTechnicians = async () => {
      setIsLoading(true);
      try {
        const queryParams: GetTechniciansParams = {
          page: currentPage,
          limit: 6,
        };

        if (currentMinRating) queryParams.minRating = currentMinRating;
        if (currentIsAvailable) queryParams.isAvailable = currentIsAvailable;
        if (currentSearchTerm) queryParams.searchTerm = currentSearchTerm;

        const response = await getTechnicians(queryParams);
        setTechnicians(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error('Failed to fetch technicians:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnicians();
  }, [currentMinRating, currentIsAvailable, currentSearchTerm, currentPage]);

  // Debounced search logic for name filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== currentSearchTerm) {
        updateQueryParams({ searchTerm: localSearch, page: '1' });
      }
    }, 450);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, currentSearchTerm]);

  // Helper to adjust URL query parameters
  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/technicians?${params.toString()}`);
  };

  const handleMinRatingChange = (rating: string) => {
    updateQueryParams({ minRating: rating, page: '1' });
  };

  const handleAvailabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateQueryParams({ isAvailable: e.target.checked ? 'true' : '', page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: String(newPage) });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-container-max mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Technicians Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Meet our verified, top-rated home improvement specialists.</p>
        </div>

        {/* Layout: Sidebar Filter & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Search Input */}
            <div className="glass-card p-6 rounded-xl border border-white/40 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-800 dark:text-white">Search by Name</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-white/50 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm py-2.5 px-2 placeholder-slate-400 outline-none" 
                  placeholder="e.g. Mike, Chen, Lee" 
                  type="text"
                />
              </div>
            </div>

            {/* Rating Dropdown */}
            <div className="glass-card p-6 rounded-xl border border-white/40 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-800 dark:text-white">Minimum Rating</label>
              <select
                value={currentMinRating}
                onChange={(e) => handleMinRatingChange(e.target.value)}
                className="w-full bg-white/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-slate-700 dark:text-slate-350 text-sm focus:border-primary-container focus:ring-primary-container outline-none transition-all"
              >
                <option value="">All Ratings</option>
                <option value="3">3.0+ Stars</option>
                <option value="4">4.0+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <div className="glass-card p-6 rounded-xl border border-white/40 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-850 dark:text-slate-200">Only Available Now</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={currentIsAvailable === 'true'}
                  onChange={handleAvailabilityToggle}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

          </div>

          {/* Grid list column */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {isLoading ? (
              <CatalogSkeleton />
            ) : technicians.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center border border-white/40 flex flex-col items-center justify-center gap-4">
                <ShieldAlert className="h-12 w-12 text-slate-350" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Technicians Found</h3>
                  <p className="text-sm text-slate-400 mt-1">No professionals match your current filter preferences.</p>
                </div>
                <button
                  onClick={() => {
                    setLocalSearch('');
                    router.push('/technicians');
                  }}
                  className="mt-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary/95 active:scale-95 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 border border-white/40 text-left group justify-between"
                    >
                      <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                        <img 
                          alt={tech.user?.name || 'Technician'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                        />
                        {tech.isAvailable ? (
                          <span className="absolute top-3 right-3 bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            Available
                          </span>
                        ) : (
                          <span className="absolute top-3 right-3 bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                            Busy
                          </span>
                        )}
                      </div>
                      
                      <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
                            {tech.user?.name}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tech.skills.slice(0, 2).map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-primary/5 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {tech.skills.length > 2 && (
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-455 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                +{tech.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-secondary-container mt-1">
                          <Star className="h-4 w-4 fill-secondary-container text-secondary-container" />
                          <span className="text-slate-500 dark:text-slate-400 text-xs ml-1 font-semibold">
                            {tech.averageRating.toFixed(1)} ({tech.totalReviews} reviews)
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-8">
                          {tech.bio || 'Qualified professional offering high standard home repair execution.'}
                        </p>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hourly Rate</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-white">৳{tech.hourlyRate}/hr</span>
                          </div>
                          <Link 
                            href={`/technicians/${tech.id}`}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/95 active:scale-95 transition-all shadow"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.total > meta.limit && (
                  <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800 pt-6 mt-4">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>
                    <span className="text-xs font-semibold text-slate-500">
                      Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
                    </span>
                    <button
                      disabled={currentPage >= Math.ceil(meta.total / meta.limit)}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default function TechniciansCatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <TechniciansCatalogContent />
    </Suspense>
  );
}
