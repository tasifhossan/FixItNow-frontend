'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Building2, 
  Droplet, 
  Zap, 
  Snowflake, 
  Refrigerator, 
  Paintbrush, 
  Sparkles, 
  Hammer, 
  Bug, 
  Calendar, 
  ArrowRight,
  StarHalf
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle text-on-surface antialiased transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Hero Column */}
          <div className="flex flex-col gap-stack-lg text-left">
            <div className="flex flex-col gap-stack-sm">
              <h1 className="font-bold text-primary text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Trusted Home Services, On Demand
              </h1>
              <p className="text-body-lg text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                Connect with highly vetted, verified technicians for all your home repair and maintenance needs. Fast, reliable, and guaranteed.
              </p>
            </div>
            
            {/* Search Input Card */}
            <div className="glass-card p-4 rounded-xl flex flex-col md:flex-row gap-3 w-full max-w-xl shadow-md border border-white/40">
              <div className="flex-1 flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-white/50 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm py-3 px-2 placeholder-slate-400 outline-none" 
                  placeholder="What do you need help with?" 
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center border border-slate-200 dark:border-slate-800 rounded-lg px-3 bg-white/50 focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm py-3 px-2 placeholder-slate-400 outline-none" 
                  placeholder="Zip code or City" 
                  type="text"
                />
              </div>
            </div>
            
            {/* Call to Actions */}
            <div className="flex flex-wrap gap-stack-sm mt-2">
              <Link 
                href="/auth/register"
                className="px-8 py-4 bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center min-h-[48px]"
              >
                Book a Service
              </Link>
              <button 
                className="px-8 py-4 bg-transparent border border-primary text-primary hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 rounded-lg text-sm font-bold transition-all min-h-[48px]"
              >
                Browse Technicians
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              alt="Smiling technician fixing a sink" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Trust Bar Section */}
      <section className="glass-panel py-6 relative z-10 border-y border-white/40 shadow-sm">
        <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-2xl font-bold text-primary leading-tight">10,000+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Verified Pros</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-2xl font-bold text-primary leading-tight">50k+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jobs Done</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-secondary-container fill-secondary-container shrink-0" />
            <div className="text-left">
              <p className="text-2xl font-bold text-primary leading-tight">4.9/5</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-2xl font-bold text-primary leading-tight">20+</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-container-max mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-bold text-primary tracking-tight">Popular Services</h2>
            <p className="text-slate-505 dark:text-slate-400">Find the right professional for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Plumbing */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Droplet className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Plumbing</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳500</p>
              </div>
            </div>

            {/* Electrical */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Electrical</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳400</p>
              </div>
            </div>

            {/* AC Repair */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Snowflake className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">AC Repair</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳800</p>
              </div>
            </div>

            {/* Appliance Repair */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Refrigerator className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Appliance Repair</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳600</p>
              </div>
            </div>

            {/* Painting */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Paintbrush className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Painting</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳1000</p>
              </div>
            </div>

            {/* Cleaning */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cleaning</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳700</p>
              </div>
            </div>

            {/* Carpentry */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Hammer className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Carpentry</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳500</p>
              </div>
            </div>

            {/* Pest Control */}
            <div className="glass-card p-6 rounded-xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/40">
              <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors duration-250">
                <Bug className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pest Control</h3>
                <p className="text-sm font-semibold text-secondary-container mt-1">From ৳800</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary-container/5 relative">
        <div className="max-w-container-max mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-bold text-primary tracking-tight">How It Works</h2>
            <p className="text-slate-505 dark:text-slate-400">Getting your home fixed is as easy as 1-2-3.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200/50 z-0"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-primary-container relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center font-bold text-sm">1</div>
                <Search className="h-9 w-9 text-primary-container" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Browse &amp; Select</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Find the right service and browse verified technicians in your area.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-primary-container relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center font-bold text-sm">2</div>
                <Calendar className="h-9 w-9 text-primary-container" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Book a Slot</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Choose a convenient time and book your appointment instantly.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full glass-card flex items-center justify-center border-2 border-primary-container relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary-container text-white flex items-center justify-center font-bold text-sm">3</div>
                <Hammer className="h-9 w-9 text-primary-container" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Get it Fixed</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Our pro arrives on time and fixes the issue with guaranteed quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top-Rated Pros Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-container-max mx-auto flex flex-col gap-12">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6">
            <div className="text-left">
              <h2 className="text-3xl font-bold text-primary tracking-tight">Top-Rated Pros</h2>
              <p className="text-slate-505 dark:text-slate-400 mt-1">Meet our highest rated professionals in your area.</p>
            </div>
            <button className="text-primary-container font-bold text-sm hover:text-primary transition-colors flex items-center gap-1">
              View All Pros <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tech Card 1 */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group border border-white/40">
              <div className="h-48 overflow-hidden">
                <img 
                  alt="Mike Johnson" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Mike Johnson</h3>
                  <p className="text-xs text-primary-container font-bold uppercase tracking-wider mt-1">Master Electrician</p>
                </div>
                <div className="flex items-center gap-0.5 text-secondary-container">
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <StarHalf className="h-4.5 w-4.5 fill-secondary-container" />
                  <span className="text-slate-450 text-xs ml-1 font-semibold">4.9 (120 reviews)</span>
                </div>
                <button className="mt-2 w-full py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all outline-none">
                  View Profile
                </button>
              </div>
            </div>

            {/* Tech Card 2 */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group border border-white/40">
              <div className="h-48 overflow-hidden">
                <img 
                  alt="Sarah Lee" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Sarah Lee</h3>
                  <p className="text-xs text-primary-container font-bold uppercase tracking-wider mt-1">Expert Plumber</p>
                </div>
                <div className="flex items-center gap-0.5 text-secondary-container">
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <span className="text-slate-450 text-xs ml-1 font-semibold">5.0 (95 reviews)</span>
                </div>
                <button className="mt-2 w-full py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all outline-none">
                  View Profile
                </button>
              </div>
            </div>

            {/* Tech Card 3 */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group border border-white/40">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img 
                  alt="David Chen" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">David Chen</h3>
                  <p className="text-xs text-primary-container font-bold uppercase tracking-wider mt-1">HVAC Specialist</p>
                </div>
                <div className="flex items-center gap-0.5 text-secondary-container">
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 text-slate-200 dark:text-slate-700" />
                  <span className="text-slate-450 text-xs ml-1 font-semibold">4.0 (42 reviews)</span>
                </div>
                <button className="mt-2 w-full py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all outline-none">
                  View Profile
                </button>
              </div>
            </div>

            {/* Tech Card 4 */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300 group border border-white/40">
              <div className="h-48 overflow-hidden">
                <img 
                  alt="Elena Rodriguez" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
                />
              </div>
              <div className="p-6 flex flex-col gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Elena Rodriguez</h3>
                  <p className="text-xs text-primary-container font-bold uppercase tracking-wider mt-1">Appliance Repair</p>
                </div>
                <div className="flex items-center gap-0.5 text-secondary-container">
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <Star className="h-4.5 w-4.5 fill-secondary-container" />
                  <StarHalf className="h-4.5 w-4.5 fill-secondary-container" />
                  <span className="text-slate-450 text-xs ml-1 font-semibold">4.8 (210 reviews)</span>
                </div>
                <button className="mt-2 w-full py-2 border border-primary text-primary rounded-lg text-sm font-bold hover:bg-slate-100/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all outline-none">
                  View Profile
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/30 relative">
        <div className="max-w-container-max mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-bold text-primary tracking-tight">What Our Customers Say</h2>
            <p className="text-slate-505 dark:text-slate-400">Real reviews from people who found reliable help through FixItNow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 text-left border border-white/40">
              <div className="flex items-center gap-0.5 text-secondary-container">
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
              </div>
              <p className="text-sm text-on-surface italic flex-grow leading-relaxed">
                &quot;My AC broke down in the middle of summer. Found David through FixItNow, he arrived within two hours and fixed it perfectly. Highly recommended!&quot;
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800">
                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">J</div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Joanna T.</p>
                  <p className="text-xs text-slate-455 font-medium">Homeowner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 text-left border border-white/40">
              <div className="flex items-center gap-0.5 text-secondary-container">
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
              </div>
              <p className="text-sm text-on-surface italic flex-grow leading-relaxed">
                &quot;As a property manager, finding reliable plumbers is tough. Sarah has been a lifesaver. The platform makes booking and tracking so easy.&quot;
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800">
                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">A</div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Amanda w.</p>
                  <p className="text-xs text-slate-455 font-medium">Property Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card p-8 rounded-xl flex flex-col gap-6 text-left border border-white/40">
              <div className="flex items-center gap-0.5 text-secondary-container">
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <Star className="h-5 w-5 fill-secondary-container" />
                <StarHalf className="h-5 w-5 fill-secondary-container" />
              </div>
              <p className="text-sm text-on-surface italic flex-grow leading-relaxed">
                &quot;Great experience end-to-end. The pricing was transparent, and the technician was very professional and cleaned up after the job.&quot;
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800">
                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">M</div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Michael R.</p>
                  <p className="text-xs text-slate-455 font-medium">Verified Customer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Skilled Pro Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="flex flex-col gap-4 md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold">Are you a skilled professional?</h2>
            <p className="text-base text-on-primary/80 max-w-2xl mt-1 leading-relaxed">
              Join FixItNow to connect with thousands of customers looking for your expertise. Grow your business, manage your schedule, and get paid securely.
            </p>
            <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
              <li className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary-container fill-secondary-container shrink-0" /> 
                Set your own rates
              </li>
              <li className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary-container fill-secondary-container shrink-0" /> 
                Flexible hours
              </li>
              <li className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-secondary-container fill-secondary-container shrink-0" /> 
                Guaranteed payments
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 flex justify-start md:justify-end w-full">
            <Link 
              href="/auth/register"
              className="px-8 py-4 bg-secondary-container text-on-secondary-container hover:brightness-110 active:scale-95 rounded-lg text-sm font-bold shadow-lg w-full md:w-auto text-center"
            >
              Apply as a Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-inverse-surface dark:bg-surface-container-lowest mt-auto border-t border-slate-200/10">
        <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8 py-12 text-slate-350 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold text-white">FixItNow</span>
            <p className="text-sm text-slate-400 mt-2">© 2024 FixItNow. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:items-end gap-3 text-sm">
            <a className="text-slate-400 hover:text-white transition-colors" href="#">About Us</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
