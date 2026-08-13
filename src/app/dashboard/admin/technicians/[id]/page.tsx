'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

// ─── Mock Data Matching Figma ────────────────────────────────────────────────

const MOCK_APPLICATION = {
  id: 'mock-tech-1',
  displayId: '#APP-8492',
  submittedDate: 'Oct 24, 2023',
  status: 'Pending Verification' as const,
  technician: {
    name: 'Marcus Johnson',
    title: 'Master Electrician',
    experience: '8 Years Experience',
    email: 'marcus.j@example.com',
    phone: '(555) 123-4567',
    location: 'Seattle, WA Area',
    bio: 'Licensed electrician specializing in residential troubleshooting and smart home integrations. Committed to safety codes and clear communication with clients.',
    skills: ['Electrical Repair', 'Wiring Installation', 'Smart Home Setup'],
    avatarInitials: 'MJ',
  },
  documents: [
    {
      id: 'doc-1',
      title: 'Government ID Proof',
      filename: 'driver_license_front.jpg (2.4 MB)',
      icon: 'id' as const,
      iconBg: 'bg-blue-100 text-blue-600',
      verified: false,
    },
    {
      id: 'doc-2',
      title: 'Professional License',
      filename: 'wa_state_electrician_license.pdf (1.1 MB)',
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
  ],
  equipment: [
    { label: 'Complete Electrical Toolkit', icon: 'wrench' },
    { label: 'Work Van (Insured)', icon: 'truck' },
    { label: 'Multimeter & Testing Gear', icon: 'gauge' },
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TechnicianReviewPage() {
  const app = MOCK_APPLICATION;

  const [checks, setChecks] = useState({
    identityVerified: true,
    licenseValid: true,
    backgroundClear: false,
  });
  const [adminNotes, setAdminNotes] = useState('');
  const [actionTaken, setActionTaken] = useState<'approved' | 'rejected' | null>(null);

  const handleCheckChange = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = () => {
    setActionTaken('approved');
  };

  const handleReject = () => {
    setActionTaken('rejected');
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
            Application Review: {app.technician.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submitted on {app.submittedDate} • ID: {app.displayId}
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
            {app.status}
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
                {app.technician.avatarInitials}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800">{app.technician.name}</h2>
                <p className="text-sm text-slate-500 font-medium">
                  {app.technician.title} • {app.technician.experience}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {app.technician.skills.map((skill) => (
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
                    <span className="font-medium">{app.technician.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{app.technician.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium">{app.technician.location}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bio / Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{app.technician.bio}</p>
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
              {app.documents.map((doc) => (
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
              {app.equipment.map((eq) => (
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
                    onClick={handleReject}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors"
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
