import type { ActionCommand } from "@/lib/actions/types";
import {
  QUICK_ACTION_CATEGORY_LABELS,
  QUICK_ACTION_CATEGORY_ORDER,
  QUICK_ACTION_COPY,
  QUICK_ACTION_EFFECT_DESCRIPTIONS,
  QUICK_ACTION_EFFECT_LABELS,
} from "./quickActionsConstants";

export type QuickActionGroup = {
  category: string;
  label: string;
  actions: QuickActionItem[];
};

export type QuickActionItem = {
  action: ActionCommand;
  index: number;
};

export type QuickActionPresentation = {
  categoryLabel: string;
  effectLabel: string;
  effectDescription: string;
  requiresConfirmation: boolean;
  isReadOnly: boolean;
  title: string;
  ariaLabel: string;
};

const DEFAULT_CATEGORY = "general";

export const getQuickActionCountLabel = (count: number) =>
  count > 0 ? `${count} פריטים דורשים טיפול` : QUICK_ACTION_COPY.noActions;

export const getQuickActionPresentation = (
  action: ActionCommand,
): QuickActionPresentation => {
  const categoryLabel =
    QUICK_ACTION_CATEGORY_LABELS[action.category ?? ""] ?? QUICK_ACTION_COPY.fallbackCategory;
  const effectLabel =
    QUICK_ACTION_EFFECT_LABELS[action.method] ?? QUICK_ACTION_COPY.fallbackEffect;
  const effectDescription =
    QUICK_ACTION_EFFECT_DESCRIPTIONS[action.method] ??
    QUICK_ACTION_COPY.fallbackEffectDescription;
  const requiresConfirmation = Boolean(action.confirm);
  const title = `${effectLabel}: ${effectDescription}`;

  return {
    categoryLabel,
    effectLabel,
    effectDescription,
    requiresConfirmation,
    isReadOnly: action.method === "get",
    title,
    ariaLabel: `${action.label}. ${title}${requiresConfirmation ? ". דורש אישור" : ""}`,
  };
};

export const groupQuickActions = (actions: ActionCommand[]): QuickActionGroup[] => {
  const grouped = new Map<string, QuickActionItem[]>();

  actions.forEach((action, index) => {
    const category = action.category ?? DEFAULT_CATEGORY;
    grouped.set(category, [...(grouped.get(category) ?? []), { action, index }]);
  });

  const orderedCategories = [
    ...QUICK_ACTION_CATEGORY_ORDER,
    ...[...grouped.keys()].filter(
      (category) => !QUICK_ACTION_CATEGORY_ORDER.some((ordered) => ordered === category),
    ),
  ];

  return orderedCategories
    .filter((category) => grouped.has(category))
    .map((category) => ({
      category,
      label:
        QUICK_ACTION_CATEGORY_LABELS[category] ??
        (category === DEFAULT_CATEGORY ? QUICK_ACTION_COPY.fallbackCategory : category),
      actions: grouped.get(category) ?? [],
    }));
};
