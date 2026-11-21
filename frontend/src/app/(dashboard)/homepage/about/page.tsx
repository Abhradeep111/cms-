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
  subheading: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  content_json: z.object({
    mission: z.string().optional(),
    vision: z.string().optional(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
  }).optional(),
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

export default function AboutSectionPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      heading: '',
      subheading: '',
      description: '',
      image_url: '',
      content_json: {
        mission: '',
        vision: '',
        stats: [
          { value: '100%', label: 'Tenant Isolation' },
          { value: '8+', label: 'Modular Solutions' },
          { value: '99.9%', label: 'Targeted Uptime' },
          { value: '0', label: 'Data Redundancy' },
        ],
      },
      is_visible: true,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const fetchSection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminHomepageSection('about');
      const cj = (data.content_json as any) ?? {};
      const statsList = (Array.isArray(cj.stats) && cj.stats.length === 4)
        ? cj.stats
        : [
            { value: '100%', label: 'Tenant Isolation' },
            { value: '8+', label: 'Modular Solutions' },
            { value: '99.9%', label: 'Targeted Uptime' },
            { value: '0', label: 'Data Redundancy' },
          ];

      reset({
        heading: data.heading ?? '',
        subheading: data.subheading ?? '',
        description: data.description ?? '',
        image_url: data.image_url ?? '',
        content_json: {
          mission: cj.mission ?? '',
          vision: cj.vision ?? '',
          stats: statsList,
        },
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
      await updateAdminHomepageSection('about', values);
      toast.success('About section updated successfully!');
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
        <span className="text-slate-700 font-medium">About Section</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">About Section</h1>
        <p className="text-sm text-slate-500 mt-1">Edit homepage about section content</p>
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
          <FormInput label="Subheading" {...register('subheading')} />
          <FormTextarea label="Description" rows={4} {...register('description')} />
          <FormInput label="Image URL" {...register('image_url')} />
        </div>

        {/* Mission & Vision */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-3">
            Mission & Vision
          </h2>
          <FormTextarea label="Mission Statement" rows={4} {...register('content_json.mission')} />
          <FormTextarea label="Vision Statement" rows={4} {...register('content_json.vision')} />
        </div>

        {/* Quick Highlights / Statistics */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Quick Statistics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              4 key platform metrics displayed on the About page (e.g. 100% Tenant Isolation, 8+ Modular Solutions)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Metric #{idx + 1}</span>
                <FormInput
                  label="Value"
                  placeholder="e.g. 100%, 8+, 99.9%, 0"
                  {...register(`content_json.stats.${idx}.value` as any)}
                />
                <FormInput
                  label="Label"
                  placeholder="e.g. Tenant Isolation"
                  {...register(`content_json.stats.${idx}.label` as any)}
                />
              </div>
            ))}
          </div>
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
