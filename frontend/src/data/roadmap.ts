import { liveModules, modulesByRelease } from "@/data/modules";
import type { RoadmapPhase } from "@/types";

/**
 * Derived from lib data rather than hand-written, so flipping a module's status
 * or release quarter in data/modules.ts updates the timeline automatically.
 */
export const roadmapPhases: RoadmapPhase[] = [
  {
    period: "Shipped",
    state: "shipped",
    items: liveModules.map((m) => m.name),
  },
  ...Object.entries(modulesByRelease).map(([period, items], i) => ({
    period,
    state: (i === 0 ? "next" : "later") as RoadmapPhase["state"],
    items: items.map((m) => m.name),
  })),
];
