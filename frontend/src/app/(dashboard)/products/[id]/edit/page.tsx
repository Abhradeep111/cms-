'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { getProduct, updateProduct } from '@/features/products/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormSwitch } from '@/components/forms/FormSwitch';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  short_description: z.string().min(1, 'Short description is required'),
  detailed_description: z.string().optional(),
  product_url: z.string().optional(),
  product_logo: z.string().optional(),
  product_thumbnail: z.string().optional(),
  cta_label: z.string().optional(),
  display_order: z.coerce.number(),
  is_featured: z.boolean(),
  status: z.enum(['draft', 'published', 'archived']),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  code: z.string().optional(),
  abbr: z.string().optional(),
  features: z.array(z.object({ value: z.string() })).optional(),
  benefits: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EditProductPage() {
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
      product_url: '',
      product_logo: '',
      product_thumbnail: '',
      cta_label: '',
      display_order: 0,
      is_featured: false,
      status: 'draft',
      seo_title: '',
      seo_description: '',
      code: '',
      abbr: '',
      features: [],
      benefits: [],
    },
  });

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = form;

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const prod = await getProduct(id);
        reset({
          name: prod.name,
          slug: prod.slug,
          short_description: prod.short_description || '',
          detailed_description: prod.detailed_description || '',
          product_url: prod.product_url || '',
          product_logo: prod.product_logo || '',
          product_thumbnail: prod.product_thumbnail || '',
          cta_label: prod.cta_label || '',
          display_order: prod.display_order || 0,
          is_featured: prod.is_featured || false,
          status: prod.status || 'draft',
          seo_title: prod.seo_title || '',
          seo_description: prod.seo_description || '',
          code: prod.code || '',
          abbr: prod.abbr || '',
          features: (prod.features || []).map((f) => ({ value: f })),
          benefits: (prod.benefits || []).map((b) => ({ value: b })),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await updateProduct(id, {
        ...values,
        features: (values.features || []).map((f) => f.value).filter(Boolean),
        benefits: (values.benefits || []).map((b) => b.value).filter(Boolean),
      });
      toast.success('Product updated successfully');
      router.push('/products');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product');
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
          href="/products"
          className="px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/products" className="hover:text-slate-600 transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">Edit Product</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Product</h1>
            <p className="text-sm text-slate-500 mt-0.5">Update details, features, media, and SEO attributes.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Product Name"
              placeholder="e.g., Enterprise Cloud Mesh"
              error={errors.name?.message}
              {...register('name')}
            />
            <FormInput
              label="URL Slug"
              placeholder="e.g., enterprise-cloud-mesh"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Code Identifier (optional)"
              placeholder="e.g., ECM-01"
              error={errors.code?.message}
              {...register('code')}
            />
            <FormInput
              label="Short Abbreviation (optional)"
              placeholder="e.g., ECM"
              error={errors.abbr?.message}
              {...register('abbr')}
            />
          </div>

          <FormTextarea
            label="Short Description"
            rows={2}
            placeholder="High-level product summary shown in grids and cards..."
            error={errors.short_description?.message}
            {...register('short_description')}
          />

          <FormTextarea
            label="Detailed Description"
            rows={4}
            placeholder="Comprehensive description for the dedicated product detail page..."
            error={errors.detailed_description?.message}
            {...register('detailed_description')}
          />
        </div>

        {/* Assets & Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Media & Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Product Logo URL"
              placeholder="e.g., /icons/mesh-logo.svg"
              error={errors.product_logo?.message}
              {...register('product_logo')}
            />
            <FormInput
              label="Product Thumbnail URL"
              placeholder="e.g., /images/products/mesh-thumb.webp"
              error={errors.product_thumbnail?.message}
              {...register('product_thumbnail')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="CTA Button Label"
              placeholder="e.g., Explore Module"
              error={errors.cta_label?.message}
              {...register('cta_label')}
            />
            <FormInput
              label="Dedicated Product URL (optional)"
              placeholder="e.g., /module/mesh"
              error={errors.product_url?.message}
              {...register('product_url')}
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
                    placeholder="e.g., Multi-region mesh synchronization"
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
                    placeholder="e.g., 40% reduction in cloud latency"
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

        {/* Visibility & Publishing */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Publishing & Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
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

            <div className="pt-6">
              <FormSwitch
                label="Mark as Featured Product"
                checked={watch('is_featured')}
                onChange={(checked) => setValue('is_featured', checked)}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Search Engine Optimization (SEO)</h2>

          <FormInput
            label="SEO Title Tag"
            placeholder="e.g., Enterprise Cloud Mesh | CorpXcloud"
            error={errors.seo_title?.message}
            {...register('seo_title')}
          />

          <FormTextarea
            label="Meta Description"
            rows={2}
            placeholder="Search engine summary snippet..."
            error={errors.seo_description?.message}
            {...register('seo_description')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/products"
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
