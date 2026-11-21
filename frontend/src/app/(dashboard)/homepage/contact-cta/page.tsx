'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight } from 'lucide-react';
import { getAdminHomepageSection, updateAdminHomepageSection } from '@/features/homepage/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSwitch } from '@/components/forms/FormSwitch';

const schema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().optional(),
  primary_cta_label: z.string().optional(),
  primary_cta_url: z.string().optional(),
  image_url: z.string().optional(),
  is_visible: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded-xl w-48" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-24" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactCTAPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      heading: '',
      description: '',
      primary_cta_label: '',
      primary_cta_url: '',
      image_url: '',
      is_visible: true,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const fetchSection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminHomepageSection('contact_cta');
      reset({
        heading: data.heading ?? '',
        description: data.description ?? '',
        primary_cta_label: data.primary_cta_label ?? '',
        primary_cta_url: data.primary_cta_url ?? '',
        image_url: data.image_url ?? '',
        is_visible: data.is_visible ?? true,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load section');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateAdminHomepageSection('contact_cta', values);
      toast.success('Contact CTA banner updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save changes');
    }
  };

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <p className="text-rose-500 font-medium mb-4">{error}</p>
        <button
          onClick={fetchSection}
          className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Homepage</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Contact CTA Banner</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Call-to-Action</h1>
          <p className="text-sm text-slate-500 mt-1">Configure the conversion banner displayed near the bottom of the landing page.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Visibility</h2>
              <p className="text-xs text-slate-500">Show or hide the CTA banner on the landing page</p>
            </div>
            <FormSwitch
              checked={watch('is_visible') ?? true}
              onChange={(checked) => setValue('is_visible', checked, { shouldDirty: true })}
            />
          </div>

          <div className="space-y-4">
            <FormInput
              label="Banner Heading"
              placeholder="e.g., Ready to Modernize Your Enterprise Cloud?"
              error={errors.heading?.message}
              {...register('heading')}
            />

            <FormTextarea
              label="Banner Description"
              rows={3}
              placeholder="e.g., Speak with our architectural advisors today and discover how CorpXcloud accelerates time-to-market."
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Primary Button Label"
                placeholder="e.g., Book an Architecture Review"
                error={errors.primary_cta_label?.message}
                {...register('primary_cta_label')}
              />
              <FormInput
                label="Primary Button URL"
                placeholder="e.g., /book-demo"
                error={errors.primary_cta_url?.message}
                {...register('primary_cta_url')}
              />
            </div>

            <FormInput
              label="Background Image URL (optional)"
              placeholder="e.g., /images/cta-bg.webp"
              error={errors.image_url?.message}
              {...register('image_url')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={fetchSection}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
