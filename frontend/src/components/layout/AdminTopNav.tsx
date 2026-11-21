'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBreadcrumbs(pathname: string): string[] {
  return pathname
    .split('/')
    .filter((s) => s && !s.startsWith('('))
    .map(formatSegment);
}

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-sky-100 text-sky-700',
  editor: 'bg-emerald-100 text-emerald-700',
  viewer: 'bg-slate-100 text-slate-600',
};

export default function AdminTopNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = buildBreadcrumbs(pathname ?? '');

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const initials = user?.full_name ? getInitials(user.full_name) : '?';
  const roleKey = user?.role?.toLowerCase() ?? '';
  const badgeClass = roleBadgeColors[roleKey] ?? 'bg-slate-100 text-slate-600';

  return (
    <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between shadow-sm shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        {breadcrumbs.length === 0 ? (
          <span className="font-medium text-slate-700">Dashboard</span>
        ) : (
          breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'font-semibold text-slate-800'
                    : 'text-slate-500'
                }
              >
                {crumb}
              </span>
            </React.Fragment>
          ))
        )}
      </nav>

      {/* User area */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
        >
          <span className="w-9 h-9 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold select-none">
            {initials}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.full_name ?? '—'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email ?? '—'}</p>
                </div>
              </div>
              {user?.role && (
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${badgeClass}`}
                >
                  {user.role}
                </span>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
