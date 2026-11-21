import api from '@/lib/api';
import type { JobApplication, JobOpening } from '@/types/cms';

export interface JobListResult {
  items: JobOpening[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApplicationListResult {
  items: JobApplication[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ==================== JOBS ====================

export async function listJobs(params?: {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  page_size?: number;
}): Promise<JobListResult> {
  const res: any = await api.get('/api/v1/admin/careers/jobs', { params });
  return res;
}

export async function getJob(id: string): Promise<JobOpening> {
  const res: any = await api.get(`/api/v1/admin/careers/jobs/${id}`);
  return res;
}

export async function createJob(data: Partial<JobOpening>): Promise<JobOpening> {
  const res: any = await api.post('/api/v1/admin/careers/jobs', data);
  return res;
}

export async function updateJob(id: string, data: Partial<JobOpening>): Promise<JobOpening> {
  const res: any = await api.put(`/api/v1/admin/careers/jobs/${id}`, data);
  return res;
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/careers/jobs/${id}`);
}

// ==================== APPLICATIONS ====================

export async function listApplications(params?: {
  job_id?: string;
  experience_group?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<ApplicationListResult> {
  const res: any = await api.get('/api/v1/admin/careers/applications', { params });
  return res;
}

export async function getApplication(id: string): Promise<JobApplication> {
  const res: any = await api.get(`/api/v1/admin/careers/applications/${id}`);
  return res;
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
): Promise<JobApplication> {
  const res: any = await api.patch(`/api/v1/admin/careers/applications/${id}/status`, { status });
  return res;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/api/v1/admin/careers/applications/${id}`);
}
