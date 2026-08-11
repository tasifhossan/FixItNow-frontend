import React, { Suspense } from 'react';
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
  ArrowRight,
  Wrench,
  Calendar,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { getTechnicians } from '../lib/technicians';

// Popular Services Static Data (aligned with the design mockup)
const POPULAR_SERVICES = [
  {
    name: 'Plumbing',
    price: 500,
    icon: <Droplet className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Plumbing'
  },
  {
    name: 'Electrical',
    price: 400,
    icon: <Zap className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Electrical'
  },
  {
    name: 'AC Repair',
    price: 700,
    icon: <Snowflake className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=AC'
  },
  {
    name: 'Appliance Repair',
    price: 350,
    icon: <Refrigerator className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Appliance'
  },
  {
    name: 'Painting',
    price: 600,
    icon: <Paintbrush className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Painting'
  },
  {
    name: 'Cleaning',
    price: 1500,
    icon: <Sparkles className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Cleaning'
  },
  {
    name: 'Carpentry',
    price: 800,
    icon: <Hammer className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Carpentry'
  },
  {
    name: 'Pest Control',
    price: 200,
    icon: <Bug className="h-7 w-7 text-blue-600" />,
    link: '/services?searchTerm=Pest'
  }
];

// Fallback Mock Technicians (from the landing page mockup)
const MOCK_PROS = [
  {
    id: 'mock-1',
    name: 'Mike Johnson',
    role: 'MASTER ELECTRICIAN',
    rating: 4.9,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'mock-2',
    name: 'Sarah Lee',
    role: 'EXPERT PLUMBER',
    rating: 5.0,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'mock-3',
    name: 'David Chen',
    role: 'HVAC SPECIALIST',
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'mock-4',
    name: 'Elena Rodriguez',
    role: 'APPLIANCE REPAIR',
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  }
];

function TechniciansSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm animate-pulse">
          <div className="h-56 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-2/3 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-9 w-full bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Dynamically fetch and display top-rated pros, filling remaining spots with mock pros if less than 4
