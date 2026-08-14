'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Flag,
  Search,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Shield,
  Ban,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
  isBlocked: boolean;
  createdAt: string;
  avatar?: string;
  displayId?: string;
}

type UserTypeFilter = 'All' | 'Customer' | 'Technician';
type StatusFilter = 'All' | 'Active' | 'Pending' | 'Blocked';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getRelativeTime(dateStr: string) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } catch {
    return '';
  }
}

function getUserStatus(user: UserRecord): 'Active' | 'Pending' | 'Blocked' {
  if (user.isBlocked) return 'Blocked';
  return 'Active';
}

function getStatusDotColor(status: string) {
  switch (status) {
    case 'Active': return 'bg-emerald-500';
    case 'Pending': return 'bg-amber-400';
    case 'Blocked': return 'bg-red-500';
    default: return 'bg-slate-400';
  }
}

function getStatusTextColor(status: string) {
  switch (status) {
    case 'Active': return 'text-emerald-600';
    case 'Pending': return 'text-amber-500';
    case 'Blocked': return 'text-red-500';
    default: return 'text-slate-500';
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'CUSTOMER':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          Customer
        </span>
      );
    case 'TECHNICIAN':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
          Technician
        </span>
      );
    case 'ADMIN':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-600 border border-purple-100">
          Admin
        </span>
      );
    default:
      return null;
  }
}

function generateDisplayId(user: UserRecord): string {
  if (user.displayId) return user.displayId;
  const prefix = user.role === 'TECHNICIAN' ? 'TEC' : 'CUS';
  return `#${prefix}-${user.id.substring(0, 4).toUpperCase()}`;
}

const AVATAR_COLORS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-500 text-white',
  'bg-purple-600 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-600 text-white',
];

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function UsersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-56 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-[400px] bg-slate-200 rounded-2xl" />
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<UserTypeFilter>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [actionsOpenId, setActionsOpenId] = useState<string | null>(null);
  const itemsPerPage = 4;

  const loadUsersData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page: currentPage, limit: itemsPerPage };
      if (searchQuery) params.searchTerm = searchQuery;
      if (userTypeFilter !== 'All') params.role = userTypeFilter.toUpperCase();

      const res = await api.get('/users', { params });
      const data = res.data.data;
      setUsers(data.data || []);
      setTotalEntries(data.meta?.total || 0);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, userTypeFilter]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search).get('search');
      if (search) {
        setSearchQuery(search);
      }
    }
  }, []);

  useEffect(() => {
    loadUsersData();
  }, [loadUsersData]);

  const displayedUsers = useMemo(() => {
    if (statusFilter === 'All') return users;
    return users.filter(user => {
      if (statusFilter === 'Active') return !user.isBlocked;
      if (statusFilter === 'Blocked') return user.isBlocked;
      return true;
    });
  }, [users, statusFilter]);

  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const totalDisplay = totalEntries.toLocaleString();
  const showingFrom = displayedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const showingTo = Math.min(currentPage * itemsPerPage, displayedUsers.length);

  const handleToggleBlock = async (userId: string) => {
    try {
      await api.patch(`/users/${userId}/toggle-block`);
      await loadUsersData();
    } catch (err) {
      console.error('Failed to toggle block:', err);
    }
    setActionsOpenId(null);
  };

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

  if (isLoading) return <UsersSkeleton />;

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Users */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Users</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">
              {totalDisplay}
            </p>
          </div>
        </div>

        {/* New Registrations */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">New Registrations</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">
              +12 <span className="text-xs font-semibold text-emerald-500 ml-1.5">this week</span>
            </p>
          </div>
        </div>

        {/* Flagged Accounts */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-3 bg-red-100 text-red-500 rounded-2xl">
            <Flag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Flagged Accounts</p>
            <p className="text-2xl font-extrabold text-slate-800 leading-tight">
              3
            </p>
          </div>
        </div>
      </div>

      {/* ─── Users Table Card ─── */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">

        {/* Filters Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* User Type Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User Type</span>
              <div className="flex items-center bg-slate-100/80 rounded-lg p-0.5">
                {(['All', 'Customer', 'Technician'] as UserTypeFilter[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setUserTypeFilter(type); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      userTypeFilter === type
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 transition-colors min-w-[90px]"
                >
                  {statusFilter}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                {statusDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[120px]">
                      {(['All', 'Active', 'Pending', 'Blocked'] as StatusFilter[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setStatusDropdownOpen(false); setCurrentPage(1); }}
                          className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                            statusFilter === status ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Search + Export + Add */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 w-48">
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Export */}
            <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>

            {/* Add User */}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Email &amp; Phone</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user, idx) => {
                  const status = getUserStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getAvatarColor(idx)}`}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm leading-tight">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              ID: {generateDisplayId(user)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Email & Phone */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{user.email}</p>
                        <p className="text-xs text-slate-400">{user.phone || 'Not provided'}</p>
                      </td>

                      {/* Join Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{formatDate(user.createdAt)}</p>
                        <p className="text-xs text-slate-400">{getRelativeTime(user.createdAt)}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${getStatusDotColor(status)}`} />
                          <span className={`text-sm font-medium ${getStatusTextColor(status)}`}>
                            {status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setActionsOpenId(actionsOpenId === user.id ? null : user.id)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {actionsOpenId === user.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActionsOpenId(null)} />
                              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 min-w-[150px]">
                                <button
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                  <Shield className="h-3.5 w-3.5" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleToggleBlock(user.id)}
                                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors ${
                                    user.isBlocked
                                      ? 'text-emerald-600 hover:bg-emerald-50'
                                      : 'text-red-600 hover:bg-red-50'
                                  }`}
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                  {user.isBlocked ? 'Unblock User' : 'Block User'}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
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
            Showing {showingFrom} to {showingTo} of {totalDisplay} entries
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
