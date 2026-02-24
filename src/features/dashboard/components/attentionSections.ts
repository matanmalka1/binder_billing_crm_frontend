import { AlertTriangle, DollarSign, Package } from "lucide-react";
import type { SectionConfig } from "./sectionVariants";

export const SECTIONS: Array<SectionConfig & {
  types: readonly string[];
  viewAllHref: string;
}> = [
  {
    key: "overdue",
    title: "קלסרים באיחור",
    icon: AlertTriangle,
    types: ["overdue", "overdue_binder", "idle_binder"],
    severity: "critical",
    viewAllHref: "/binders",
  },
  {
    key: "unpaid",
    title: "חיובים שלא שולמו",
    icon: DollarSign,
    types: ["unpaid_charge", "unpaid_charges"],
    severity: "warning",
    viewAllHref: "/charges?status=issued",
  },
  {
    key: "ready",
    title: "מוכן לאיסוף",
    icon: Package,
    types: ["ready_for_pickup"],
    severity: "success",
    viewAllHref: "/binders?status=ready_for_pickup",
  },
] as const;

export type SectionKey = (typeof SECTIONS)[number]["key"];
