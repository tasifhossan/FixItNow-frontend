'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Clock,
  User,
  Wrench,
  CreditCard,
  Database,
  Palette,
  X,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface BookingRecord {
  id: string;
  displayId: string;
  customerName: string;
  customerInitials: string;
  technicianName: string;
  technicianInitials: string;
  serviceName: string;
  amount: number;
  scheduledDate: string;
  status: 'Requested' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  customerPhone?: string;
  technicianPhone?: string;
  paymentMethod?: string;
}

type StatusPillFilter = 'All' | 'Requested' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';

// ─── Figma Mock Data ─────────────────────────────────────────────────────────

const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: 'bkg-1',
    displayId: '#BKG-8892',
    customerName: 'Rafiq Ahmed',
    customerInitials: 'RA',
    technicianName: 'Jamal Uddin',
    technicianInitials: 'JU',
    serviceName: 'AC Repair & Maintenance',
    amount: 2500,
    scheduledDate: 'Oct 24, 2023',
    status: 'Completed',
    customerPhone: '+880 1712-345678',
    technicianPhone: '+880 1819-987654',
    paymentMethod: 'SSLCommerz (Online)',
  },
  {
    id: 'bkg-2',
    displayId: '#BKG-8893',
    customerName: 'Sadia Akter',
    customerInitials: 'SA',
    technicianName: 'Kamrul Hasan',
    technicianInitials: 'KH',
    serviceName: 'Plumbing Leak Fix',
    amount: 850,
    scheduledDate: 'Oct 24, 2023',
    status: 'In Progress',
    customerPhone: '+880 1515-112233',
    technicianPhone: '+880 1912-334455',
    paymentMethod: 'Cash on Service',
  },
  {
    id: 'bkg-3',
    displayId: '#BKG-8894',
    customerName: 'Farhana Yeasmin',
    customerInitials: 'FY',
    technicianName: 'Robiul Islam',
    technicianInitials: 'RI',
    serviceName: 'Fridge Repair',
    amount: 1800,
    scheduledDate: 'Oct 23, 2023',
    status: 'Requested',
    customerPhone: '+880 1616-998877',
    technicianPhone: '+880 1711-223344',
    paymentMethod: 'SSLCommerz (Online)',
  },
  {
    id: 'bkg-4',
    displayId: '#BKG-8895',
    customerName: 'Anisur Rahman',
    customerInitials: 'AR',
    technicianName: 'Abidur Rahman',
    technicianInitials: 'AR',
    serviceName: 'House Wiring Fix',
    amount: 3200,
    scheduledDate: 'Oct 22, 2023',
    status: 'Completed',
    customerPhone: '+880 1818-445566',
    technicianPhone: '+880 1313-778899',
    paymentMethod: 'SSLCommerz (Online)',
  },
  {
    id: 'bkg-5',
    displayId: '#BKG-8896',
    customerName: 'Nusrat Jahan',
    customerInitials: 'NJ',
    technicianName: 'Sabbir Ahmed',
    technicianInitials: 'SA',
    serviceName: 'Commode Fitting',
    amount: 1200,
    scheduledDate: 'Oct 21, 2023',
    status: 'Accepted',
    customerPhone: '+880 1919-667788',
    technicianPhone: '+880 1616-223344',
    paymentMethod: 'Cash on Service',
  },
  {
    id: 'bkg-6',
    displayId: '#BKG-8897',
    customerName: 'Imtiaz Ahmed',
    customerInitials: 'IA',
    technicianName: 'Jamal Uddin',
    technicianInitials: 'JU',
    serviceName: 'AC Water Leakage Fix',
    amount: 1500,
    scheduledDate: 'Oct 20, 2023',
    status: 'Cancelled',
    customerPhone: '+880 1717-556677',
    technicianPhone: '+880 1819-987654',
    paymentMethod: 'Refunded (SSLCommerz)',
  },
  {
    id: 'bkg-7',
    displayId: '#BKG-8898',
    customerName: 'Sabrina Khan',
    customerInitials: 'SK',
    technicianName: 'Kamrul Hasan',
    technicianInitials: 'KH',
    serviceName: 'Basin Pipe Replacement',
    amount: 600,
    scheduledDate: 'Oct 19, 2023',
    status: 'Completed',
    customerPhone: '+880 1515-443322',
    technicianPhone: '+880 1912-334455',
    paymentMethod: 'Cash on Service',
  },
  {
    id: 'bkg-8',
    displayId: '#BKG-8899',
    customerName: 'Tanvir Hasan',
    customerInitials: 'TH',
    technicianName: 'Robiul Islam',
    technicianInitials: 'RI',
    serviceName: 'Washing Machine Repair',
    amount: 2000,
    scheduledDate: 'Oct 18, 2023',
    status: 'Requested',
    customerPhone: '+880 1313-112233',
    technicianPhone: '+880 1711-223344',
    paymentMethod: 'SSLCommerz (Online)',
  },
  {
    id: 'bkg-9',
    displayId: '#BKG-8900',
    customerName: 'Jannatul Ferdous',
    customerInitials: 'JF',
    technicianName: 'Abidur Rahman',
    technicianInitials: 'AR',
    serviceName: 'Light & Board Install',
    amount: 900,
    scheduledDate: 'Oct 17, 2023',
    status: 'Completed',
    customerPhone: '+880 1616-554433',
    technicianPhone: '+880 1313-778899',
    paymentMethod: 'Cash on Service',
  },
  {
    id: 'bkg-10',
    displayId: '#BKG-8901',
    customerName: 'Kazi Arif',
    customerInitials: 'KA',
    technicianName: 'Sabbir Ahmed',
    technicianInitials: 'SA',
    serviceName: 'Kitchen Sink Unclogging',
    amount: 800,
    scheduledDate: 'Oct 16, 2023',
    status: 'Completed',
    customerPhone: '+880 1818-223344',
    technicianPhone: '+880 1616-223344',
    paymentMethod: 'Cash on Service',
  },
];

