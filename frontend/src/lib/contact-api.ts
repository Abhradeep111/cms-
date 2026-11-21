import { api } from './api';

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  subject: string;
  message: string;
}

export interface ContactInquiryResponse {
  id?: string;
  success?: boolean;
  message?: string;
}

export async function submitContactInquiry(
  payload: ContactInquiryPayload,
): Promise<ContactInquiryResponse> {
  try {
    const res = await api.post('/platform/api/v1/contact-inquiries', payload);
    return (res as any)?.data ?? res;
  } catch {
    const res = await api.post('/platform/api/v1/inquiries', payload);
    return (res as any)?.data ?? res;
  }
}

