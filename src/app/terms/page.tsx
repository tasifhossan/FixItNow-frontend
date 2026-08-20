import React from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Legal Agreement</span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" /> Terms of Service
          </h1>
          <p className="text-xs text-slate-400">Last updated: August 20, 2026</p>
        </div>

        {/* Content Card */}
        <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/40 shadow-lg flex flex-col gap-6 leading-relaxed text-sm text-slate-650 dark:text-slate-400">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Shield className="h-5 w-5 text-blue-600" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using FixItNow (the &quot;Platform&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not register for or use the services.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">2. Role Definitions &amp; User Accounts</h2>
            <p>
              Users registering on the platform must select their appropriate role: **Customer** or **Technician**. You are responsible for safeguarding your credentials, and you agree to notify us immediately of any unauthorized access to your account.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs">
              <li>**Customers** are permitted to browse services, select technicians, and send booking requests.</li>
              <li>**Technicians** are independent service contractors responsible for completing work to professional standards and managing their own availability settings.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">3. Booking &amp; Cancellation Policies</h2>
            <p>
              Bookings represent a contract between Customer and Technician. Cancellations must be performed within eligible time constraints. Technicians reserve the right to accept or decline any service requests depending on schedule availability.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> 4. Payments &amp; Billing
            </h2>
            <p>
              Payments for accepted bookings are processed securely using verified checkout gateways (SSLCommerz / Stripe). Funds will be collected upon booking confirmation. Technicians will be paid out following successful job completion and status validation.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200/50 dark:border-slate-800 pt-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">5. Limitation of Liability</h2>
            <p>
              FixItNow acts as a service marketplace and is not liable for direct disputes, quality claims, or injury occurring between independent technicians and customers. We strongly encourage review and rating tracking to maintain high community safety standards.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
