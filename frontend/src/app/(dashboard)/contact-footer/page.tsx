'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Globe, Share2, Layers } from 'lucide-react';
import {
  getContactSettings,
  updateContactSettings,
  getFooterSettings,
  updateFooterSettings,
} from '@/features/settings/api';
import { useToast } from '@/components/ui/Toast';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const contactSchema = z.object({
  general_email: z.string().email().optional().or(z.literal('')),
  sales_email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  x_url: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const footerSchema = z.object({
  description: z.string().optional(),
  footer_logo: z.string().optional(),
  legal_name: z.string().optional(),
  copyright_text: z.string().optional(),
});

type FooterFormValues = z.infer<typeof footerSchema>;

export default function ContactFooterPage() {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'footer'>('contact');
  const [loading, setLoading] = useState(true);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      general_email: '',
      sales_email: '',
      phone: '',
      city: '',
      region: '',
      country: '',
      facebook_url: '',
      instagram_url: '',
      linkedin_url: '',
      x_url: '',
    },
  });

  const footerForm = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      description: '',
      footer_logo: '',
      legal_name: '',
      copyright_text: '',
    },
  });

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [contactData, footerData] = await Promise.all([
          getContactSettings().catch(() => null),
          getFooterSettings().catch(() => null),
        ]);

        if (contactData) {
          const c = contactData as any;
          contactForm.reset({
            general_email: c.general_email || '',
            sales_email: c.sales_email || '',
            phone: c.phone || '',
            city: c.city || '',
            region: c.region || '',
            country: c.country || '',
            facebook_url: c.facebook_url || '',
            instagram_url: c.instagram_url || '',
            linkedin_url: c.linkedin_url || '',
            x_url: c.x_url || '',
          });
        }

        if (footerData) {
          const f = footerData as any;
          footerForm.reset({
            description: f.description || '',
            footer_logo: f.footer_logo || '',
            legal_name: f.legal_name || '',
            copyright_text: f.copyright_text || '',
          });
        }
      } catch (err: any) {
        error(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [error]);

  const onSaveContact = async (values: ContactFormValues) => {
    try {
      await updateContactSettings(values);
      success('Contact & social media details updated successfully');
    } catch (err: any) {
      error(err.message || 'Failed to update contact settings');
    }
  };

  const onSaveFooter = async (values: FooterFormValues) => {
    try {
      await updateFooterSettings(values);
      success('Footer configuration saved successfully');
    } catch (err: any) {
      error(err.message || 'Failed to update footer settings');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <LoadingSkeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
        <LoadingSkeleton variant="card" className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact & Footer Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure corporate contact details, headquarters location, social links, and website footer information.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'contact'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Mail className="w-4 h-4" />
          Contact Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'social'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Social Networks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'footer'
              ? 'border-navy text-navy font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Footer Settings
        </button>
      </div>

      {/* Tab: Contact Info */}
      {activeTab === 'contact' && (
        <form onSubmit={contactForm.handleSubmit(onSaveContact)} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Direct Inquiries</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="General Inquiries Email"
                placeholder="info@corpxcloud.com"
                {...contactForm.register('general_email')}
              />
              <FormInput
                label="Sales & Enterprise Inquiries Email"
                placeholder="sales@corpxcloud.com"
                {...contactForm.register('sales_email')}
              />
            </div>

            <FormInput
              label="Phone Number"
              placeholder="+1 (800) 555-0199"
              {...contactForm.register('phone')}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Global Headquarters</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="City"
                placeholder="San Francisco"
                {...contactForm.register('city')}
              />
              <FormInput
                label="State / Region"
                placeholder="California"
                {...contactForm.register('region')}
              />
              <FormInput
                label="Country"
                placeholder="United States"
                {...contactForm.register('country')}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={contactForm.formState.isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
            >
              {contactForm.formState.isSubmitting ? 'Saving...' : 'Save Contact Details'}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Social Networks */}
      {activeTab === 'social' && (
        <form onSubmit={contactForm.handleSubmit(onSaveContact)} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Social Presence</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/company/corpxcloud"
                {...contactForm.register('linkedin_url')}
              />
              <FormInput
                label="X (formerly Twitter) URL"
                placeholder="https://x.com/corpxcloud"
                {...contactForm.register('x_url')}
              />
              <FormInput
                label="Facebook Page URL"
                placeholder="https://facebook.com/corpxcloud"
                {...contactForm.register('facebook_url')}
              />
              <FormInput
                label="Instagram URL"
                placeholder="https://instagram.com/corpxcloud"
                {...contactForm.register('instagram_url')}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={contactForm.formState.isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
            >
              {contactForm.formState.isSubmitting ? 'Saving...' : 'Save Social Links'}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Footer Content */}
      {activeTab === 'footer' && (
        <form onSubmit={footerForm.handleSubmit(onSaveFooter)} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">Footer Information</h2>

            <FormTextarea
              label="Footer Description"
              rows={3}
              placeholder="Enterprise cloud platform for modern software architecture and secure data processing."
              {...footerForm.register('description')}
            />

            <FormInput
              label="Footer Logo URL (optional)"
              placeholder="/images/logo-footer.svg"
              {...footerForm.register('footer_logo')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Legal Corporate Name"
                placeholder="CorpXcloud Technologies, Inc."
                {...footerForm.register('legal_name')}
              />
              <FormInput
                label="Copyright Notice"
                placeholder="© 2026 CorpXcloud Technologies, Inc. All rights reserved."
                {...footerForm.register('copyright_text')}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={footerForm.formState.isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-navy hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
            >
              {footerForm.formState.isSubmitting ? 'Saving...' : 'Save Footer Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
