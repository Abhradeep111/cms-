'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
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
      router.push('/dashboard');
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-200/80 p-1 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="CorpXcloud Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            CorpX<span className="text-sky-500">cloud</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
            CMS Admin
          </p>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                errors.email
                  ? 'border-red-400 bg-red-50'
                  : 'border-slate-300 bg-white'
              }`}
              placeholder="admin@corpxcloud.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password')}
                className={`w-full px-3.5 py-2.5 pr-11 rounded-lg border text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.password
                    ? 'border-red-400 bg-red-50'
                    : 'border-slate-300 bg-white'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition"
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
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        © {new Date().getFullYear()} CorpXcloud. All rights reserved.
      </p>
    </div>
  );
}
