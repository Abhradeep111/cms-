import {
  Activity,
  Boxes,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";
import type { ModuleDefinition } from "@/types";

export const modules: ModuleDefinition[] = [
  {
    id: "hrms",
    code: "hr.core",
    name: "Human Resource Management",
    abbr: "HRMS",
    status: "live",
    summary:
      "Run the full employee lifecycle — from the offer letter to the final settlement — on one record.",
    capabilities: [
      "Employee records and org hierarchy",
      "Payroll runs with statutory compliance",
      "Biometric and geo-tagged attendance",
      "Goal tracking and appraisal cycles",
    ],
    icon: Users,
  },
  {
    id: "hms",
    code: "care.hms",
    name: "Hospital Management",
    abbr: "HMS",
    status: "live",
    summary:
      "Move a patient from registration to discharge without a single re-entry of their details.",
    capabilities: [
      "OPD and IPD admission tracking",
      "Doctor rosters and appointment slots",
      "Electronic health records with audit trail",
      "Billing, insurance and TPA claims",
    ],
    icon: Activity,
  },
  {
    id: "inventory",
    code: "ops.scm",
    name: "Vendor & Inventory Management",
    abbr: "SCM",
    status: "live",
    summary:
      "See every unit of stock across every warehouse, and know who supplied it and what it cost.",
    capabilities: [
      "Multi-warehouse stock ledger",
      "Purchase orders and GRN matching",
      "Vendor scorecards and rate contracts",
      "Reorder points with low-stock alerts",
    ],
    icon: Boxes,
  },
  {
    id: "erp",
    code: "core.erp",
    name: "Enterprise Resource Planning",
    abbr: "ERP",
    status: "roadmap",
    release: "Q3 2026",
    summary:
      "Connect general ledgers, accounts payable/receivable, asset management and corporate finance.",
    capabilities: [
      "Multi-currency general ledger and financial reports",
      "Automated accounts payable & receivable matching",
      "Procurement workflows with 3-way GRN matching",
      "Consolidated multi-entity corporate balance sheets",
    ],
    icon: Landmark,
  },
  {
    id: "iga",
    code: "sec.iga",
    name: "Identity Governance & Administration",
    abbr: "IGA",
    status: "roadmap",
    release: "Q3 2026",
    summary:
      "Grant, review and revoke access across every module from one governance console.",
    capabilities: [
      "Joiner-mover-leaver automation",
      "Role-based access certification",
      "Segregation-of-duties policy engine",
      "Compliance evidence and reporting",
    ],
    icon: ShieldCheck,
  },
  {
    id: "crm",
    code: "rev.crm",
    name: "Customer Relationship Management",
    abbr: "CRM",
    status: "roadmap",
    release: "Q3 2026",
    summary:
      "Track every deal from first touch to signature, with the numbers your board asks for.",
    capabilities: [
      "Configurable sales pipelines",
      "Lead scoring and routing rules",
      "Deal analytics and forecasting",
      "Quote and contract handoff",
    ],
    icon: Users,
  },
  {
    id: "restaurant",
    code: "fnb.pos",
    name: "Restaurant Management",
    abbr: "POS",
    status: "roadmap",
    release: "Q4 2026",
    summary:
      "Take the order, fire it to the kitchen and settle the bill on the same terminal.",
    capabilities: [
      "Point of sale with split billing",
      "Table layout and reservations",
      "Kitchen display system routing",
      "Recipe-level ingredient costing",
    ],
    icon: Utensils,
  },
  {
    id: "institute",
    code: "edu.sis",
    name: "Institute Management",
    abbr: "SIS",
    status: "roadmap",
    release: "Q4 2026",
    summary:
      "Keep students, faculty and parents looking at the same academic record.",
    capabilities: [
      "Student information and admissions",
      "Course grading and transcripts",
      "Fee collection with online payments",
      "Parent portal and attendance alerts",
    ],
    icon: GraduationCap,
  },
];

export const liveModules = modules.filter((m) => m.status === "live");
export const roadmapModules = modules.filter((m) => m.status === "roadmap");

/** Roadmap modules bucketed by target quarter, in release order. */
export const modulesByRelease = roadmapModules.reduce<Record<string, ModuleDefinition[]>>(
  (acc, module) => {
    const key = module.release ?? "Unscheduled";
    (acc[key] ??= []).push(module);
    return acc;
  },
  {},
);

export const moduleCounts = {
  all: modules.length,
  live: liveModules.length,
  roadmap: roadmapModules.length,
} as const;
