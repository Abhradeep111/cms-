'use client';

import React, { useEffect, useState } from 'react';
import {
  Package,
  Layers,
  MessageSquare,
  HelpCircle,
  Image,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { getDashboardStats } from '@/features/dashboard/api';
import type { DashboardStats } from '@/types/cms';

// ─── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function truncate(str: string, len = 12): string {
  return str.length > len ? `${str.slice(0, len)}…` : str;
}

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-green-100 text-green-700',
  updated: 'bg-blue-100 text-blue-700',
  deleted: 'bg-red-100 text-red-700',
  published: 'bg-emerald-100 text-emerald-700',
  unpublished: 'bg-yellow-100 text-yellow-700',
};

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  colorClass: string;       // e.g. "border-blue-400 bg-blue-50 text-blue-600"
}

function StatCard({ icon, label, value, colorClass }: StatCardProps) {
  const [borderColor, bgColor, textColor] = colorClass.split(' ');
  return (
    <div
      className={`rounded-2xl shadow-sm border border-slate-100 bg-white p-5 flex items-center gap-4 border-l-4 ${borderColor}`}
    >
      <div className={`${bgColor} ${textColor} rounded-xl p-3 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-100 bg-white p-5 flex items-center gap-4 animate-pulse">
      <div className="bg-slate-200 rounded-xl p-3 w-12 h-12 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="h-6 bg-slate-200 rounded w-16" />
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard stats.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="text-red-400 w-12 h-12" />
        <p className="text-lg font-semibold text-slate-700">
          Could not load dashboard
        </p>
        <p className="text-sm text-slate-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded-lg bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Stat definitions ─────────────────────────────────────────────────────
  const statCards: (StatCardProps & { key: string })[] = stats
    ? [
        {
          key: 'total-products',
          icon: <Package className="w-5 h-5" />,
          label: 'Total Products',
          value: stats.total_products,
          colorClass: 'border-blue-400 bg-blue-50 text-blue-600',
        },
        {
          key: 'published-products',
          icon: <Package className="w-5 h-5" />,
          label: 'Published Products',
          value: stats.published_products,
          colorClass: 'border-green-400 bg-green-50 text-green-600',
        },
        {
          key: 'draft-products',
          icon: <FileText className="w-5 h-5" />,
          label: 'Draft Products',
          value: stats.draft_products,
          colorClass: 'border-yellow-400 bg-yellow-50 text-yellow-600',
        },
        {
          key: 'total-services',
          icon: <Layers className="w-5 h-5" />,
          label: 'Total Services',
          value: stats.total_services,
          colorClass: 'border-purple-400 bg-purple-50 text-purple-600',
        },
        {
          key: 'total-testimonials',
          icon: <MessageSquare className="w-5 h-5" />,
          label: 'Total Testimonials',
          value: stats.total_testimonials,
          colorClass: 'border-pink-400 bg-pink-50 text-pink-600',
        },
        {
          key: 'total-faqs',
          icon: <HelpCircle className="w-5 h-5" />,
          label: 'Total FAQs',
          value: stats.total_faqs,
          colorClass: 'border-orange-400 bg-orange-50 text-orange-600',
        },
        {
          key: 'media-assets',
          icon: <Image className="w-5 h-5" />,
          label: 'Media Assets',
          value: stats.media_assets_count,
          colorClass: 'border-teal-400 bg-teal-50 text-teal-600',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome to CorpXcloud CMS</p>
      </div>

      {/* ── Stats Grid ── */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
            : statCards.map(({ key, ...props }) => (
                <StatCard key={key} {...props} />
              ))}
        </div>
      </section>

      {/* ── Recent Updates ── */}
      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Recent Updates
        </h2>

        {loading ? (
          <div className="rounded-2xl shadow-sm border border-slate-100 bg-white divide-y divide-slate-50 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <div className="h-5 bg-slate-200 rounded-full w-20" />
                <div className="h-4 bg-slate-200 rounded w-24" />
                <div className="h-4 bg-slate-200 rounded w-20 ml-auto" />
              </div>
            ))}
          </div>
        ) : stats && stats.recent_updates.length > 0 ? (
          <div className="rounded-2xl shadow-sm border border-slate-100 bg-white divide-y divide-slate-50 overflow-hidden">
            {stats.recent_updates.map((update) => {
              const actionColor =
                ACTION_COLORS[update.action.toLowerCase()] ??
                'bg-slate-100 text-slate-600';
              return (
                <div
                  key={update.id}
                  className="px-5 py-4 flex flex-wrap items-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  {/* Action badge */}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${actionColor}`}
                  >
                    {update.action}
                  </span>

                  {/* Entity type */}
                  <span className="text-sm font-medium text-slate-600 capitalize">
                    {update.entity_type.replace(/_/g, ' ')}
                  </span>

                  {/* Entity ID */}
                  <code className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                    #{truncate(update.entity_id)}
                  </code>

                  {/* Spacer */}
                  <span className="flex-1" />

                  {/* Time ago */}
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {timeAgo(update.created_at)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl shadow-sm border border-slate-100 bg-white py-16 flex flex-col items-center gap-3 text-center">
            <Clock className="w-10 h-10 text-slate-300" />
            <p className="text-slate-400 text-sm">No recent updates yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
