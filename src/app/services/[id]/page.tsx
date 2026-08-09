import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Info, Droplet, Zap, Snowflake, Refrigerator, Paintbrush, Sparkles, Hammer, Bug, Wrench, Users } from 'lucide-react';
import { getServiceById } from '../../../lib/services';
import { isAxiosError } from 'axios';

function getServiceIcon(categoryName: string = '') {
  const name = categoryName.toLowerCase();
  if (name.includes('plumb')) return <Droplet className="h-12 w-12" />;
  if (name.includes('elect')) return <Zap className="h-12 w-12" />;
  if (name.includes('ac') || name.includes('air')) return <Snowflake className="h-12 w-12" />;
  if (name.includes('appliance') || name.includes('kitchen') || name.includes('fridge')) return <Refrigerator className="h-12 w-12" />;
  if (name.includes('paint')) return <Paintbrush className="h-12 w-12" />;
  if (name.includes('clean')) return <Sparkles className="h-12 w-12" />;
  if (name.includes('carpent') || name.includes('wood')) return <Hammer className="h-12 w-12" />;
  if (name.includes('pest') || name.includes('bug')) return <Bug className="h-12 w-12" />;
  return <Wrench className="h-12 w-12" />;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;

  let service;
  try {
    service = await getServiceById(id);
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    console.error('Error fetching service:', err);
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Back Link */}
        <Link 
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Services Catalog
        </Link>

        {/* Detail Card */}
        <div className="glass-card p-8 md:p-12 rounded-2xl border border-white/40 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                {getServiceIcon(service.category?.name || service.name)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                  {service.name}
                </h1>
                <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-1">
                  {service.category?.name || 'Uncategorized'}
                </p>
              </div>
            </div>
            
            <div className="text-left sm:text-right shrink-0">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Starting Price</p>
              <p className="text-2xl font-black text-secondary-container mt-1">৳{service.basePrice}</p>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
              Service Description
            </h2>
            <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
              {service.description || 'No detailed description available for this service. Rest assured, our certified technician team will execute it with the highest safety and quality standards.'}
            </p>
          </div>

          {/* Assigned Technicians block */}
          <div className="border-t border-slate-200/50 dark:border-slate-800 pt-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-primary" /> Technicians Offering this Service
            </h2>
            
            {/* Limitation Notice */}
            <div className="rounded-xl bg-primary-container/5 border border-primary-container/10 p-4 flex gap-3 text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5 text-primary-container shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-white">API Compatibility Note</p>
                <p className="mt-1">
                  Filtering technicians dynamically by service assignments is currently a work-in-progress backend capability. To find certified professionals, browse our global list of available technicians.
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <Link
                href="/technicians"
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/95 active:scale-95 shadow-md transition-all"
              >
                Browse All Technicians
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
