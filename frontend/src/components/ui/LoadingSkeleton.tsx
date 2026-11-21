import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: 'text' | 'rectangular' | 'card' | 'table-row';
}

export function Skeleton({ className = 'h-4 w-full', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded bg-slate-200 dark:bg-slate-700/50 ${className}`}
        />
      ))}
    </>
  );
}

export function LoadingSkeleton({ className = '', variant = 'rectangular', count = 1 }: SkeletonProps) {
  if (variant === 'table-row') {
    return (
      <div className={`flex items-center gap-4 py-3 animate-pulse ${className}`}>
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="h-5 bg-slate-100 rounded w-1/4" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-slate-100/80 animate-pulse rounded-2xl p-6 ${className}`}>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-3 bg-slate-200 rounded w-full mb-2" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse rounded-xl bg-slate-200/80 ${className || 'h-10 w-full'}`}
        />
      ))}
    </>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-slate-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-5 bg-slate-100 rounded flex-1 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
