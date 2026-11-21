import { api } from './api';

export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'Product & Design' | 'Sales & Solutions' | 'Operations';
  location: string;
  type: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export interface JobApplicationPayload {
  job_id?: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  experience_range: string;
  portfolio_url?: string;
  resume_url?: string;
  cover_note?: string;
}

export const defaultJobOpenings: JobOpening[] = [
  {
    id: "eng-fullstack-sr",
    title: "Senior Full-Stack Engineer (Next.js & Cloud)",
    department: "Engineering",
    location: "Kolkata, India (Hybrid)",
    type: "Full-time",
    experience: "4+ years",
    summary:
      "Help architect and scale our core multi-tenant engine powering HRMS, ERP, and healthcare modules with high concurrency.",
    responsibilities: [
      "Design and ship scalable front-end and back-end micro-frontends in Next.js, React, and TypeScript.",
      "Build performant REST & Webhook API surfaces adhering to OpenAPI specifications.",
      "Optimize multi-tenant database queries and real-time event subscriptions.",
    ],
    requirements: [
      "Strong proficiency in TypeScript, React 18+, Next.js App Router, and Tailwind CSS.",
      "Hands-on experience building multi-tenant SaaS or distributed enterprise systems.",
      "Familiarity with cloud infra (Docker, Kubernetes, AWS/GCP, PostgreSQL).",
    ],
  },
  {
    id: "eng-cloud-architect",
    title: "Enterprise Cloud Solutions Architect",
    department: "Engineering",
    location: "Kolkata / Remote (India)",
    type: "Full-time",
    experience: "6+ years",
    summary:
      "Lead our architectural decisions for cryptographic tenant isolation, data sovereignty, and 99.9% high availability.",
    responsibilities: [
      "Architect isolated database partitioning schemes across heterogeneous cloud environments.",
      "Implement zero-trust security postures, automated TLS termination, and role-based access gateways.",
      "Collaborate directly with enterprise clients on private tenant sizing and disaster recovery plans.",
    ],
    requirements: [
      "Extensive experience in distributed cloud architectures and multi-tenant security models.",
      "Deep understanding of Linux internals, container orchestrators, and network topologies.",
      "Proven track record of managing enterprise SaaS SLAs and compliance requirements.",
    ],
  },
  {
    id: "des-product-sr",
    title: "Senior UI/UX Product Designer",
    department: "Product & Design",
    location: "Kolkata, India (Hybrid)",
    type: "Full-time",
    experience: "3+ years",
    summary:
      "Transform complicated enterprise workflows into intuitive, beautiful, and accessible user interfaces.",
    responsibilities: [
      "Evolve Corpxcloud's design system tokens, lattice grid motifs, and reusable component libraries.",
      "Conduct user interviews with hospital admins, HR directors, and factory floor operators.",
      "Deliver high-fidelity prototypes with interactive micro-animations in Figma.",
    ],
    requirements: [
      "Solid portfolio demonstrating complex B2B SaaS or enterprise web applications.",
      "Obsessive attention to detail in visual hierarchy, typography, and accessibility (WCAG AA).",
      "Familiarity with design systems in code (Tailwind CSS, design tokens).",
    ],
  },
  {
    id: "sales-account-exec",
    title: "Enterprise Account Executive (SaaS)",
    department: "Sales & Solutions",
    location: "Kolkata / Mumbai (India)",
    type: "Full-time",
    experience: "3+ years",
    summary:
      "Lead enterprise commercial relationships with hospital chains, conglomerates, and institutional clients.",
    responsibilities: [
      "Prospect, pitch, and close high-value multi-tenant software contracts across India.",
      "Coordinate with technical solution engineers to tailor live proof-of-concept demos.",
      "Build long-term pipeline and manage relationships with enterprise C-suite decision-makers.",
    ],
    requirements: [
      "Proven quota-carrying experience selling B2B SaaS or enterprise ERP/HRMS solutions.",
      "Outstanding presentation, consultative discovery, and contract negotiation skills.",
      "Strong understanding of enterprise procurement cycles and software ROI.",
    ],
  },
  {
    id: "ops-implementation-lead",
    title: "Technical Implementation & Client Success Lead",
    department: "Operations",
    location: "Kolkata, India",
    type: "Full-time",
    experience: "2+ years",
    summary:
      "Guide enterprise clients through tenant onboarding, historical data migration (ETL), and administrator training.",
    responsibilities: [
      "Lead end-to-end rollout schedules from contract signature to go-live signoff.",
      "Audit and sanitize legacy datasets (Excel, legacy SQL) and map them cleanly to Corpxcloud schemas.",
      "Act as the primary technical point-of-contact for mission-critical client support.",
    ],
    requirements: [
      "Prior experience in enterprise software implementation, customer success, or tech consulting.",
      "Strong analytical skills with SQL, CSV/JSON data transformation, and scripting.",
      "Customer-centric mindset with top-tier written and verbal communication.",
    ],
  },
];

export async function submitJobApplication(payload: JobApplicationPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.post('/platform/api/v1/job-applications', payload);
    return (res as any)?.data ?? res;
  } catch {
    const res = await api.post('/platform/api/v1/careers/apply', payload);
    return (res as any)?.data ?? res;
  }
}

