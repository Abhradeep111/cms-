import { Blocks, Gauge, ServerCog, ShieldCheck } from "lucide-react";
import type { ArchitecturePillar } from "@/types";

export const pillars: ArchitecturePillar[] = [
  {
    icon: ShieldCheck,
    title: "Multi-tenant security",
    body: "Each tenant gets an isolated schema, its own encryption keys and row-level policies. One customer's data can never appear in another's query plan.",
    stat: "AES-256 at rest",
  },
  {
    icon: ServerCog,
    title: "High-availability cloud",
    body: "Active-active across availability zones with automated failover, point-in-time recovery and nightly restore drills against real snapshots.",
    stat: "99.95% uptime target",
  },
  {
    icon: Blocks,
    title: "Seamless API integration",
    body: "A documented REST and webhook surface on every module, so your ERP, banking partner or lab equipment writes into the same ledger your team reads.",
    stat: "OpenAPI 3.1 spec",
  },
  {
    icon: Gauge,
    title: "Real-time analytics",
    body: "Operational dashboards stream from the write path — no overnight batch, no stale numbers in a Monday morning review.",
    stat: "Sub-second refresh",
  },
];
