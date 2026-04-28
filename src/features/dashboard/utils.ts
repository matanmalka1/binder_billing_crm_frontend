import { DollarSign, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AttentionItem, AttentionItemType } from "./api";

export type AttentionSeverity = "critical" | "warning" | "success";
export type AttentionTone = "amber" | "green" | "red";

export interface SectionConfig {
  key: string;
  title: string;
  icon: LucideIcon;
  severity: AttentionSeverity;
  types?: readonly AttentionItemType[];
  viewAllHref?: string;
}

// ── Attention sections config ───────────────────────────────────────────────

export const SECTIONS: Array<SectionConfig & {
  types: readonly AttentionItemType[];
  viewAllHref: string;
}> = [
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

const KNOWN_ATTENTION_TYPES = new Set<AttentionItemType>(
  SECTIONS.flatMap((section) => section.types),
);

export const isKnownAttentionItem = (item: AttentionItem): boolean =>
  KNOWN_ATTENTION_TYPES.has(item.item_type);

export const getAttentionTone = (severity: AttentionSeverity): AttentionTone => {
  if (severity === "success") return "green";
  if (severity === "critical") return "red";
  return "amber";
};

const getBusinessHref = (item: AttentionItem, fallback: string): string => {
  if (item.client_id && item.business_id) {
    return `/clients/${item.client_id}/businesses/${item.business_id}`;
  }
  if (item.client_id) {
    return `/clients/${item.client_id}`;
  }
  return fallback;
};

const attentionItemHrefMap: Partial<Record<AttentionItemType, (item: AttentionItem) => string>> = {
  unpaid_charge: (item) => getBusinessHref(item, "/charges?status=issued"),
  unpaid_charges: (item) => getBusinessHref(item, "/charges?status=issued"),
  ready_for_pickup: (item) => getBusinessHref(item, "/binders?status=ready_for_pickup"),
};

export const getAttentionItemHref = (item: AttentionItem): string =>
  attentionItemHrefMap[item.item_type]?.(item) ?? getBusinessHref(item, "/binders");

export const getVisibleAttentionSections = (items: AttentionItem[]) => {
  const visibleItems = items.filter(isKnownAttentionItem);

  return {
    totalItems: visibleItems.length,
    sections: SECTIONS.map((section) => ({
      section,
      items: visibleItems.filter((item) => section.types.includes(item.item_type)),
    })),
  };
};

// ── Advisor today section items ─────────────────────────────────────────────

export interface SectionItem {
  id: number;
  label: string;
  sublabel?: string;
  href?: string;
}
