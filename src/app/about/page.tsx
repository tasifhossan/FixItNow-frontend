import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, Clock, Award, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Story</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About FixItNow
          </h1>
          <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
            FixItNow is a modern, on-demand marketplace connecting households with certified, highly vetted home service professionals.
          </p>
        </div>

        {/* Vision Card */}
        <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/40 shadow-lg flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Our Mission &amp; Vision
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-405 leading-relaxed">
            We believe that finding reliable help for home maintenance shouldn&apos;t be a stressful ordeal. By leveraging technology, we streamline the process of finding specialized technicians, scheduling appointments, and securing payments. We are building the most trusted home service network across the country.
          </p>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="glass-card p-6 rounded-xl border border-white/40 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/10">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Strict Vetting &amp; Safety</h3>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                Every technician profile is manually verified. We review background histories and professional license certifications so you can book with confidence.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="glass-card p-6 rounded-xl border border-white/40 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/10">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">On-Time Reliability</h3>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                Our scheduler reserves precise hourly slots. We enforce rigorous promptness policies, ensuring service pros respect your time and schedule.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="glass-card p-6 rounded-xl border border-white/40 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/10">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Customer-First Focus</h3>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                From simple diagnostics to complex fixes, our ratings and feedback system ensures service professionals keep their quality bar high.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="glass-card p-6 rounded-xl border border-white/40 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100/10">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Professional Growth</h3>
              <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                We empower independent tradespeople and service shops with the digital tooling to manage bookings, track schedules, and handle billing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Ready to get started?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Browse services or apply to join our specialist team.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/services"
              className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/10 flex items-center gap-1"
            >
              Browse Services <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
