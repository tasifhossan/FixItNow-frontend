'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Droplet, Zap, Snowflake, Refrigerator, Paintbrush, Sparkles, Hammer, Bug, Wrench } from 'lucide-react';
import { getCategories, Category } from '../../lib/categories';
import { getServices, Service, PaginationMeta } from '../../lib/services';

function getServiceIcon(categoryName: string = '') {
  const name = categoryName.toLowerCase();
  if (name.includes('plumb')) return <Droplet className="h-6 w-6" />;
  if (name.includes('elect')) return <Zap className="h-6 w-6" />;
  if (name.includes('ac') || name.includes('air')) return <Snowflake className="h-6 w-6" />;
  if (name.includes('appliance') || name.includes('kitchen') || name.includes('fridge')) return <Refrigerator className="h-6 w-6" />;
  if (name.includes('paint')) return <Paintbrush className="h-6 w-6" />;
  if (name.includes('clean')) return <Sparkles className="h-6 w-6" />;
  if (name.includes('carpent') || name.includes('wood')) return <Hammer className="h-6 w-6" />;
  if (name.includes('pest') || name.includes('bug')) return <Bug className="h-6 w-6" />;
  return <Wrench className="h-6 w-6" />;
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="glass-card p-6 rounded-xl flex items-center gap-4 animate-pulse border border-white/40">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ServicesCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse state from URL search params
  const currentCategoryId = searchParams.get('categoryId') || '';
  const currentSearchTerm = searchParams.get('searchTerm') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  // Local state
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [localSearch, setLocalSearch] = useState(currentSearchTerm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Sync local search term with URL changes (e.g. back button)
  useEffect(() => {
    setLocalSearch(currentSearchTerm);
  }, [currentSearchTerm]);

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Services on param changes
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await getServices({
          categoryId: currentCategoryId || undefined,
          searchTerm: currentSearchTerm || undefined,
          page: currentPage,
          limit: 6, // 6 services per page
        });
        setServices(response.data);
        setMeta(response.meta);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [currentCategoryId, currentSearchTerm, currentPage]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== currentSearchTerm) {
        updateQueryParams({ searchTerm: localSearch, page: '1' });
      }
    }, 450);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, currentSearchTerm]);

  // Helper to construct and push updated query parameters
  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/services?${params.toString()}`);
  };

  const handleCategoryChange = (catId: string) => {
    updateQueryParams({ categoryId: catId, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: String(newPage) });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-container-max mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Services Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Browse and filter our top quality home services.</p>
        </div>

        {/* Layout: Sidebar and Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Search Input */}
            <div className="glass-card p-6 rounded-xl border border-white/40 flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-800 dark:text-white">Search Keyword</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-white/50 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm py-2.5 px-2 placeholder-slate-400 outline-none" 
                  placeholder="e.g. pipe, leak, fix" 
                  type="text"
                />
              </div>
            </div>

            {/* Categories Select */}
            <div className="glass-card p-6 rounded-xl border border-white/40 flex flex-col gap-4">
              <label className="text-sm font-bold text-slate-800 dark:text-white">Filter by Category</label>
              {isCategoriesLoading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-5 w-full bg-slate-200 dark:bg-slate-850 rounded" />
                  <div className="h-5 w-5/6 bg-slate-200 dark:bg-slate-850 rounded" />
                  <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-850 rounded" />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      currentCategoryId === '' 
                        ? 'bg-primary text-white font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all flex justify-between items-center ${
                        currentCategoryId === cat.id 
                          ? 'bg-primary text-white font-bold' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat._count && (
                        <span className={`text-xxs px-2 py-0.5 rounded-full ${
                          currentCategoryId === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {cat._count.services}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            
            {isLoading ? (
              <CatalogSkeleton />
            ) : services.length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center border border-white/40 flex flex-col items-center justify-center gap-4">
                <Search className="h-12 w-12 text-slate-300" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Services Found</h3>
                  <p className="text-sm text-slate-400 mt-1">Try tweaking your keyword search or selected category filter.</p>
                </div>
                <button
                  onClick={() => {
                    setLocalSearch('');
                    router.push('/services');
                  }}
                  className="mt-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:bg-primary/95 active:scale-95 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="glass-card p-6 rounded-xl border border-white/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-4 group justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0 group-hover:bg-primary-container group-hover:text-white transition-all duration-250">
                          {getServiceIcon(service.category?.name || service.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors truncate">
                            {service.name}
                          </h3>
                          <p className="text-xs text-slate-405 dark:text-slate-405 font-medium mt-0.5 uppercase tracking-wider">
                            {service.category?.name}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-8">
                        {service.description || 'Professional home service executed by certified experts.'}
                      </p>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Starting Price</span>
                        <span className="text-sm font-bold text-secondary-container">৳{service.basePrice}</span>
                      </div>
                    </Link>
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

export default function ServicesCatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ServicesCatalogContent />
    </Suspense>
  );
}
