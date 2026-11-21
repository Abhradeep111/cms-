'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { getService, updateService } from '@/features/services/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const schema = z.object({
  name: z.string().min(1, 'Service name is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().min(1, 'Short description is required'),
  detailed_description: z.string().optional(),
  icon: z.string().optional(),
  thumbnail_url: z.string().optional(),
  cta_label: z.string().optional(),
  cta_url: z.string().optional(),
  display_order: z.coerce.number(),
  status: z.enum(['draft', 'published', 'archived']),
  features: z.array(z.object({ value: z.string() })).optional(),
  benefits: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: '',
      slug: '',
      short_description: '',
      detailed_description: '',
      icon: '',
      thumbnail_url: '',
      cta_label: '',
      cta_url: '',
      display_order: 0,
      status: 'draft',
      features: [],
      benefits: [],
    },
  });

  const { register, control, handleSubmit, reset, formState: { errors } } = form;

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      setError(null);
      try {
        const s = await getService(id);
        reset({
          name: s.name,
          slug: s.slug,
          short_description: s.short_description || '',
          detailed_description: s.detailed_description || '',
          icon: s.icon || '',
          thumbnail_url: s.thumbnail_url || '',
          cta_label: s.cta_label || '',
          cta_url: s.cta_url || '',
          display_order: s.display_order || 0,
          status: s.status || 'draft',
          features: (s.features || []).map((f) => ({ value: f })),
          benefits: (s.benefits || []).map((b) => ({ value: b })),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadService();
    }
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await updateService(id, {
        ...values,
        features: (values.features || []).map((f) => f.value).filter(Boolean),
        benefits: (values.benefits || []).map((b) => b.value).filter(Boolean),
      });
      toast.success('Service updated successfully');
      router.push('/services');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl p-6">
        <LoadingSkeleton variant="rectangular" className="h-10 w-48 rounded-xl" />
        <LoadingSkeleton variant="card" className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto my-12">
        <p className="text-rose-500 font-medium mb-4">{error}</p>
        <Link
          href="/services"
          className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/services" className="hover:text-slate-600 transition-colors">Services</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Edit Service</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/services"
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Service</h1>
            <p className="text-sm text-slate-500 mt-0.5">Update details, capabilities, icons, and CTA links.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Service Name"
              placeholder="e.g., Financial Services & Banking Cloud"
              error={errors.name?.message}
              {...register('name')}
            />
            <FormInput
              label="URL Slug"
              placeholder="e.g., financial-services-banking"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <FormTextarea
            label="Short Description"
            rows={2}
            placeholder="Brief summary for service cards and grids..."
            error={errors.short_description?.message}
            {...register('short_description')}
          />

          <FormTextarea
            label="Detailed Description"
            rows={4}
            placeholder="Comprehensive description of capabilities and delivery..."
            error={errors.detailed_description?.message}
            {...register('detailed_description')}
          />
        </div>

        {/* Assets & Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Media & Calls-to-Action</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Icon (Name or URL)"
              placeholder="e.g., ShieldCheck or /icons/finance.svg"
              error={errors.icon?.message}
              {...register('icon')}
            />
            <FormInput
              label="Thumbnail URL"
              placeholder="e.g., /images/services/finance.webp"
              error={errors.thumbnail_url?.message}
              {...register('thumbnail_url')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="CTA Button Label"
              placeholder="e.g., Explore Solutions"
              error={errors.cta_label?.message}
              {...register('cta_label')}
            />
            <FormInput
              label="CTA URL"
              placeholder="e.g., /enterprise-solutions/finance"
              error={errors.cta_url?.message}
              {...register('cta_url')}
            />
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Features ({featureFields.length})</h2>
              <button
                type="button"
                onClick={() => appendFeature({ value: '' })}
                className="flex items-center gap-1 text-xs font-semibold text-royal hover:text-navy transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {featureFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormInput
                    placeholder="e.g., PCI-DSS & SOC2 compliant"
                    {...register(`features.${idx}.value` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Benefits ({benefitFields.length})</h2>
              <button
                type="button"
                onClick={() => appendBenefit({ value: '' })}
                className="flex items-center gap-1 text-xs font-semibold text-royal hover:text-navy transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {benefitFields.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-2">
                  <FormInput
                    placeholder="e.g., 99.999% transaction reliability"
                    {...register(`benefits.${idx}.value` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Publishing */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Publishing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              label="Publication Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'archived', label: 'Archived' },
              ]}
              {...register('status')}
            />

            <FormInput
              type="number"
              label="Display Order"
              placeholder="0"
              error={errors.display_order?.message}
              {...register('display_order')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/services"
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
