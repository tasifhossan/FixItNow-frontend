'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been sent to our support team!');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle text-left">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-blue-600" /> Contact Support
          </h1>
          <p className="text-base text-slate-500 max-w-xl leading-relaxed">
            Have questions about bookings, scheduling, or technical support? Drop us a line and we will reply as soon as possible.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Support Channels Info (Left column, 2 spans) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-md flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">Email Support</h4>
                <p className="text-xs text-slate-455 mt-1">support@fixitnow.com</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Average reply time: 2 hours</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-md flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">Phone Helpline</h4>
                <p className="text-xs text-slate-455 mt-1">+880 1700 000000</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Available Daily: 9 AM - 6 PM</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/40 shadow-md flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-850 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-850 dark:text-white">Corporate Headquarters</h4>
                <p className="text-xs text-slate-455 mt-1">House 23, Road 15, Banani, Dhaka</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Bangladesh</p>
              </div>
            </div>

          </div>

          {/* Contact Form Panel (Right column, 3 spans) */}
          <div className="lg:col-span-3 glass-card p-8 rounded-2xl border border-white/40 shadow-xl text-left">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
              Send a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fahim Rahman"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white/80 py-2.5 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. fahim@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white/80 py-2.5 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your query in detail..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white/80 py-2.5 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-550 hover:to-violet-550 active:scale-[0.99] text-white shadow-md text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
