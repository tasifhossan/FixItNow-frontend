import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Star, MessageSquare, Wrench, ShieldCheck, UserCheck, Clock } from 'lucide-react';
import { getTechnicianById } from '../../../lib/technicians';
import { getTechnicianReviews } from '../../../lib/reviews';
import { isAxiosError } from 'axios';
import TechnicianBookingCTA from '../../../components/TechnicianBookingCTA';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Sub-component to fetch and render reviews
async function ReviewsSection({ technicianId }: { technicianId: string }) {
  try {
    const response = await getTechnicianReviews(technicianId, { limit: 10 });
    const reviews = response.data;

    if (!reviews || reviews.length === 0) {
      return (
        <div className="glass-card p-8 rounded-xl text-center border border-white/40 text-slate-500 text-sm">
          No reviews yet for this technician. Be the first to book and share your feedback!
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="glass-card p-6 rounded-xl border border-white/40 flex flex-col gap-3 text-left"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {review.reviewer?.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {review.reviewer?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-0.5 text-secondary-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${
                      i < review.rating ? 'fill-secondary-container text-secondary-container' : 'text-slate-200 dark:text-slate-850'
                    }`} 
                  />
                ))}
              </div>
            </div>
            
            {review.comment && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed pl-1">
                &quot;{review.comment}&quot;
              </p>
            )}
          </div>
        ))}
      </div>
    );
  } catch {
    return (
      <div className="text-center text-red-500 text-sm py-4">
        Failed to load reviews.
      </div>
    );
  }
}

export default async function TechnicianDetailPage({ params }: PageProps) {
  const { id } = await params;

  let technician;
  try {
    technician = await getTechnicianById(id);
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    }
    console.error('Error fetching technician:', err);
    notFound();
  }

  const name = technician.user?.name || 'Technician';

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-container-max mx-auto flex flex-col gap-6">
        
        {/* Back Link */}
        <Link 
          href="/technicians"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-505 hover:text-primary transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Technicians Directory
        </Link>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Bio Card */}
            <div className="glass-card p-8 rounded-2xl border border-white/40 flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-white/20 shadow-md">
                <img 
                  alt={name} 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">{name}</h1>
                  {technician.isVerified && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 border border-primary/20">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                  {technician.isAvailable ? (
                    <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-green-200 dark:border-green-900 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Available
                    </span>
                  ) : (
                    <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Busy
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 text-secondary-container">
                  <Star className="h-4.5 w-4.5 fill-secondary-container text-secondary-container" />
                  <span className="text-slate-800 dark:text-white font-bold text-sm ml-1">
                    {technician.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400 text-xs ml-1 font-semibold">
                    ({technician.totalReviews} reviews)
                  </span>
                </div>

                <p className="text-sm text-slate-505 dark:text-slate-400 leading-relaxed pt-2">
                  {technician.bio || 'Professional home service provider committed to delivering reliable maintenance solutions with a customer-first mindset.'}
                </p>
              </div>
            </div>

            {/* Skills / Specialty & Services Offered */}
            <div className="glass-card p-8 rounded-2xl border border-white/40 flex flex-col gap-6">
              <div>
                <h2 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-3">Specialties &amp; Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {technician.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="bg-primary-container/10 text-primary-container text-xs font-bold px-3.5 py-1.5 rounded-lg border border-primary-container/20 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-800/80 pt-6">
                <h2 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider mb-4">Services Offered</h2>
                {technician.services && technician.services.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {technician.services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-primary bg-white/30 hover:bg-white/60 dark:bg-slate-900/20 dark:hover:bg-slate-900/40 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">
                            {service.name}
                          </span>
                        </div>
                        <span className="text-xs font-black text-secondary-container">৳{service.basePrice}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No specific services listed currently.</p>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-primary flex items-center gap-1.5 px-1">
                <MessageSquare className="h-5 w-5 text-primary" /> Customer Reviews ({technician.totalReviews})
              </h2>
              <Suspense 
                fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-24 bg-slate-200 dark:bg-slate-850 rounded-xl" />
                    <div className="h-24 bg-slate-200 dark:bg-slate-850 rounded-xl" />
                  </div>
                }
              >
                <ReviewsSection technicianId={id} />
              </Suspense>
            </div>

          </div>

          {/* Booking Card Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/40 shadow-xl flex flex-col gap-5 text-left">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Hourly Rate</p>
                <p className="text-3xl font-black text-slate-850 dark:text-white mt-1">৳{technician.hourlyRate}<span className="text-xs font-normal text-slate-400">/hour</span></p>
              </div>

              <div className="space-y-2 border-y border-slate-200/50 dark:border-slate-800 py-4 text-xs text-slate-500 dark:text-slate-405">
                <div className="flex justify-between">
                  <span>Minimum Hours</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">1 Hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Availability Status</span>
                  <span className={`font-bold ${technician.isAvailable ? 'text-green-600' : 'text-amber-600'}`}>
                    {technician.isAvailable ? 'Online & Available' : 'Currently Booked'}
                  </span>
                </div>
              </div>

              {/* Auth-aware Booking CTA */}
              <TechnicianBookingCTA
                technicianId={technician.id}
                services={technician.services ?? []}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
