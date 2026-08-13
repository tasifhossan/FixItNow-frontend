'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  ShieldCheck,
  Clock,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { Technician } from '@/lib/technicians';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TechListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  skill: string;
  skills: string[];
  isVerified: boolean;
  createdAt: string;
  displayId: string;
  averageRating: number;
  totalReviews: number;
}

type VerificationFilter = 'All' | 'Pending' | 'Verified' | 'Rejected';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getVerificationStatus(tech: TechListItem): 'Pending' | 'Verified' {
  return tech.isVerified ? 'Verified' : 'Pending';
}

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-500 text-white',
  'bg-purple-600 text-white',
  'bg-rose-500 text-white',
];

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TechniciansSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-[400px] bg-slate-200 rounded-2xl" />
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<TechListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<VerificationFilter>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const itemsPerPage = 5;

  const loadTechniciansData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const statsRes = await api.get('/admin/stats');
      const s = statsRes.data.data;
      setStats({
        total: s.totalTechnicians || 0,
        verified: s.totalVerifiedTechnicians || 0,
        pending: (s.totalTechnicians - s.totalVerifiedTechnicians) || 0,
        rejected: 0
      });

      // Fetch technicians
      const res = await api.get('/technicians', {
        params: { includeUnverified: true, page: currentPage, limit: itemsPerPage },
      });
      const allTechs: Technician[] = res.data.data.data || [];
      setTechnicians(
        allTechs.map((tech, idx) => ({
          id: tech.id,
          name: tech.user?.name || 'Unknown',
          email: tech.user?.email || '',
          phone: tech.user?.phone || null,
          skill: tech.skills?.[0] || 'Technician',
          skills: tech.skills || [],
          isVerified: tech.isVerified,
          createdAt: tech.user?.createdAt || '',
          displayId: `#APP-${String(idx + 1000).padStart(4, '0')}`,
          averageRating: tech.averageRating || 0,
          totalReviews: tech.totalReviews || 0,
        }))
      );
      setTotalEntries(res.data.data.meta?.total || allTechs.length);
    } catch (err) {
      console.error('Failed to load technicians:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadTechniciansData();
  }, [loadTechniciansData]);

  // Filtering (live data client side fallback for query/status match)
  const filteredTechnicians = technicians.filter((tech) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !tech.name.toLowerCase().includes(q) &&
        !tech.email.toLowerCase().includes(q) &&
        !tech.skill.toLowerCase().includes(q)
      )
        return false;
    }
    if (verificationFilter === 'Pending' && tech.isVerified) return false;
    if (verificationFilter === 'Verified' && !tech.isVerified) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));

  function getPageNumbers() {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    const seen = new Set<string>();
    return pages.filter(p => {
      const key = String(p);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  if (isLoading) return <TechniciansSkeleton />;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Technician Verification</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Technicians</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Verification</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">{stats.verified}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 bg-red-100 text-red-500 rounded-2xl">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Rejected</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <div className="flex items-center bg-slate-100/80 rounded-lg p-0.5">
                {(['All', 'Pending', 'Verified', 'Rejected'] as VerificationFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setVerificationFilter(filter); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      verificationFilter === filter
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 w-56">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Technician</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTechnicians.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-400">No technicians found.</td>
                </tr>
              ) : (
                filteredTechnicians.map((tech, idx) => {
                  const status = getVerificationStatus(tech);
                  return (
                    <tr key={tech.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                            {getInitials(tech.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{tech.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">ID: {tech.displayId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700 font-medium">{tech.skill}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {tech.skills.slice(0, 2).map((s) => (
                            <span key={s} className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-semibold rounded-md border border-blue-100">
                              {s}
                            </span>
                          ))}
                          {tech.skills.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">+{tech.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{tech.email}</p>
                        <p className="text-xs text-slate-400">{tech.phone || 'Not provided'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{formatDate(tech.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/admin/technicians/${tech.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-lg text-xs font-semibold transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Showing {filteredTechnicians.length} of {totalEntries} technicians
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-xs text-slate-400 font-medium">…</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`min-w-[30px] h-[30px] flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-500 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