const TOTAL_ENTRIES = 256;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'Requested':
      return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'Accepted':
      return 'bg-purple-50 text-purple-600 border border-purple-100';
    case 'In Progress':
      return 'bg-blue-50 text-blue-600 border border-blue-100 animate-pulse';
    case 'Completed':
      return 'bg-green-50 text-green-600 border border-green-100';
    case 'Cancelled':
      return 'bg-red-50 text-red-600 border border-red-100';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-100';
  }
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function AdminBookingsOversightPage() {
  const [useMockData, setUseMockData] = useState(true);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusPillFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Selected Detail Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  const limitPerPage = 10;

  // Load Bookings Data
  useEffect(() => {
    if (useMockData) {
      setBookings(MOCK_BOOKINGS);
      setTotalRecords(TOTAL_ENTRIES);
    } else {
      fetchLiveData();
    }
  }, [useMockData, currentPage]);

  const fetchLiveData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/bookings', {
        params: {
          page: currentPage,
          limit: limitPerPage,
        },
      });
      const rawData = res.data.data.data || [];
      const total = res.data.data.meta?.total || rawData.length;

      const formatted: BookingRecord[] = rawData.map((b: any) => {
        const statusMap: Record<string, string> = {
          REQUESTED: 'Requested',
          ACCEPTED: 'Accepted',
          IN_PROGRESS: 'In Progress',
          COMPLETED: 'Completed',
          CANCELLED: 'Cancelled',
        };
        const custName = b.customer?.name || 'Customer';
        const techName = b.technician?.user?.name || 'Unassigned';

        return {
          id: b.id,
          displayId: `#BKG-${b.id.substring(0, 4).toUpperCase()}`,
          customerName: custName,
          customerInitials: custName.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2),
          technicianName: techName,
          technicianInitials: techName !== 'Unassigned' ? techName.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'UN',
          serviceName: b.service?.name || 'Home Service',
          amount: b.totalAmount || 0,
          scheduledDate: new Date(b.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: statusMap[b.status] || 'Requested',
          customerPhone: b.customer?.phone || '',
          technicianPhone: b.technician?.user?.phone || '',
          paymentMethod: b.payment?.method || 'SSLCommerz',
        };
      });

      setBookings(formatted);
      setTotalRecords(total);
    } catch (err) {
      console.error('Failed to load bookings from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Searching & Filtering (mock mode client side)
  const filteredBookings = useMemo(() => {
    if (!useMockData) return bookings; // API handles it in live mode ideally, but we display current fetched array

    return bookings.filter((b) => {
      // Search Match
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          b.displayId.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.technicianName.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Status Match
      if (statusFilter !== 'All') {
        if (b.status !== statusFilter) return false;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter, useMockData]);

  const totalPages = useMemo(() => {
    const total = useMockData ? filteredBookings.length : totalRecords;
    return Math.max(1, Math.ceil(total / limitPerPage));
  }, [filteredBookings, totalRecords, useMockData]);

  const displayedBookings = useMemo(() => {
    if (!useMockData) return bookings; // API already paginated it
    const startIdx = (currentPage - 1) * limitPerPage;
    return filteredBookings.slice(startIdx, startIdx + limitPerPage);
  }, [filteredBookings, currentPage, useMockData, bookings]);

  // Pagination texts
  const showingFrom = (currentPage - 1) * limitPerPage + 1;
  const showingTo = Math.min(currentPage * limitPerPage, useMockData ? filteredBookings.length : totalRecords);
  const totalToShow = useMockData ? filteredBookings.length : totalRecords;

  return (
    <div className="space-y-6 text-left">
      
      {/* ─── Page Title & Header Toggler ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bookings Oversight</h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Monitor and manage all marketplace transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mock/Live Toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-xl px-3 py-2 shadow-sm shrink-0">
            <Palette className={`h-3.5 w-3.5 transition-colors ${useMockData ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`text-[11px] font-semibold transition-colors ${useMockData ? 'text-blue-600' : 'text-slate-400'}`}>Mock</span>
            <button
              onClick={() => { setUseMockData(!useMockData); setCurrentPage(1); }}
              className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 ${
                useMockData ? 'bg-blue-600' : 'bg-emerald-50'
              }`}
            >
              <span
                className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                  useMockData ? 'left-[3px]' : 'left-[21px]'
                }`}
              />
            </button>
            <Database className={`h-3.5 w-3.5 transition-colors ${!useMockData ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className={`text-[11px] font-semibold transition-colors ${!useMockData ? 'text-emerald-600' : 'text-slate-400'}`}>Live</span>
          </div>

          {/* Export CSV button */}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-xl text-xs transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5 text-slate-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input Box */}
        <div className="flex items-center gap-2.5 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 w-full md:max-w-md">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Booking ID, Customer, or Technician..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-700 font-semibold placeholder:text-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          {(['All', 'Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'] as StatusPillFilter[]).map((pill) => {
            const isSelected = pill === statusFilter;
            return (
              <button
                key={pill}
                onClick={() => { setStatusFilter(pill); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

      </div>

      {/* ─── Table Layout Card ─── */}
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 font-medium">
                    Loading bookings oversight log...
                  </td>
                </tr>
              ) : displayedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                displayedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Booking ID */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline text-xs"
                      >
                        {b.displayId}
                      </button>
                    </td>

                    {/* Customer Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                          {b.customerInitials}
                        </div>
                        <span className="font-bold text-slate-800">{b.customerName}</span>
                      </div>
                    </td>

                    {/* Technician Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center border border-slate-200">
                          {b.technicianInitials}
                        </div>
                        <span className="font-bold text-slate-800">{b.technicianName}</span>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 text-slate-650 font-medium">
                      {b.serviceName}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-black text-slate-800">
                      ৳{b.amount.toLocaleString()}
                    </td>

                    {/* Scheduled Date */}
                    <td className="px-6 py-4 text-slate-500 font-semibold">
                      {b.scheduledDate}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        getStatusBadgeStyle(b.status)
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-semibold select-none">
            Showing {showingFrom} to {showingTo} of {totalToShow} entries
          </p>

          <div className="flex items-center gap-1 select-none">
            {/* Prev page */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Pages list */}
            {Array.from({ length: totalPages }).map((_, index) => {
              const p = index + 1;
              const isSelected = p === currentPage;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-[30px] h-[30px] rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 border border-blue-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {/* Next page */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── Selected Booking Detail Modal Overlay ─── */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 leading-none">
                  Booking Transaction Details
                </h3>
                <span className="text-[10px] font-bold text-slate-400 tracking-wide mt-2 block">
                  TRANSACTION ID: {selectedBooking.id.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Top Summary Banner */}
              <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Booking Code
                  </span>
                  <p className="text-lg font-black text-blue-600 leading-none mt-1">
                    {selectedBooking.displayId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </span>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      getStatusBadgeStyle(selectedBooking.status)
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service & Price Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Service Request
                </h4>
                <div className="flex justify-between items-center bg-white border border-slate-200/60 p-3.5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{selectedBooking.serviceName}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        Scheduled on {selectedBooking.scheduledDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-black text-slate-800 mt-0.5 block">
                      ৳{selectedBooking.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Technician details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer Details */}
                <div className="space-y-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                  <div className="flex items-center gap-2 text-slate-400">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Customer</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-bold text-slate-800 text-sm">{selectedBooking.customerName}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {selectedBooking.customerPhone || 'Phone: Not provided'}
                    </p>
                  </div>
                </div>

                {/* Technician Details */}
                <div className="space-y-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Wrench className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Technician</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-bold text-slate-800 text-sm">{selectedBooking.technicianName}</p>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {selectedBooking.technicianPhone || 'Phone: Not provided'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Payment Details */}
              <div className="space-y-2 border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                <div className="flex items-center gap-2 text-slate-400">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Payment Transaction</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm font-semibold">
                  <span className="text-slate-500">Method</span>
                  <span className="text-slate-800">{selectedBooking.paymentMethod}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Close Transaction Log
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
