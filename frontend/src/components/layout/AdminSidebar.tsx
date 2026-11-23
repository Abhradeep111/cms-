'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  Info,
  Package,
  Layers,
  Briefcase,
  Star,
  BarChart2,
  MessageSquare,
  HelpCircle,
  PhoneCall,
  Image as ImageIcon,
  Navigation,
  Mail,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

const navEntries: NavEntry[] = [
  {
    label: 'Homepage',
    icon: <Home className="w-5 h-5" />,
    children: [
      { label: 'Hero Section', href: '/homepage/hero', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'About Section', href: '/homepage/about', icon: <Info className="w-4 h-4" /> },
      { label: 'Products Section', href: '/homepage/products', icon: <Package className="w-4 h-4" /> },
      { label: 'Services Section', href: '/homepage/services', icon: <Layers className="w-4 h-4" /> },
      { label: 'Why Choose Us', href: '/homepage/why-choose-us', icon: <Star className="w-4 h-4" /> },
      { label: 'Statistics', href: '/homepage/statistics', icon: <BarChart2 className="w-4 h-4" /> },
      { label: 'Testimonials', href: '/homepage/testimonials', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'FAQ', href: '/homepage/faq', icon: <HelpCircle className="w-4 h-4" /> },
      { label: 'Contact CTA', href: '/homepage/contact-cta', icon: <PhoneCall className="w-4 h-4" /> },
    ],
  },
  { label: 'Products', href: '/products', icon: <Package className="w-5 h-5" /> },
  { label: 'Services', href: '/services', icon: <Layers className="w-5 h-5" /> },
  { label: 'Careers', href: '/careers', icon: <Briefcase className="w-5 h-5" /> },
  { label: 'Testimonials', href: '/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
  { label: 'FAQs', href: '/faqs', icon: <HelpCircle className="w-5 h-5" /> },
  { label: 'Media Library', href: '/media', icon: <ImageIcon className="w-5 h-5" /> },
  { label: 'Navigation', href: '/navigation', icon: <Navigation className="w-5 h-5" /> },
  { label: 'Contact & Footer', href: '/contact-footer', icon: <Mail className="w-5 h-5" /> },
  { label: 'SEO Management', href: '/seo', icon: <Search className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Homepage']));

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-16' : 'w-64'
        }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-3 border-b border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center border border-slate-700/60 p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="CorpXcloud Logo"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden">
              CorpXcloud CMS
            </span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          className="ml-auto flex-shrink-0 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {navEntries.map((entry) => {
          if (isNavGroup(entry)) {
            const isOpen = openGroups.has(entry.label);
            const anyChildActive = entry.children.some((c) => isActive(c.href));

            return (
              <div key={entry.label}>
                <button
                  onClick={() => !isCollapsed && toggleGroup(entry.label)}
                  title={isCollapsed ? entry.label : undefined}
                  className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${anyChildActive
                    ? 'text-sky-400 bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  <span className="flex-shrink-0">{entry.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{entry.label}</span>
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </>
                  )}
                </button>

                {!isCollapsed && isOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
                    {entry.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${isActive(child.href)
                          ? 'text-sky-400 bg-slate-800'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                      >
                        {child.icon}
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Plain nav item
          return (
            <Link
              key={entry.href}
              href={entry.href}
              title={isCollapsed ? entry.label : undefined}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(entry.href)
                ? 'text-sky-400 bg-slate-800'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
            >
              <span className="flex-shrink-0">{entry.icon}</span>
              {!isCollapsed && <span>{entry.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4 border-t border-slate-700 pt-3">
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
