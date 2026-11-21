import {
  Building2,
  Factory,
  HeartPulse,
  School,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import type { Industry } from "@/types";

export const industries: Industry[] = [
  {
    icon: HeartPulse,
    name: "Hospitals & clinics",
    stack: "HMS + HRMS + Inventory",
  },
  { icon: Factory, name: "Manufacturing", stack: "Inventory + HRMS" },
  { icon: Building2, name: "Corporate & shared services", stack: "HRMS + IGA" },
  { icon: Truck, name: "Distribution & retail", stack: "Inventory + CRM" },
  { icon: School, name: "Schools & colleges", stack: "Institute + HRMS" },
  {
    icon: UtensilsCrossed,
    name: "Restaurant groups",
    stack: "POS + Inventory",
  },
];
