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
  description?: string;
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
  /** Section-specific metadata for richer row rendering */
  meta?: {
    tag?: string;           // pill text (e.g. due date, period)
    tagTone?: AttentionTone;
    badge?: string;         // small badge (e.g. "באיחור")
    badgeTone?: AttentionTone;
    description?: string;   // secondary line below sublabel
  };
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

const getChargeItemDescription = (item: AttentionItem): string | undefined => {
  if (item.item_type !== "unpaid_charge") return undefined;
  return item.charge_subject ?? undefined;
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
        meta: {
          tag: i.item_type === "unpaid_charges" ? "מרובות" : undefined,
          tagTone: "amber" as AttentionTone,
          description: getChargeItemDescription(i),
        },
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
      const meta = QA_CATEGORY_META[cat] ?? DEFAULT_META;

      return {
        key: cat,
        title: QA_CATEGORY_LABELS[cat] ?? cat,
        icon: meta.icon,
        tone: meta.tone,
        viewAllHref: meta.href,
        items: catActions.map((a, idx) => ({
          id: `${cat}-${a.uiKey}-${idx}`,
          label: a.action.clientName ?? a.action.binderNumber ?? a.label,
          sublabel: a.dueLabel ?? QA_CATEGORY_LABELS[cat] ?? undefined,
          href: meta.href,
          meta: a.urgency === "overdue"
            ? { badge: "באיחור", badgeTone: "red" as AttentionTone }
            : a.urgency === "upcoming"
              ? { badge: "מתקרב", badgeTone: "amber" as AttentionTone }
              : undefined,
          actions: [a],
        })),
      } satisfies PanelSection;
    });
};
