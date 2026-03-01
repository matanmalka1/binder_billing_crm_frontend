import { AlertTriangle, DollarSign, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Section variant configs ─────────────────────────────────────────────────

export type AttentionSeverity = "critical" | "warning" | "success";

export interface SectionConfig {
  key: string;
  title: string;
  icon: LucideIcon;
  severity: AttentionSeverity;
  types?: readonly string[];
  viewAllHref?: string;
}


export const attentionSeverityCfg = {
  critical: {
    headerGradient: "from-gray-700 to-gray-600",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    badge: "bg-gray-600 text-white",
    itemDot: "bg-gray-400",
    itemHover: "hover:bg-gray-50",
    itemBorder: "border-gray-100",
    viewAll: "text-gray-600 hover:text-gray-800",
    emptyIcon: "text-gray-300",
    countPill: "bg-white/20 text-white",
  },
  warning: {
    headerGradient: "from-gray-700 to-gray-600",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    badge: "bg-gray-600 text-white",
    itemDot: "bg-gray-400",
    itemHover: "hover:bg-gray-50",
    itemBorder: "border-gray-100",
    viewAll: "text-gray-600 hover:text-gray-800",
    emptyIcon: "text-gray-300",
    countPill: "bg-white/20 text-white",
  },
  success: {
    headerGradient: "from-gray-700 to-gray-600",
    iconBg: "bg-gray-100",
    iconText: "text-gray-600",
    badge: "bg-gray-600 text-white",
    itemDot: "bg-gray-400",
    itemHover: "hover:bg-gray-50",
    itemBorder: "border-gray-100",
    viewAll: "text-gray-600 hover:text-gray-800",
    emptyIcon: "text-gray-300",
    countPill: "bg-white/20 text-white",
  },
} as const;

// ── Attention sections config ───────────────────────────────────────────────

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

// ── Advisor today section items ─────────────────────────────────────────────

export interface SectionItem {
  id: number;
  label: string;
  sublabel?: string;
  href?: string;
}
