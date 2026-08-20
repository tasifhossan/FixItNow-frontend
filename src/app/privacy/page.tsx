import React from 'react';
import { Lock, Eye, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Policy Agreement</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Lock className="h-8 w-8 text-blue-600" /> Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 20, 2026</p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/40 shadow-lg flex flex-col gap-6 leading-relaxed text-sm text-slate-650 dark:text-slate-400">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Eye className="h-5 w-5 text-blue-600" /> 1. Information We Collect
            </h2>
            <p>
              We collect information that you directly provide when registering an account, booking appointments, or interacting with payment forms. This includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>Profile data: Name, email address, phone number, and optional profile photo.</li>
              <li>Technician details: Biography, skill tags, hourly rate, and availability calendar settings.</li>
              <li>Booking details: Address specifications, problem notes, and service histories.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">2. How We Use Your Data</h2>
            <p>
              Your data is utilized strictly to facilitate services:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
              <li>To query and display technician profiles matching customer parameters.</li>
              <li>To send booking notifications, updates, and cancellation confirmations.</li>
              <li>To verify user identity and authorize private dashboard views via Next.js Middleware.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <CheckCircle className="h-5 w-5 text-green-600" /> 3. Data Protection &amp; Security
            </h2>
            <p>
              Password data is hashed using industry-standard cryptographic techniques (bcrypt with 12 salt rounds) prior to storage. Session refresh tokens are configured as HttpOnly cookies to defend against Cross-Site Scripting (XSS) exposures.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">4. Payment Processing Safety</h2>
            <p>
              Sensitive financial and billing credentials (such as credit card numbers) are processed directly by our external gateway partners (Stripe / SSLCommerz) over HTTPS and are never stored on our database servers.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
