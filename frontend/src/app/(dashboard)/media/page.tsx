'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UploadCloud, Search, Trash2, Copy, Check, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { listMedia, uploadMedia, deleteMedia } from '@/features/media/api';
import type { MediaAsset } from '@/types/cms';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const { success, error } = useToast();

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listMedia({
        search: search || undefined,
        page,
        page_size: 16,
      });
      setAssets(res.items);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch media assets');
    } finally {
      setLoading(false);
    }
  }, [search, page, error]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadMedia(file, file.name);
      success(`Uploaded "${file.name}" successfully`);
      fetchAssets();
    } catch (err: any) {
      error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyUrlToClipboard = (asset: MediaAsset) => {
    const fullUrl = asset.url.startsWith('http') ? asset.url : `${BACKEND_URL}${asset.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    success('Media URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMedia(deleteTarget.id);
      success('Media asset removed');
      setDeleteTarget(null);
      fetchAssets();
    } catch (err: any) {
      error(err.message || 'Failed to delete asset');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Centralized repository for images, brand icons, and downloadable resources ({total} assets)
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          uploading
            ? 'border-sky bg-sky/5 opacity-60'
            : 'border-slate-200 hover:border-sky/60 hover:bg-slate-50/50 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.svg"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-sky/10 text-royal flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {uploading ? 'Uploading asset...' : 'Click or drag files here to upload'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports WebP, PNG, JPG, and sanitized SVG up to 10MB
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by filename..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No media assets found"
          description={search ? 'Try adjusting your search criteria.' : 'Upload your first image or asset above.'}
          actionLabel="Upload File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {assets.map((asset) => {
            const isImage = asset.mime_type.startsWith('image/');
            const fullUrl = asset.url.startsWith('http') ? asset.url : `${BACKEND_URL}${asset.url}`;

            return (
              <div
                key={asset.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Preview */}
                <div className="aspect-video w-full bg-slate-50 flex items-center justify-center overflow-hidden relative border-b border-slate-100">
                  {isImage ? (
                    <img
                      src={fullUrl}
                      alt={asset.alt_text || asset.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-300" />
                  )}

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-slate-600 hover:text-navy transition-colors"
                      title="Open full image"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-900 truncate" title={asset.original_name}>
                    {asset.original_name}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{formatFileSize(asset.file_size)}</span>
                    <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                      {asset.mime_type.split('/')[1] || 'file'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => copyUrlToClipboard(asset)}
                      className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-royal transition-colors"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(asset)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${deleteTarget?.original_name}"? Embedded links in pages will stop displaying this image.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
