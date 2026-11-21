import type { LucideIcon } from "lucide-react";

export type ModuleStatus = "live" | "roadmap";

export interface ModuleDefinition {
  /** Stable slug — used as React key and filter target. */
  id: string;
  /** Internal service key, surfaced as the mono eyebrow on each card. */
  code: string;
  name: string;
  abbr: string;
  status: ModuleStatus;
  /** Target quarter. Present only when status is "roadmap". */
  release?: string;
  summary: string;
  capabilities: string[];
  icon: LucideIcon;
  /** CTA link — configured from backend per-module; falls back to #demo / #roadmap if empty. */
  link?: string;
}

export interface Industry {
  name: string;
  /** The module combination this sector typically deploys. */
  stack: string;
  icon: LucideIcon;
}

export interface ArchitecturePillar {
  title: string;
  body: string;
  /** Short factual claim shown under the copy. */
  stat: string;
  icon: LucideIcon;
}

export type PhaseState = "shipped" | "next" | "later";

export interface RoadmapPhase {
  period: string;
  state: PhaseState;
  items: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}
