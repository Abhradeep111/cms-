'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, X, ExternalLink, CornerDownRight, Navigation as NavIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  listNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
} from '@/features/navigation/api';
import type { NavigationItem } from '@/types/cms';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormSwitch } from '@/components/forms/FormSwitch';

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().min(1, 'URL is required'),
  parent_id: z.string().nullable().optional(),
  display_order: z.coerce.number(),
  open_in_new_tab: z.boolean(),
  is_visible: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function NavigationPage() {
  const { success, error } = useToast();

  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NavigationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      label: '',
      url: '',
      parent_id: null,
      display_order: 0,
      open_in_new_tab: false,
      is_visible: true,
    },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = form;

  const fetchNav = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listNavigation();
      setItems(data);
    } catch (err: any) {
      error(err.message || 'Failed to load navigation menu');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchNav();
  }, [fetchNav]);

  const topLevelItems = items.filter((item) => !item.parent_id);

  const openCreateModal = (parentId: string | null = null) => {
    setEditingItem(null);
    reset({
      label: '',
      url: '',
      parent_id: parentId,
      display_order: items.length,
      open_in_new_tab: false,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: NavigationItem) => {
    setEditingItem(item);
    reset({
      label: item.label,
      url: item.url,
      parent_id: item.parent_id || null,
      display_order: item.display_order || 0,
      open_in_new_tab: item.open_in_new_tab || false,
      is_visible: item.is_visible ?? true,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        parent_id: values.parent_id === 'none' || !values.parent_id ? null : values.parent_id,
      };

      if (editingItem) {
        await updateNavigationItem(editingItem.id, payload);
        success('Navigation item updated');
      } else {
        await createNavigationItem(payload);
        success('Navigation item created');
      }
      setIsModalOpen(false);
      fetchNav();
    } catch (err: any) {
      error(err.message || 'Failed to save navigation item');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteNavigationItem(deleteTarget.id);
      success('Navigation item removed');
      setDeleteTarget(null);
      fetchNav();
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Navigation Menu</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure header and main navigation links, nested submenus, and external URLs
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreateModal(null)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>

      {/* Navigation Tree */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} variant="table-row" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No navigation items configured"
            description="Create your first navbar link to render it on the public site."
            actionLabel="Add Link"
            onAction={() => openCreateModal(null)}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {topLevelItems.map((item) => {
              const children = items.filter((c) => c.parent_id === item.id) || [];

              return (
                <div key={item.id} className="bg-white">
                  {/* Parent Row */}
                  <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-sky/10 text-royal flex items-center justify-center font-bold text-xs">
                        <NavIcon className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.label}</span>
                          {item.open_in_new_tab && (
                            <span title="Opens in new tab">
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </span>
                          )}
                          {!item.is_visible && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full">
                              Hidden
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{item.url}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono mr-2">Order: {item.display_order}</span>
                      <button
                        type="button"
                        onClick={() => openCreateModal(item.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-royal bg-sky/10 hover:bg-sky/20 rounded-lg transition-colors flex items-center gap-1"
                        title="Add child menu item"
                      >
                        <Plus className="w-3 h-3" /> Child
                      </button>
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

                  {/* Child Rows */}
                  {children.length > 0 && (
                    <div className="bg-slate-50/50 pl-12 pr-4 divide-y divide-slate-100 border-t border-slate-100">
                      {children.map((child) => (
                        <div key={child.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CornerDownRight className="w-4 h-4 text-slate-300" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-800">{child.label}</span>
                                {child.open_in_new_tab && (
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                )}
                                {!child.is_visible && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-rose-50 text-rose-600 rounded">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">{child.url}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-mono mr-2">Order: {child.display_order}</span>
                            <button
                              type="button"
                              onClick={() => openEditModal(child)}
                              className="p-1 text-slate-400 hover:text-navy rounded hover:bg-slate-200/50 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(child)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

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
              className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Edit Navigation Item' : 'New Navigation Item'}
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
                  label="Navigation Label"
                  placeholder="e.g., Solutions, About, Modules"
                  error={errors.label?.message}
                  {...register('label')}
                />

                <FormInput
                  label="Target URL"
                  placeholder="e.g., /solutions or https://docs..."
                  error={errors.url?.message}
                  {...register('url')}
                />

                <FormSelect
                  label="Parent Menu Item (optional)"
                  options={[
                    { value: 'none', label: 'None (Top Level Item)' },
                    ...topLevelItems
                      .filter((i) => i.id !== editingItem?.id)
                      .map((i) => ({ value: i.id, label: i.label })),
                  ]}
                  {...register('parent_id')}
                />

                <FormInput
                  type="number"
                  label="Display Order"
                  placeholder="0"
                  {...register('display_order')}
                />

                <div className="space-y-2 pt-2">
                  <FormSwitch
                    label="Open in new browser tab"
                    checked={watch('open_in_new_tab')}
                    onChange={(checked) => setValue('open_in_new_tab', checked)}
                  />

                  <FormSwitch
                    label="Visible in navigation"
                    checked={watch('is_visible')}
                    onChange={(checked) => setValue('is_visible', checked)}
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
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
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
        title="Delete Navigation Item"
        message={`Are you sure you want to remove "${deleteTarget?.label}"? Any sub-items under it will also be detached.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
