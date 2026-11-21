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
  is_visible: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded-xl w-48" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-24" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsSectionPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { heading: '', description: '', is_visible: true },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const fetchSection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminHomepageSection('products_section');
      reset({
        heading: data.heading ?? '',
        description: data.description ?? '',
        is_visible: data.is_visible ?? true,
      });
    } catch {
      setError('Failed to load section data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateAdminHomepageSection('products_section', values);
      toast.success('Products section updated successfully!');
    } catch {
      toast.error('Failed to update section. Please try again.');
    }
  };

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-slate-600 text-sm">{error}</p>
        <button
          onClick={fetchSection}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <span>Homepage</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Products Section</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products Section</h1>
        <p className="text-sm text-slate-500 mt-1">Edit homepage products section content</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Visibility */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <FormSwitch
            label="Section Visibility"
            description="Show or hide this section on the homepage"
            checked={watch('is_visible') ?? true}
            onChange={(val) => setValue('is_visible', val)}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
            Content
          </h2>
          <FormInput label="Heading" error={errors.heading?.message} {...register('heading')} />
          <FormTextarea label="Description" rows={4} {...register('description')} />
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100">
            💡 Individual products are managed in the <strong>Products</strong> section.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
