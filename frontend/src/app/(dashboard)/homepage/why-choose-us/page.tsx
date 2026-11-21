'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Plus, Trash2, GripVertical } from 'lucide-react';
import { getAdminHomepageSection, updateAdminHomepageSection } from '@/features/homepage/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSwitch } from '@/components/forms/FormSwitch';

const featureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const schema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  description: z.string().optional(),
  is_visible: z.boolean().optional(),
  features: z.array(featureSchema).optional(),
});

type FormValues = z.infer<typeof schema>;

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-slate-200 rounded-xl w-48" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-24" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhyChooseUsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      heading: '',
      description: '',
      is_visible: true,
      features: [],
    },
  });

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const fetchSection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminHomepageSection('why_choose_us');
      const jsonFeatures = data.content_json?.features || [];
      reset({
        heading: data.heading ?? '',
        description: data.description ?? '',
        is_visible: data.is_visible ?? true,
        features: Array.isArray(jsonFeatures) ? jsonFeatures : [],
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
      await updateAdminHomepageSection('why_choose_us', {
        heading: values.heading,
        description: values.description,
        is_visible: values.is_visible,
        content_json: {
          features: values.features || [],
        },
      });
      toast.success('Why Choose Us section updated successfully');
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
        <span className="text-slate-700 font-medium">Why Choose Us</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Why Choose Us</h1>
          <p className="text-sm text-slate-500 mt-1">Manage core architectural pillars, highlights, and why-choose-us features.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Visibility</h2>
              <p className="text-xs text-slate-500">Show or hide this section on the homepage</p>
            </div>
            <FormSwitch
              checked={watch('is_visible') ?? true}
              onChange={(checked) => setValue('is_visible', checked, { shouldDirty: true })}
            />
          </div>

          <div className="space-y-4">
            <FormInput
              label="Section Heading"
              placeholder="e.g., Why Enterprise Leaders Choose CorpXcloud"
              error={errors.heading?.message}
              {...register('heading')}
            />

            <FormTextarea
              label="Section Description"
              rows={3}
              placeholder="Describe the architectural strength and benefits..."
              error={errors.description?.message}
              {...register('description')}
            />
          </div>
        </div>

        {/* Dynamic Features List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Feature Pillars ({fields.length})</h2>
              <p className="text-xs text-slate-500">Add the key features or architecture pillars displayed in this section</p>
            </div>
            <button
              type="button"
              onClick={() => append({ title: '', description: '', icon: 'Shield' })}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky/10 text-royal hover:bg-sky/20 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pillar
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                    Pillar #{index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormInput
                    label="Title"
                    placeholder="e.g., Enterprise Security"
                    {...register(`features.${index}.title` as const)}
                  />
                  <FormInput
                    label="Icon Identifier"
                    placeholder="e.g., Shield, Cpu, Zap, Cloud"
                    {...register(`features.${index}.icon` as const)}
                  />
                </div>
                <FormTextarea
                  label="Description"
                  rows={2}
                  placeholder="Explain this pillar..."
                  {...register(`features.${index}.description` as const)}
                />
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No pillars defined. Click "Add Pillar" above to create one.
              </div>
            )}
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
