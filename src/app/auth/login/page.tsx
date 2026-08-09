'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(data.email, data.password);
      toast.success('Login successful!');
      const dashboardPath = `/dashboard/${loggedInUser.role.toLowerCase()}`;
      router.push(dashboardPath);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please verify your credentials.';
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="h-4.5 w-4.5" />
            </span>
            <input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="h-4.5 w-4.5" />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
                errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-550 hover:to-violet-550 hover:shadow-indigo-500/20 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            'Log In'
          )}
        </button>
      </form>

      {/* Register link */}
      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-850">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don&#39;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
