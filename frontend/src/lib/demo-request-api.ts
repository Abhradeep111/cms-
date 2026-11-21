import { api } from './api';
import type { HomepageProductModule } from '@/types/api';
import { createFallbackProductModules } from '@/data/api-fallbacks';
import { logApiReadFailure } from './api-fallback';

export interface DemoRequestPayload {
  company_name: string;
  contact_name: string;
  full_name?: string;
  email: string;
  phone: string;
  job_title?: string;
  company_size?: string;
  industry?: string;
  gst_number?: string;
  product_name?: string;
  requirements: string;
  interested_module_ids: string[];
}

export interface DemoRequestResponse {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  requirements: string;
  interested_module_ids: string[];
  interested_modules_snapshot?: Array<{ id: string; name: string; abbr: string; code: string; status: string }>;
  status: string;
  created_at: string;
  message?: string;
}

export async function createDemoRequest(payload: DemoRequestPayload): Promise<DemoRequestResponse> {
  const res = await api.post('/platform/api/v1/enterprise-demo-requests', {
    ...payload,
    full_name: payload.full_name || payload.contact_name,
    contact_name: payload.contact_name || payload.full_name,
  });
  const data = (res as any)?.data ?? res;
  return data as DemoRequestResponse;
}

export async function getDemoModules(): Promise<HomepageProductModule[]> {
  try {
    const res = await api.get('/platform/api/v1/enterprise-demo-requests/modules');
    const data = (res as any)?.data ?? res;
    if (Array.isArray(data) && data.length > 0) return data;
    if (Array.isArray((data as any)?.data) && (data as any).data.length > 0) return (data as any).data;
  } catch (error) {
    // try secondary endpoint
    logApiReadFailure('Demo-request modules endpoint', error);
  }

  try {
    const res = await api.get('/platform/api/v1/homepage-product-modules');
    const data = (res as any)?.data ?? res;
    if (Array.isArray(data) && data.length > 0) return data;
    if (Array.isArray((data as any)?.data) && (data as any).data.length > 0) return (data as any).data;
  } catch (error) {
    // fallback
    logApiReadFailure('Homepage product modules endpoint', error);
  }

  // Fallback to static catalog so products are ALWAYS available
  return createFallbackProductModules();
}
