'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Star, Pencil, Trash2, X, MessageSquare, Quote } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/features/testimonials/api';
import type { Testimonial } from '@/types/cms';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { FormSelect } from '@/components/forms/FormSelect';

const schema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  company: z.string().min(1, 'Company is required'),
  content: z.string().min(1, 'Testimonial content is required'),
  profile_image_url: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  display_order: z.coerce.number(),
  status: z.enum(['draft', 'published', 'archived']),
});

type FormValues = z.infer<typeof schema>;

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
  archived: 'bg-slate-100 text-slate-500',
};

export default function TestimonialsPage() {
  const { success, error } = useToast();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customer_name: '',
      designation: '',
      company: '',
      content: '',
      profile_image_url: '',
      rating: 5,
      display_order: 0,
      status: 'published',
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTestimonials({ page_size: 50 });
      setTestimonials(res.items);
    } catch (err: any) {
      error(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreateModal = () => {
    setEditingItem(null);
    reset({
      customer_name: '',
      designation: '',
      company: '',
      content: '',
      profile_image_url: '',
      rating: 5,
      display_order: testimonials.length,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item);
    reset({
      customer_name: item.customer_name,
      designation: item.designation,
      company: item.company,
      content: item.content,
      profile_image_url: item.profile_image_url || '',
      rating: item.rating || 5,
      display_order: item.display_order || 0,
      status: item.status || 'published',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, values);
        success('Testimonial updated');
      } else {
        await createTestimonial(values);
        success('Testimonial created');
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      error(err.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTestimonial(deleteTarget.id);
      success('Testimonial deleted');
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage enterprise client feedback and social proof ({testimonials.length} reviews)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Collect and showcase client success stories on your homepage."
          actionLabel="Add Testimonial"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (item.rating || 5) ? 'fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[item.status]}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed line-clamp-4 relative pl-4 border-l-2 border-sky/30 mb-4">
                  "{item.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                    {item.profile_image_url ? (
                      <img src={item.profile_image_url} alt={item.customer_name} className="w-full h-full object-cover" />
                    ) : (
                      item.customer_name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.customer_name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.designation}, {item.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 z-10 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Edit Testimonial' : 'New Testimonial'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                  label="Customer / Client Name"
                  placeholder="e.g., Sarah Chen"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Designation"
                    placeholder="e.g., Chief Technology Officer"
                    error={errors.designation?.message}
                    {...register('designation')}
                  />
                  <FormInput
                    label="Company"
                    placeholder="e.g., FinTech Global"
                    error={errors.company?.message}
                    {...register('company')}
                  />
                </div>

                <FormTextarea
                  label="Review Content"
                  rows={4}
                  placeholder="What did they say about CorpXcloud's architectural performance?"
                  error={errors.content?.message}
                  {...register('content')}
                />

                <FormInput
                  label="Profile Image URL (optional)"
                  placeholder="e.g., /images/avatars/sarah.webp"
                  error={errors.profile_image_url?.message}
                  {...register('profile_image_url')}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormSelect
                    label="Rating"
                    options={[
                      { value: '5', label: '5 Stars' },
                      { value: '4', label: '4 Stars' },
                      { value: '3', label: '3 Stars' },
                      { value: '2', label: '2 Stars' },
                      { value: '1', label: '1 Star' },
                    ]}
                    {...register('rating')}
                  />

                  <FormSelect
                    label="Status"
                    options={[
                      { value: 'published', label: 'Published' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'archived', label: 'Archived' },
                    ]}
                    {...register('status')}
                  />

                  <FormInput
                    type="number"
                    label="Order"
                    placeholder="0"
                    {...register('display_order')}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                  >
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Testimonial"
        message={`Are you sure you want to remove the testimonial from ${deleteTarget?.customer_name}?`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
