'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, ShieldCheck, Mail, Lock, Phone, UserCheck } from 'lucide-react';

// Zod registration schema matching the backend constraints
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /\d/.test(val), {
      message: 'Password must contain at least one number',
    }),
  phone: z.string().min(5, 'Phone number must be at least 5 characters'),
  role: z.enum(['CUSTOMER', 'TECHNICIAN'], {
    message: 'Please select a role',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Execute registration call
      await registerUser(data);
      toast.success('Registration successful! Please log in.');
      router.push('/auth/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Join FixItNow to book services or offer your technician expertise.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <User className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
                errors.name
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>
          )}
        </div>

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

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Phone className="h-4.5 w-4.5" />
            </span>
            <input
              type="tel"
              placeholder="01711223344"
              {...register('phone')}
              className={`w-full rounded-lg border bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone.message}</p>
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

        {/* Role Segmented Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            I want to register as a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Customer Role Option */}
            <button
              type="button"
              onClick={() => setValue('role', 'CUSTOMER')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-250 cursor-pointer ${
                selectedRole === 'CUSTOMER'
                  ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 ring-2 ring-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <UserCheck className="h-5 w-5 mb-1.5" />
              <span className="text-xs font-bold">Customer</span>
              <span className="text-3xs text-slate-400 dark:text-slate-505 mt-0.5">Need home services</span>
            </button>

            {/* Technician Role Option */}
            <button
              type="button"
              onClick={() => setValue('role', 'TECHNICIAN')}
              className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-250 cursor-pointer ${
                selectedRole === 'TECHNICIAN'
                  ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700 ring-2 ring-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <ShieldCheck className="h-5 w-5 mb-1.5" />
              <span className="text-xs font-bold">Technician</span>
              <span className="text-3xs text-slate-400 dark:text-slate-505 mt-0.5">Offer services</span>
            </button>
          </div>
          {errors.role && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.role.message}</p>
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
            'Register'
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-850">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
