'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import { getGeneralSettings, updateGeneralSettings } from '@/features/settings/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const schema = z.object({
  site_name: z.string().min(1, 'Site name is required'),
  site_tagline: z.string().optional(),
  site_description: z.string().optional(),
  site_url: z.string().url().optional().or(z.literal('')),
  logo_light: z.string().optional(),
  logo_dark: z.string().optional(),
  favicon: z.string().optional(),
  maintenance_mode: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      site_name: '',
      site_tagline: '',
      site_description: '',
      site_url: '',
      logo_light: '',
      logo_dark: '',
      favicon: '',
      maintenance_mode: false,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await getGeneralSettings();
        if (data) {
          reset({
            site_name: data.site_name || '',
            site_tagline: data.site_tagline || '',
            site_description: data.site_description || '',
            site_url: data.site_url || '',
            logo_light: data.logo_light || '',
            logo_dark: data.logo_dark || '',
            favicon: data.favicon || '',
            maintenance_mode: data.maintenance_mode || false,
          });
        }
      } catch (err: any) {
        error(err.message || 'Failed to load site settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [error, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateGeneralSettings(values);
      success('General site settings saved successfully');
    } catch (err: any) {
      error(err.message || 'Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <LoadingSkeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
        <LoadingSkeleton variant="card" className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure site identity, branding assets, production domain, and maintenance controls.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Site Name"
              placeholder="CorpXcloud"
              error={errors.site_name?.message}
              {...register('site_name')}
            />
            <FormInput
              label="Tagline"
              placeholder="Enterprise Multi-Cloud Infrastructure"
              error={errors.site_tagline?.message}
              {...register('site_tagline')}
            />
          </div>

          <FormTextarea
            label="Site Description"
            rows={3}
            placeholder="Default meta description and branding copy for CorpXcloud..."
            error={errors.site_description?.message}
            {...register('site_description')}
          />

          <FormInput
            label="Production Base URL"
            placeholder="https://corpxcloud.com"
            error={errors.site_url?.message}
            {...register('site_url')}
          />
        </div>

        {/* Brand Assets */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Logos & Icons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Light Logo URL"
              placeholder="/images/logo-light.svg"
              error={errors.logo_light?.message}
              {...register('logo_light')}
            />
            <FormInput
              label="Dark Logo URL"
              placeholder="/images/logo-dark.svg"
              error={errors.logo_dark?.message}
              {...register('logo_dark')}
            />
          </div>

          <FormInput
            label="Favicon URL"
            placeholder="/favicon.ico"
            error={errors.favicon?.message}
            {...register('favicon')}
          />
        </div>

        {/* Maintenance Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
            Maintenance Mode
          </h2>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-amber-900">Enable Maintenance Mode</h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    When active, public visitors will see a maintenance page instead of the landing page.
                  </p>
                </div>
                <FormSwitch
                  checked={watch('maintenance_mode')}
                  onChange={(checked) => setValue('maintenance_mode', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
