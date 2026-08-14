'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Clock,
  Wrench,
  Truck,
  Gauge,
  Info,
} from 'lucide-react';
import api from '@/lib/api';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TechnicianDetails {
  id: string;
  name: string;
  title: string;
  experience: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  avatarInitials: string;
  isVerified: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TechnicianReviewPage() {
  const { id } = useParams();
  const [tech, setTech] = useState<TechnicianDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [checks, setChecks] = useState({
    identityVerified: true,
    licenseValid: true,
    backgroundClear: false,
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [actionTaken, setActionTaken] = useState<'approved' | 'rejected' | null>(null);

  const fetchTechnician = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.get(`/technicians/${id}`);
      const t = res.data.data;
      const u = t.user || {};
      
      setTech({
        id: t.id,
        name: u.name || 'Unknown',
        title: t.skills?.[0] || 'Technician',
        experience: '5+ Years Experience',
        email: u.email || '',
        phone: u.phone || 'Not provided',
        location: 'Seattle, WA Area',
        bio: t.bio || 'No bio provided.',
        skills: t.skills || [],
        avatarInitials: (u.name || 'T').split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2),
        isVerified: t.isVerified,
      });
      if (t.isVerified) {
        setActionTaken('approved');
      }
    } catch (err) {
      console.error('Failed to load technician:', err);
      setErrorMsg('Failed to load technician details.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchTechnician();
  }, [id, fetchTechnician]);

  const handleCheckChange = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = async () => {
    setErrorMsg(null);
    try {
      await api.patch(`/technicians/${id}/verify`);
      setActionTaken('approved');
    } catch (error: unknown) {
      console.error('Failed to verify:', error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to approve application.');
    }
  };


  const getDocIcon = (icon: string) => {
    switch (icon) {
      case 'id': return <FileText className="h-5 w-5" />;
      case 'license': return <ShieldCheck className="h-5 w-5" />;
      case 'background': return <CheckCircle2 className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getEquipmentIcon = (icon: string) => {
    switch (icon) {
      case 'wrench': return <Wrench className="h-4 w-4 text-slate-500" />;
      case 'truck': return <Truck className="h-4 w-4 text-slate-500" />;
      case 'gauge': return <Gauge className="h-4 w-4 text-slate-500" />;
      default: return <Wrench className="h-4 w-4 text-slate-500" />;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-400">Loading review profile...</div>;
  }

  if (errorMsg && !tech) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
        <Info className="h-4 w-4 shrink-0 text-red-500" />
        <span>{errorMsg}</span>
      </div>
    );
  }

  if (!tech) return null;

  // Fake docs/equipment mapped dynamically
  const documents = [
    {
      id: 'doc-1',
      title: 'Government ID Proof',
      filename: `${tech.name.toLowerCase().replace(' ', '_')}_id.jpg (2.4 MB)`,
      icon: 'id' as const,
      iconBg: 'bg-blue-100 text-blue-600',
      verified: false,
    },
    {
      id: 'doc-2',
      title: 'Professional License',
      filename: `${tech.name.toLowerCase().replace(' ', '_')}_license.pdf (1.1 MB)`,
      icon: 'license' as const,
      iconBg: 'bg-amber-100 text-amber-600',
      verified: false,
    },
    {
      id: 'doc-3',
      title: 'Background Check Authorization',
      filename: 'Signed via DocuSign',
      icon: 'background' as const,
      iconBg: 'bg-emerald-100 text-emerald-600',
      verified: true,
    },
  ];

  const equipment = [
    { label: 'Complete Toolkit', icon: 'wrench' },
    { label: 'Work Van (Insured)', icon: 'truck' },
    { label: 'Multimeter & Testing Gear', icon: 'gauge' },
  ];

  return (
    <div className="space-y-6 text-left">

      {/* Back Link */}
      <Link
        href="/dashboard/admin/technicians"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Technicians
      </Link>

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Application Review: {tech.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ID: #APP-{tech.id.substring(0, 4).toUpperCase()}
          </p>
        </div>
        {actionTaken === 'approved' ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Approved
          </span>
        ) : actionTaken === 'rejected' ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-semibold">
            <XCircle className="h-4 w-4" />
            Rejected
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Pending Verification
          </span>
        )}
      </div>

      {/* Main Content: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ─── Left Column (2/3) ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            {/* Top: Avatar + Info */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                {tech.avatarInitials}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800">{tech.name}</h2>
                <p className="text-sm text-slate-500 font-medium">
                  {tech.title} • {tech.experience}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tech.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: Contact Info + Bio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{tech.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{tech.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{tech.location}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bio / Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{tech.bio}</p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
              <FileText className="h-5 w-5 text-slate-600" />
              <h3 className="font-bold text-slate-800 text-[15px]">Uploaded Documents</h3>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${doc.iconBg}`}>
                      {getDocIcon(doc.icon)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                      <p className="text-xs text-slate-400 font-medium">{doc.filename}</p>
                    </div>
                  </div>
                  {doc.verified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  ) : (
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Declared Equipment */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-[15px] pb-4 border-b border-slate-100 mb-4">
              Declared Equipment
            </h3>
            <div className="flex flex-wrap gap-3">
              {equipment.map((eq) => (
                <div
                  key={eq.label}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
                >
                  {getEquipmentIcon(eq.icon)}
                  {eq.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Column (1/3): Verification Decision ─── */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm sticky top-24 space-y-5">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Verification Decision</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Review all details carefully before making a final decision.
              </p>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-0.5">
                  <div
                    onClick={() => handleCheckChange('identityVerified')}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      checks.identityVerified
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  >
                    {checks.identityVerified && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium leading-snug">
                  Identity verified against Government ID
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-0.5">
                  <div
                    onClick={() => handleCheckChange('licenseValid')}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      checks.licenseValid
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  >
                    {checks.licenseValid && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium leading-snug">
                  Professional license is active and valid
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-0.5">
                  <div
                    onClick={() => handleCheckChange('backgroundClear')}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                      checks.backgroundClear
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}
                  >
                    {checks.backgroundClear && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-700 font-medium leading-snug">
                  Background check results clear
                </span>
              </label>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-medium text-slate-700 italic">
                Admin Notes (Internal only)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes regarding this decision..."
                rows={3}
                className="mt-2 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {actionTaken === 'approved' ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold border border-emerald-200">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  Application Approved
                </div>
              ) : actionTaken === 'rejected' ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-200">
                  <XCircle className="h-4.5 w-4.5" />
                  Application Rejected
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApprove}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="h-4.5 w-4.5" />
                    Approve Application
                  </button>
                  <button
                    disabled
                    title="Rejection not yet supported"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-55 text-slate-400 border border-slate-200 rounded-xl text-sm font-semibold cursor-not-allowed opacity-60"
                  >
                    <XCircle className="h-4.5 w-4.5" />
                    Reject Application
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    Request More Info
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
