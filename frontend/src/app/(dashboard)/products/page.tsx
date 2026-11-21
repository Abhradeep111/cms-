'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Plus, Star, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { listProducts, deleteProduct, updateProductStatus } from '@/features/products/api';
import type { Product } from '@/types/cms';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  draft: 'bg-amber-100 text-amber-700 border border-amber-200',
  archived: 'bg-slate-100 text-slate-500 border border-slate-200',
};

const STATUS_OPTIONS = ['draft', 'published', 'archived'] as const;

export default function ProductsPage() {
  const { success, error } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [statusMenu, setStatusMenu] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listProducts({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        page,
        page_size: 10,
      });
      setProducts(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch {
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page, error]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (product: Product, newStatus: string) => {
    setStatusMenu(null);
    setUpdatingStatus(product.id);
    try {
      await updateProductStatus(product.id, newStatus);
      success('Status updated');
      fetchProducts();
    } catch {
      error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} product{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-xl shadow hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-navy focus:ring-2 focus:ring-sky/20 transition-all"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-navy focus:ring-2 focus:ring-sky/20 transition-all"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Create your first product to get started."
            action={{ label: 'Create your first product', onClick: () => window.location.href = '/products/new' }}
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name / Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Featured</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Order</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setStatusMenu(statusMenu === product.id ? null : product.id)}
                        disabled={updatingStatus === product.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-opacity ${STATUS_COLORS[product.status]} ${updatingStatus === product.id ? 'opacity-50' : 'hover:opacity-80 cursor-pointer'}`}
                      >
                        {updatingStatus === product.id ? 'Updating…' : product.status}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {statusMenu === product.id && (
                        <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(product, s)}
                              className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-slate-50 transition-colors ${product.status === s ? 'font-semibold text-navy' : 'text-slate-700'}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.is_featured && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      {/* Click-outside for status menu */}
      {statusMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setStatusMenu(null)} />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