async function TopRatedProsSection() {
  let displayPros = [...MOCK_PROS];

  try {
    const response = await getTechnicians({ limit: 4 });
    const realTechnicians = response.data;

    if (realTechnicians && realTechnicians.length > 0) {
      // Format real technicians to match design schema
      const formattedReal = realTechnicians.map((tech) => ({
        id: tech.id,
        name: tech.user?.name || 'Technician',
        role: (tech.skills[0] || 'Specialist').toUpperCase(),
        rating: tech.averageRating || 5.0,
        reviews: tech.totalReviews || 12,
        // Reuse original profile image URL
        image: 'https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw'
      }));

      // Merge: real technicians first, then mock ones to pad to 4
      displayPros = [...formattedReal, ...MOCK_PROS].slice(0, 4);
    }
  } catch (error) {
    console.error('Failed to load top rated technicians:', error);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayPros.map((pro) => (
        <div 
          key={pro.id}
          className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
        >
          {/* Card Image */}
          <div className="h-56 overflow-hidden bg-slate-50 relative">
            <img 
              alt={pro.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              src={pro.image}
              loading="lazy"
            />
          </div>
          
          {/* Card Info */}
          <div className="p-5 flex flex-col gap-3 text-left flex-1 justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 line-clamp-1">{pro.name}</h3>
              <p className="text-xs text-blue-600 font-bold tracking-wider uppercase">
                {pro.role}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(pro.rating) 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-slate-200'
                    }`} 
                  />
                ))}
                <span className="text-slate-500 text-xs ml-1 font-semibold">
                  {pro.rating.toFixed(1)} ({pro.reviews} reviews)
                </span>
              </div>
            </div>

            {/* View Profile CTA */}
            <Link 
              href={pro.id.startsWith('mock-') ? '/technicians' : `/technicians/${pro.id}`}
              className="mt-2 w-full py-2.5 bg-transparent border border-blue-600 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      
      {/* ─── Hero Section ─── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-6 text-left">
            <h1 className="font-extrabold text-blue-600 text-4xl sm:text-5xl lg:text-[54px] tracking-tight leading-[1.15]">
              Trusted Home Services,<br />On Demand
            </h1>
            <p className="text-base text-slate-500 max-w-lg leading-relaxed">
              Connect with highly vetted, verified technicians for all your home repair and maintenance needs. Fast, reliable, and guaranteed.
            </p>
            
            {/* Search Input Form */}
            <form action="/services" method="GET" className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row gap-2.5 w-full max-w-xl shadow-sm">
              <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-3 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  name="searchTerm"
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 text-sm py-2.5 px-2 placeholder-slate-400 outline-none" 
                  placeholder="What do you need help with?" 
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center border border-slate-200 rounded-xl px-3 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 text-sm py-2.5 px-2 placeholder-slate-400 outline-none" 
                  placeholder="Zip code or City" 
                  type="text"
                />
              </div>
            </form>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3.5 mt-2">
              <Link 
                href="/services"
                className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-100 transition-all flex items-center justify-center min-h-[48px] active:scale-95"
              >
                Book a Service
              </Link>
              <Link 
                href="/technicians"
                className="px-7 py-3.5 bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all rounded-xl text-sm font-bold flex items-center justify-center min-h-[48px] active:scale-95"
              >
                Browse Technicians
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[450px] rounded-[24px] overflow-hidden shadow-xl shadow-blue-900/5">
            <img 
              alt="Smiling technician fixing home appliance" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLu55IfUGrQFjTmMKBT0DLAr96dINwJeTKRRYQ6CrtGr3XvAFxhf38UYmvp25ns4MIif-EDYDOJr5keMlS7AfjOUaX5kPJSGQhOIVHpClyQF5OOiiFSpUnrxGQcAWJBKjnr0F30kfROyMsEN3piy-t0ELwccyOOfW6Mjn1ap4vpd6Hx1yGrNd6kCEb1fTznSodOTkpDA08sW2SB1r3cIhhqCGhFiAXDEHgxKgUeSn43iXMRtYOp2wT0hwGw"
            />
          </div>
        </div>
      </section>
      
      {/* ─── Trust / Stats Bar Section ─── */}
      <section className="bg-white border-y border-slate-100 py-6 relative shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 justify-center text-left">
            <ShieldCheck className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 leading-tight">10,000+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Pros</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center text-left">
            <Briefcase className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 leading-tight">50k+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Jobs Done</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center text-left">
            <Star className="h-8 w-8 text-amber-500 fill-amber-500 shrink-0" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 leading-tight">4.9/5</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Avg Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center text-left">
            <Building2 className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 leading-tight">20+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Popular Services Section ─── */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">Popular Services</h2>
            <p className="text-slate-500 text-sm max-w-md">Find the right professional for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {POPULAR_SERVICES.map((service, idx) => (
              <Link 
                key={idx}
                href={service.link}
                className="bg-white border border-slate-100 hover:border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center transition-colors duration-250 group-hover:bg-blue-600 group-hover:text-white">
                  <span className="group-hover:text-white transition-colors">
                    {React.cloneElement(service.icon, {
                      className: 'h-7 w-7 text-blue-600 group-hover:text-white transition-colors'
                    })}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{service.name}</h3>
                  <p className="text-xs font-bold text-amber-600 mt-1">From ৳{service.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50/20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-sm">Getting your home fixed is as easy as 1-2-3.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-blue-100 z-0"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-2 border-blue-600 relative shadow-sm">
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  1
                </div>
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Browse &amp; Select</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Find the right service and browse verified technicians in your area.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-2 border-blue-600 relative shadow-sm">
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  2
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Book a Slot</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Choose a convenient time and book your appointment instantly.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-2 border-blue-600 relative shadow-sm">
                <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  3
                </div>
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Get It Fixed</h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Our pro arrives on time and fixes the issue with guaranteed quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Top-Rated Pros Section ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-slate-100 pb-5">
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">Top-Rated Pros</h2>
              <p className="text-slate-500 text-sm mt-1">Meet our highest rated professionals in your area.</p>
            </div>
            <Link 
              href="/technicians" 
              className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors flex items-center gap-1.5"
            >
              View All Pros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <Suspense fallback={<TechniciansSkeleton />}>
            <TopRatedProsSection />
          </Suspense>
        </div>
      </section>

      {/* ─── Customer Testimonials Section ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">What Our Customers Say</h2>
            <p className="text-slate-500 text-sm">Real reviews from people who found reliable help through FixItNow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-7 rounded-2xl flex flex-col gap-5 text-left border border-slate-100 shadow-sm justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;My AC broke down in the middle of summer. Found David through FixItNow, he arrived within two hours and fixed it perfectly. Highly recommended!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-2 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100/60 flex items-center justify-center font-bold text-blue-700 text-sm">
                  J
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">James T.</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Homeowner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-7 rounded-2xl flex flex-col gap-5 text-left border border-slate-100 shadow-sm justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;As a property manager, finding reliable plumbers is tough. Sarah has been a lifesaver. The platform makes booking and tracking so easy.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-2 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100/60 flex items-center justify-center font-bold text-blue-700 text-sm">
                  A
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Amanda W.</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Property Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-7 rounded-2xl flex flex-col gap-5 text-left border border-slate-100 shadow-sm justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  &quot;Great experience end-to-end. The pricing was transparent, and the technician was very professional and cleaned up after the job.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-2 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100/60 flex items-center justify-center font-bold text-blue-700 text-sm">
                  M
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Michael R.</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Skilled Pro CTA Banner ─── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="flex flex-col gap-4 md:w-2/3">
            <h2 className="text-3xl font-extrabold tracking-tight">Are you a skilled professional?</h2>
            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
              Join FixItNow to connect with thousands of customers looking for your expertise. Grow your business, manage your schedule, and get paid securely.
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 mt-2">
              <li className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" /> 
                Set your own rates
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" /> 
                Flexible hours
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" /> 
                Guaranteed payments
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 flex justify-start md:justify-end w-full">
            <Link 
              href="/auth/register"
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-white transition-all font-bold text-sm rounded-xl text-center shadow-lg shadow-amber-600/30 w-full md:w-auto active:scale-95"
            >
              Apply as a Pro
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer Section ─── */}
      <footer className="w-full bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between gap-8 text-slate-400 text-left">
          <div className="flex flex-col gap-3">
            <span className="text-xl font-bold text-white tracking-tight">FixItNow</span>
            <p className="text-xs text-slate-500">© 2024 FixItNow. All rights reserved.</p>
          </div>
          <div className="flex flex-col md:items-end gap-3 text-xs font-medium">
            <a className="hover:text-white transition-colors" href="#">About Us</a>
            <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-white transition-colors" href="#">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
