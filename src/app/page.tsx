'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, accessToken, isLoading } = useAuth();

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.slate.50))] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.950),theme(colors.slate.950))]" />
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Main hero & info card container */}
      <div className="w-full max-w-3xl text-center space-y-12">
        {/* Welcome Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50/50 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-850/50 dark:bg-indigo-950/30 dark:text-indigo-400">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            Phase 0: Scaffold &amp; Auth Complete
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Home Services,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Welcome to the frontend shell of <strong>FixItNow</strong>. The authentication plumbing and base project scaffold are fully operational.
          </p>
        </div>

        {/* Auth Inspector Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 sm:p-8 text-left shadow-xl shadow-slate-100/40 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Session Inspector</h2>
              <p className="text-xs text-slate-400 dark:text-slate-505">Inspect and verify state values live.</p>
            </div>
            <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-950 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-400/20">
              React Context
            </span>
          </div>

          <div className="space-y-4 text-sm">
            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-3 py-4">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ) : user ? (
              // Logged In State details
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      User Name
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{user.name}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{user.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Role
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1">
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      User ID
                    </span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono break-all">
                      {user.id}
                    </code>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Access Token
                    </span>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono break-all line-clamp-2">
                      {accessToken ? `${accessToken.substring(0, 40)}...` : 'None'}
                    </code>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Phone Number
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{user.phone}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Logged Out State details
              <div className="py-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No active session found</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Use the navigation links in the header to mock auth page flows.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
