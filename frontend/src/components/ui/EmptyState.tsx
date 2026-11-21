import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const finalActionLabel = action?.label || actionLabel;
  const finalActionHandler = action?.onClick || onAction;

  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {finalActionLabel && finalActionHandler && (
        <button
          onClick={finalActionHandler}
          className="mt-4 px-4 py-2 bg-navy text-white text-xs font-semibold rounded-lg shadow hover:bg-slate-800 transition-colors"
        >
          {finalActionLabel}
        </button>
      )}
    </div>
  );
}
