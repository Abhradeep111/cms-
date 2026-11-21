'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Users,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Mail,
  Phone,
  Link as LinkIcon,
  X,
  Loader2,
  AlertCircle,
  User,
} from 'lucide-react';
import {
  listJobs,
  createJob,
  updateJob,
  deleteJob,
  listApplications,
  updateApplicationStatus,
  deleteApplication,
} from '@/features/careers/api';
import type { JobApplication, JobOpening } from '@/types/cms';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useToast } from '@/components/ui/Toast';

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  draft: 'bg-amber-100 text-amber-800 border-amber-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const APP_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const EXPERIENCE_OPTIONS = [
  { value: 'all', label: 'All Experience Levels' },
  { value: '0', label: 'Fresher (0 years)' },
  { value: '1-2', label: '1–2 years' },
  { value: '2-3', label: '2–3 years' },
  { value: '3-4', label: '3–4 years' },
  { value: '4-5', label: '4–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10+', label: '10+ years' },
];

export default function CareersAdminPage() {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'applications' | 'jobs'>('applications');

  // Jobs state
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Applications state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [totalApps, setTotalApps] = useState(0);

  // Filters for applications
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Modals state
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [savingJob, setSavingJob] = useState(false);

  // Job Form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('Kolkata, India (Hybrid)');
  const [jobType, setJobType] = useState('Full-time');
  const [jobExp, setJobExp] = useState('3+ years');
  const [jobSummary, setJobSummary] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobStatus, setJobStatus] = useState<'published' | 'draft' | 'closed'>('published');
  const [jobOrder, setJobOrder] = useState(0);

  // Detail Modal for candidate application
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Delete confirmations
  const [deleteTargetJob, setDeleteTargetJob] = useState<JobOpening | null>(null);
  const [deletingJob, setDeletingJob] = useState(false);

  const [deleteTargetApp, setDeleteTargetApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState(false);

  // Fetch Jobs
  const fetchJobsList = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const res = await listJobs({ page_size: 100 });
      setJobs(res.items || []);
    } catch (err: any) {
      error(err.message || 'Failed to load job openings');
    } finally {
      setLoadingJobs(false);
    }
  }, [error]);

  // Fetch Applications
  const fetchApplicationsList = useCallback(async () => {
    setLoadingApps(true);
    try {
      const res = await listApplications({
        job_id: jobFilter !== 'all' ? jobFilter : undefined,
        experience_group: experienceFilter !== 'all' ? experienceFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: debouncedSearch || undefined,
        page_size: 100,
      });
      setApplications(res.items || []);
      setTotalApps(res.total || 0);
    } catch (err: any) {
      error(err.message || 'Failed to load applications');
    } finally {
      setLoadingApps(false);
    }
  }, [jobFilter, experienceFilter, statusFilter, debouncedSearch, error]);

  useEffect(() => {
    fetchJobsList();
  }, [fetchJobsList]);

  useEffect(() => {
    fetchApplicationsList();
  }, [fetchApplicationsList]);

  // Reset Job Modal
  const openNewJobModal = () => {
    setEditingJob(null);
    setJobTitle('');
    setJobDept('Engineering');
    setJobLocation('Kolkata, India (Hybrid)');
    setJobType('Full-time');
    setJobExp('3+ years');
    setJobSummary('');
    setJobResponsibilities('');
    setJobRequirements('');
    setJobStatus('published');
    setJobOrder(jobs.length + 1);
    setJobModalOpen(true);
  };

  const openEditJobModal = (job: JobOpening) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobDept(job.department);
    setJobLocation(job.location);
    setJobType(job.type);
    setJobExp(job.experience);
    setJobSummary(job.summary || '');
    setJobResponsibilities((job.responsibilities || []).join('\n'));
    setJobRequirements((job.requirements || []).join('\n'));
    setJobStatus(job.status);
    setJobOrder(job.display_order || 0);
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);
    try {
      const payload: Partial<JobOpening> = {
        title: jobTitle.trim(),
        department: jobDept.trim(),
        location: jobLocation.trim(),
        type: jobType.trim(),
        experience: jobExp.trim(),
        summary: jobSummary.trim(),
        responsibilities: jobResponsibilities
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: jobRequirements
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        display_order: Number(jobOrder) || 0,
        status: jobStatus,
      };

      if (editingJob) {
        await updateJob(editingJob.id, payload);
        success(`Job opening "${jobTitle}" updated successfully.`);
      } else {
        await createJob(payload);
        success(`Job opening "${jobTitle}" created successfully.`);
      }

      setJobModalOpen(false);
      fetchJobsList();
    } catch (err: any) {
      error(err.message || 'Failed to save job opening');
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteTargetJob) return;
    setDeletingJob(true);
    try {
      await deleteJob(deleteTargetJob.id);
      success(`Job opening "${deleteTargetJob.title}" deleted.`);
      setDeleteTargetJob(null);
      fetchJobsList();
    } catch (err: any) {
      error(err.message || 'Failed to delete job opening');
    } finally {
      setDeletingJob(false);
    }
  };

  // Status update for candidate
  const handleUpdateAppStatus = async (
    appId: string,
    newStatus: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  ) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      success(`Application status updated to ${newStatus}.`);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err: any) {
      error(err.message || 'Failed to update application status');
    }
  };

  // Delete application
  const handleDeleteApp = async () => {
    if (!deleteTargetApp) return;
    setDeletingApp(true);
    try {
      await deleteApplication(deleteTargetApp.id);
      success(`Application of "${deleteTargetApp.name}" deleted.`);
      setDeleteTargetApp(null);
      if (selectedApp && selectedApp.id === deleteTargetApp.id) {
        setSelectedApp(null);
      }
      fetchApplicationsList();
    } catch (err: any) {
      error(err.message || 'Failed to delete application');
    } finally {
      setDeletingApp(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setJobFilter('all');
    setExperienceFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters =
    search !== '' || jobFilter !== 'all' || experienceFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Careers & Recruitment</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              {jobs.length} Openings &middot; {totalApps} Applications
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage job vacancies, track candidate applications, and filter talent by experience level.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000/careers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            View Landing Page Careers
          </a>
          <button
            type="button"
            onClick={openNewJobModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Job Opening
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Job Applications ({applications.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'jobs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Openings ({jobs.length})</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search candidate name, email, phone..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Job filter */}
              <div>
                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Job Openings</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter (USER EXPLICIT REQUIREMENT) */}
              <div>
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-medium focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">
                  Showing <strong>{applications.length}</strong> matching candidates
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Applications Table */}
          {loadingApps ? (
            <LoadingSkeleton count={5} />
          ) : applications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No job applications found"
              description={
                hasActiveFilters
                  ? 'No candidates match the selected filters. Try broadening your criteria.'
                  : 'Candidates who apply through the landing page careers section will appear here.'
              }
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Candidate</th>
                      <th className="px-4 py-3.5">Applied For</th>
                      <th className="px-4 py-3.5">Experience</th>
                      <th className="px-4 py-3.5">Links</th>
                      <th className="px-4 py-3.5">Applied Date</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Candidate */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 text-sm">{app.name}</div>
                          <div className="flex items-center gap-3 mt-1 text-slate-500">
                            <a
                              href={`mailto:${app.email}`}
                              className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{app.email}</span>
                            </a>
                            <span className="text-slate-300">&middot;</span>
                            <a
                              href={`tel:${app.phone}`}
                              className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{app.phone}</span>
                            </a>
                          </div>
                        </td>

                        {/* Applied For */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80">
                            {app.job_title}
                          </span>
                        </td>

                        {/* Experience */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                            {app.experience_range ? `${app.experience_range} yrs` : `${app.experience_years} yrs`}
                          </span>
                        </td>

                        {/* Links */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {app.resume_url && (
                              <a
                                href={app.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Resume"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-600 transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {app.portfolio_url && (
                              <a
                                href={app.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View LinkedIn/Portfolio"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-600 hover:text-blue-600 transition-colors"
                              >
                                <LinkIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {!app.resume_url && !app.portfolio_url && (
                              <span className="text-slate-400 text-[11px]">—</span>
                            )}
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleUpdateAppStatus(app.id, e.target.value as any)
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${
                              APP_STATUS_COLORS[app.status] || 'bg-slate-50 text-slate-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedApp(app)}
                              title="View Candidate Profile"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTargetApp(app)}
                              title="Delete Application"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: JOB OPENINGS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {loadingJobs ? (
            <LoadingSkeleton count={5} />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No job openings available"
              description="Create your first job opening to publish it on the landing page careers section."
              actionLabel="Create Job Opening"
              onAction={openNewJobModal}
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Role & Department</th>
                      <th className="px-4 py-3.5">Location & Type</th>
                      <th className="px-4 py-3.5">Required Experience</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Display Order</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Title & Department */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 text-sm">{job.title}</div>
                          <div className="text-slate-500 mt-0.5">{job.department}</div>
                        </td>

                        {/* Location & Type */}
                        <td className="px-4 py-4">
                          <div>{job.location}</div>
                          <div className="text-slate-400 text-[11px]">{job.type}</div>
                        </td>

                        {/* Experience */}
                        <td className="px-4 py-4 font-medium text-slate-800">
                          {job.experience}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              STATUS_COLORS[job.status] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>

                        {/* Order */}
                        <td className="px-4 py-4 text-slate-500 font-mono text-xs">
                          {job.display_order ?? 0}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setJobFilter(job.id);
                                setActiveTab('applications');
                              }}
                              title="View Applicants for this role"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Applicants</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditJobModal(job)}
                              title="Edit Job Opening"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTargetJob(job)}
                              title="Delete Job Opening"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT JOB OPENING */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingJob ? 'Edit Job Opening' : 'New Job Opening'}
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveJob} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer (Next.js & Cloud)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Solutions">Sales & Solutions</option>
                    <option value="Operations">Operations</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Kolkata, India (Hybrid) or Remote"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Required Experience *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobExp}
                    onChange={(e) => setJobExp(e.target.value)}
                    placeholder="e.g. 4+ years or 2-4 years"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Summary / Short Description
                </label>
                <textarea
                  rows={2}
                  value={jobSummary}
                  onChange={(e) => setJobSummary(e.target.value)}
                  placeholder="Short role summary visible on job cards..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={jobResponsibilities}
                  onChange={(e) => setJobResponsibilities(e.target.value)}
                  placeholder="Design and ship micro-frontends in Next.js&#10;Build performant REST API surfaces&#10;Optimize database queries"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono text-[11px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={jobRequirements}
                  onChange={(e) => setJobRequirements(e.target.value)}
                  placeholder="Strong proficiency in TypeScript and Next.js&#10;Hands-on experience with multi-tenant SaaS&#10;Familiarity with Docker and PostgreSQL"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono text-[11px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={jobOrder}
                  onChange={(e) => setJobOrder(Number(e.target.value))}
                  className="w-32 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingJob}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors disabled:opacity-50"
                >
                  {savingJob && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingJob ? 'Save Changes' : 'Create Opening'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CANDIDATE PROFILE DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {selectedApp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedApp.name}</h3>
                  <p className="text-xs text-slate-500">Applied for {selectedApp.job_title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Email</span>
                  <a
                    href={`mailto:${selectedApp.email}`}
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Phone</span>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="font-semibold text-slate-800 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Experience Level</span>
                  <span className="font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md inline-block">
                    {selectedApp.experience_range
                      ? `${selectedApp.experience_range} yrs`
                      : `${selectedApp.experience_years} yrs`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5 font-medium">Applied On</span>
                  <span className="font-semibold text-slate-800">
                    {selectedApp.created_at
                      ? new Date(selectedApp.created_at).toLocaleString()
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-900 block">Attached Links</span>
                <div className="flex flex-wrap gap-2.5">
                  {selectedApp.resume_url ? (
                    <a
                      href={selectedApp.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-blue-600 font-semibold shadow-2xs transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Open Resume Document</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400">No resume link attached</span>
                  )}

                  {selectedApp.portfolio_url && (
                    <a
                      href={selectedApp.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 font-semibold shadow-2xs transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-500" />
                      <span>Portfolio / LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* Cover Note */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-900 block">
                  Why are you interested in Corpxcloud?
                </span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {selectedApp.cover_note || 'No cover note provided by the candidate.'}
                </div>
              </div>

              {/* Status Update section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-900 block mb-2">Change Application Status</span>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'reviewed', 'shortlisted', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateAppStatus(selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        selectedApp.status === st
                          ? 'ring-2 ring-blue-500 ring-offset-1 ' + APP_STATUS_COLORS[st]
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setDeleteTargetApp(selectedApp)}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE JOB OPENING */}
      <ConfirmDialog
        isOpen={!!deleteTargetJob}
        title="Delete Job Opening"
        message={`Are you sure you want to delete "${deleteTargetJob?.title}"? This job opening will be permanently removed from the website.`}
        confirmLabel="Delete Opening"
        isDestructive={true}
        isLoading={deletingJob}
        onConfirm={handleDeleteJob}
        onCancel={() => setDeleteTargetJob(null)}
      />

      {/* CONFIRM DELETE APPLICATION */}
      <ConfirmDialog
        isOpen={!!deleteTargetApp}
        title="Delete Application"
        message={`Are you sure you want to remove the application from "${deleteTargetApp?.name}" for "${deleteTargetApp?.job_title}"?`}
        confirmLabel="Delete Application"
        isDestructive={true}
        isLoading={deletingApp}
        onConfirm={handleDeleteApp}
        onCancel={() => setDeleteTargetApp(null)}
      />
    </div>
  );
}
