import { Bell, DollarSign, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mapActions } from "@/lib/actions/mapActions";
import type { AttentionItem, AttentionItemType } from "./api";
import type { BackendAction, ActionCommand } from "@/lib/actions/types";

export type AttentionTone = "amber" | "green" | "red" | "blue";

export interface SectionItem {
  id: number;
  label: string;
  sublabel?: string;
  href?: string;
}

export interface PanelItemAction {
  uiKey: string;
  label: string;
  urgency?: "overdue" | "upcoming" | null;
  dueLabel?: string | null;
  action: ActionCommand;
}

export interface PanelItem {
  id: string | number;
  label: string;
  sublabel?: string;
  href: string;
  actions?: PanelItemAction[];
}

export interface PanelSection {
  key: string;
  title: string;
  icon: LucideIcon;
  tone: AttentionTone;
  viewAllHref: string;
  items: PanelItem[];
}

// ── Attention items → PanelSections ────────────────────────────────────────

const ATTENTION_SECTIONS: Array<{
  key: string;
  title: string;
  icon: LucideIcon;
  tone: AttentionTone;
  types: readonly AttentionItemType[];
  viewAllHref: string;
}> = [
  {
    key: "unpaid",
    title: "חשבוניות פתוחות",
    icon: DollarSign,
    tone: "amber",
    types: ["unpaid_charge", "unpaid_charges"],
    viewAllHref: "/charges?status=issued",
  },
];

const KNOWN_ATTENTION_TYPES = new Set<AttentionItemType>(
  ATTENTION_SECTIONS.flatMap((s) => s.types),
);

const getAttentionItemHref = (item: AttentionItem, fallback: string): string => {
  if (item.client_id && item.business_id)
    return `/clients/${item.client_id}/businesses/${item.business_id}`;
  if (item.client_id) return `/clients/${item.client_id}`;
  return fallback;
};

export const attentionSectionsToPanelSections = (items: AttentionItem[]): PanelSection[] => {
  const visible = items.filter((i) => KNOWN_ATTENTION_TYPES.has(i.item_type));
  return ATTENTION_SECTIONS.map((section) => ({
    key: section.key,
    title: section.title,
    icon: section.icon,
    tone: section.tone,
    viewAllHref: section.viewAllHref,
    items: visible
      .filter((i) => section.types.includes(i.item_type))
      .map((i) => ({
        id: `${i.item_type}-${i.binder_id ?? i.business_id ?? i.client_id}`,
        label: i.client_name ?? "",
        sublabel: i.description,
        href: getAttentionItemHref(i, section.viewAllHref),
      })),
  }));
};

// ── Quick actions → PanelSections ──────────────────────────────────────────

const QA_CATEGORY_LABELS: Record<string, string> = {
  binders: "קלסרים",
  vat: 'מע"מ',
  annual_reports: 'דו"חות שנתיים',
};

const QA_CATEGORY_ORDER = ["vat", "annual_reports", "binders"] as const;

const QA_CATEGORY_META: Record<string, { icon: LucideIcon; tone: AttentionTone; href: string }> = {
  vat:            { icon: Zap,  tone: "amber", href: "/vat" },
  annual_reports: { icon: Zap,  tone: "red",   href: "/tax/reports" },
  binders:        { icon: Bell, tone: "blue",  href: "/binders" },
};

const DEFAULT_META = { icon: Zap, tone: "amber" as AttentionTone, href: "/" };

export const quickActionsToPanelSections = (rawActions: BackendAction[]): PanelSection[] => {
  const actions = mapActions(rawActions);
  const grouped = new Map<string, PanelItemAction[]>();

  for (const action of actions) {
    const cat = action.category ?? "general";
    grouped.set(cat, [
      ...(grouped.get(cat) ?? []),
      { uiKey: action.uiKey, label: action.label, urgency: action.urgency, dueLabel: action.dueLabel, action },
    ]);
  }

  const ordered = [
    ...QA_CATEGORY_ORDER,
    ...[...grouped.keys()].filter((k) => !QA_CATEGORY_ORDER.includes(k as never)),
  ];

  return ordered
    .filter((cat) => grouped.has(cat))
    .map((cat) => {
      const catActions = grouped.get(cat)!;
      const overdueCount = catActions.filter((a) => a.urgency === "overdue").length;
      const meta = QA_CATEGORY_META[cat] ?? DEFAULT_META;

      const byClient = new Map<string, PanelItemAction[]>();
      for (const a of catActions) {
        const key = a.action.clientName ?? a.action.uiKey;
        byClient.set(key, [...(byClient.get(key) ?? []), a]);
      }

      return {
        key: cat,
        title: QA_CATEGORY_LABELS[cat] ?? cat,
        icon: meta.icon,
        tone: meta.tone,
        viewAllHref: meta.href,
        items: [...byClient.entries()].map(([clientKey, clientActions], idx) => ({
          id: `${cat}-${clientKey}-${idx}`,
          label: clientActions[0].action.clientName ?? clientKey,
          sublabel: overdueCount > 0 ? `${overdueCount} באיחור` : undefined,
          href: meta.href,
          actions: clientActions,
        })),
      } satisfies PanelSection;
    });
};
