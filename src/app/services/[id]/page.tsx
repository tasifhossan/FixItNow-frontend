import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronLeft, Droplet, Zap, Snowflake, Refrigerator, Paintbrush, Sparkles, Hammer, Bug, Wrench, Users, Star, UserCheck, Clock } from 'lucide-react';
import { getServiceById } from '../../../lib/services';
import { getTechnicians, Technician } from '../../../lib/technicians';
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

  let technicians: Technician[] = [];
  try {
    const techResponse = await getTechnicians({ serviceId: id });
    technicians = techResponse.data;
  } catch (error) {
    console.error('Error fetching technicians for service:', error);
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
              <Users className="h-5 w-5 text-primary" /> Technicians Offering this Service
            </h2>

            {technicians.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {technicians.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/technicians/${tech.id}`}
                    className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-primary bg-white/30 hover:bg-white/60 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 relative shrink-0 border border-white/20 shadow-sm">
                        <Image
                          alt={tech.user?.name || 'Technician'}
                          className="object-cover"
                          src={tech.user?.profilePhoto ?? '/technician-placeholder.jpg'}
                          fill
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-250 group-hover:text-primary transition-colors">
                          {tech.user?.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-secondary-container font-semibold mt-0.5">
                          <Star className="h-3 w-3 fill-secondary-container text-secondary-container" />
                          <span>{tech.averageRating.toFixed(1)}</span>
                          <span className="text-slate-400">({tech.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {tech.isAvailable ? (
                            <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-green-200/40">
                              <UserCheck className="h-2.5 w-2.5" /> Available
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-amber-200/40">
                              <Clock className="h-2.5 w-2.5" /> Busy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 dark:text-white block">৳{tech.hourlyRate}</span>
                      <span className="text-[9px] text-slate-400">/ hour</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/40 text-center border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                No technicians are currently offering this service. 
                <div className="mt-3 flex justify-center">
                  <Link
                    href="/technicians"
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-[10px] hover:bg-primary/95 active:scale-95 shadow-sm transition-all"
                  >
                    Browse All Technicians
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
