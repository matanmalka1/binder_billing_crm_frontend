import { AlertTriangle, DollarSign, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Section variant configs ─────────────────────────────────────────────────

export type AdvisorSeverity = "critical" | "warning" | "info" | "success";
export type AttentionSeverity = "critical" | "warning" | "success";

export interface SectionConfig {
  key: string;
  title: string;
  icon: LucideIcon;
  severity: AttentionSeverity;
  types?: readonly string[];
  viewAllHref?: string;
}

export const advisorSeverityCfg = {
  critical: {
    headerGradient: "from-red-600 to-rose-500",
    itemDot: "bg-red-400",
    itemHover: "hover:bg-red-50/70",
    emptyIcon: "text-red-200",
    countPill: "bg-white/20 text-white",
  },
  warning: {
    headerGradient: "from-amber-500 to-orange-400",
    itemDot: "bg-amber-400",
    itemHover: "hover:bg-amber-50/70",
    emptyIcon: "text-amber-200",
    countPill: "bg-white/20 text-white",
  },
  info: {
    headerGradient: "from-blue-500 to-indigo-500",
    itemDot: "bg-blue-400",
    itemHover: "hover:bg-blue-50/70",
    emptyIcon: "text-blue-200",
    countPill: "bg-white/20 text-white",
  },
  success: {
    headerGradient: "from-emerald-500 to-teal-400",
    itemDot: "bg-emerald-400",
    itemHover: "hover:bg-emerald-50/70",
    emptyIcon: "text-emerald-200",
    countPill: "bg-white/20 text-white",
  },
} as const;

export const attentionSeverityCfg = {
  critical: {
    headerGradient: "from-red-600 to-rose-500",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    badge: "bg-red-600 text-white",
    itemDot: "bg-red-400",
    itemHover: "hover:bg-red-50/70",
    itemBorder: "border-red-100",
    viewAll: "text-red-600 hover:text-red-800",
    emptyIcon: "text-red-200",
    countPill: "bg-white/20 text-white",
  },
  warning: {
    headerGradient: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    badge: "bg-amber-500 text-white",
    itemDot: "bg-amber-400",
    itemHover: "hover:bg-amber-50/70",
    itemBorder: "border-amber-100",
    viewAll: "text-amber-600 hover:text-amber-800",
    emptyIcon: "text-amber-200",
    countPill: "bg-white/20 text-white",
  },
  success: {
    headerGradient: "from-emerald-500 to-teal-400",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    badge: "bg-emerald-500 text-white",
    itemDot: "bg-emerald-400",
    itemHover: "hover:bg-emerald-50/70",
    itemBorder: "border-emerald-100",
    viewAll: "text-emerald-600 hover:text-emerald-800",
    emptyIcon: "text-emerald-200",
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
