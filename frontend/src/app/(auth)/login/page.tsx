'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { login } from '@/features/auth/api';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setLoginError(null);
    try {
      await login({ email: data.email, password: data.password });
      router.push('/products');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setLoginError(err.message || 'Invalid email or password. Please try again.');
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100">
        {/* Branding */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-200/80 p-1.5 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="CorpXcloud Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            CorpX<span className="text-blue-600">cloud</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">
            CMS Admin Console
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
                placeholder="admin@corpxcloud.com"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in to Admin...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-white/90" />
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-white/80 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 font-medium">
        © {new Date().getFullYear()} CorpXcloud. All rights reserved.
      </p>
    </div>
  );
}
