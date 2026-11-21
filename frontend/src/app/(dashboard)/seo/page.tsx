'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Globe, ChevronDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { listAllSeo, updateSeo } from '@/features/seo/api';
import type { SEOMetadata } from '@/types/cms';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSwitch } from '@/components/forms/FormSwitch';

const seoSchema = z.object({
  title: z.string().min(1, 'SEO Title is required'),
  meta_description: z.string().min(1, 'Meta Description is required'),
  keywords_input: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
  robots_index: z.boolean(),
  robots_follow: z.boolean(),
});

type FormValues = z.infer<typeof seoSchema>;

export default function SEOManagementPage() {
  const { success, error } = useToast();

  const [pages, setPages] = useState<SEOMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(seoSchema) as any,
    defaultValues: {
      title: '',
      meta_description: '',
      keywords_input: '',
      og_title: '',
      og_description: '',
      og_image: '',
      canonical_url: '',
      robots_index: true,
      robots_follow: true,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const fetchSeoList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAllSeo();
      setPages(data);
      if (data.length > 0 && !activeKey) {
        selectPage(data[0]);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load SEO pages');
    } finally {
      setLoading(false);
    }
  }, [activeKey, error]);

  useEffect(() => {
    fetchSeoList();
  }, [fetchSeoList]);

  const selectPage = (item: SEOMetadata) => {
    setActiveKey(item.page_key);
    reset({
      title: item.title || '',
      meta_description: item.meta_description || '',
      keywords_input: (item.keywords || []).join(', '),
      og_title: item.og_title || '',
      og_description: item.og_description || '',
      og_image: item.og_image || '',
      canonical_url: item.canonical_url || '',
      robots_index: item.robots_index ?? true,
      robots_follow: item.robots_follow ?? true,
    });
  };

  const onSubmit = async (values: FormValues) => {
    if (!activeKey) return;
    try {
      const kw = values.keywords_input
        ? values.keywords_input.split(',').map((k) => k.trim()).filter(Boolean)
        : [];

      await updateSeo(activeKey, {
        title: values.title,
        meta_description: values.meta_description,
        keywords: kw,
        og_title: values.og_title,
        og_description: values.og_description,
        og_image: values.og_image,
        canonical_url: values.canonical_url,
        robots_index: values.robots_index,
        robots_follow: values.robots_follow,
      });

      success(`SEO settings for "${activeKey}" updated`);
      fetchSeoList();
    } catch (err: any) {
      error(err.message || 'Failed to update SEO');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SEO & Meta Tags Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure search engine title tags, OpenGraph previews, crawler index policies, and canonical targets.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton variant="card" className="h-64 rounded-2xl" />
          <div className="md:col-span-2">
            <LoadingSkeleton variant="card" className="h-96 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Page Selector */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2 h-fit">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">
              Configured Pages ({pages.length})
            </h2>
            {pages.map((p) => {
              const isActive = activeKey === p.page_key;
              return (
                <button
                  key={p.id || p.page_key}
                  type="button"
                  onClick={() => selectPage(p)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-navy text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">
                    <div className="font-bold capitalize">{p.page_key.replace(/-/g, ' ')}</div>
                    <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {p.title || 'Untitled'}
                    </div>
                  </div>
                  {p.robots_index && (
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-sky' : 'bg-emerald-500'
                      }`}
                      title="Indexed"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {activeKey ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Search Snippet Preview */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Google Search Preview
                  </span>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 font-sans space-y-1">
                    <div className="text-[12px] text-slate-500 flex items-center gap-1">
                      <span>https://corpxcloud.com</span>
                      <span>›</span>
                      <span className="font-medium text-slate-700">{activeKey}</span>
                    </div>
                    <div className="text-base text-blue-800 font-medium truncate hover:underline cursor-pointer">
                      {watch('title') || 'Page Title'}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2">
                      {watch('meta_description') || 'No description provided yet.'}
                    </div>
                  </div>
                </div>

                {/* Basic Meta */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                    Primary Meta Tags
                  </h3>

                  <FormInput
                    label="Page Title Tag"
                    placeholder="e.g., Enterprise Cloud Mesh | CorpXcloud"
                    error={errors.title?.message}
                    {...register('title')}
                  />

                  <FormTextarea
                    label="Meta Description"
                    rows={3}
                    placeholder="Concise summary for search engines (150-160 characters recommended)..."
                    error={errors.meta_description?.message}
                    {...register('meta_description')}
                  />

                  <FormInput
                    label="Keywords (comma-separated)"
                    placeholder="cloud, architecture, microservices, enterprise"
                    {...register('keywords_input')}
                  />

                  <FormInput
                    label="Canonical Target URL"
                    placeholder="https://corpxcloud.com/..."
                    {...register('canonical_url')}
                  />
                </div>

                {/* Social Share / OpenGraph */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                    Social Sharing / OpenGraph (OG)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="OG Title"
                      placeholder="Title for Facebook / LinkedIn cards"
                      {...register('og_title')}
                    />
                    <FormInput
                      label="OG Image URL"
                      placeholder="/images/og/default.webp"
                      {...register('og_image')}
                    />
                  </div>

                  <FormTextarea
                    label="OG Description"
                    rows={2}
                    placeholder="Social media snippet description..."
                    {...register('og_description')}
                  />
                </div>

                {/* Robot Directives */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                    Robots & Indexing Directives
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSwitch
                      label="Allow Search Indexing (index)"
                      checked={watch('robots_index')}
                      onChange={(c) => setValue('robots_index', c)}
                    />

                    <FormSwitch
                      label="Follow Page Links (follow)"
                      checked={watch('robots_follow')}
                      onChange={(c) => setValue('robots_follow', c)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : 'Save SEO Metadata'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-xs">
                Select a page on the left to edit its SEO metadata.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
