import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { VatAuditLogResponse } from "../../../api/vatReports.api";
import { vatReportsApi } from "../../../api/vatReports.api";
import { QK } from "../../../lib/queryKeys";
import { formatDateTime } from "../../../utils/utils";
import { formatVatAmount } from "../utils";
import {
  ACTION_LABELS,
  AUTO_TRANSITION_NOTE,
  FILING_METHOD_LABELS,
  INVOICE_TYPE_LABELS,
  PAGE_SIZE,
  STATUS_LABELS,
} from "../history.constants";
import type { VatHistoryTabProps } from "../types";

const asLabel = (value: unknown, labels: Record<string, string>): string =>
  labels[String(value ?? "")] ?? String(value ?? "");

const toStringValue = (value: unknown): string =>
  String(value);

const formatOverrideState = (value: unknown): string =>
  value ? "בוצעה עקיפה" : "לא בוצעה עקיפה";

const pushIfDefined = (parts: string[], value: unknown, builder: (v: unknown) => string): void => {
  if (value !== undefined) parts.push(builder(value));
};

const parseJsonObject = (raw: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const toDetailText = (raw: string | null): string | null => {
  if (!raw) return null;
  const parsed = parseJsonObject(raw);
  if (!parsed) return raw;

  const parts: string[] = [];
  pushIfDefined(parts, parsed.invoice_id, (v) => `חשבונית #${toStringValue(v)}`);
  pushIfDefined(parts, parsed.type, (v) => `סוג: ${asLabel(v, INVOICE_TYPE_LABELS)}`);
  pushIfDefined(parts, parsed.number, (v) => `מספר: ${toStringValue(v)}`);
  pushIfDefined(parts, parsed.vat_amount, (v) => `מע"מ: ${formatVatAmount(Number(v))}`);
  pushIfDefined(parts, parsed.status, (v) => `סטטוס: ${asLabel(v, STATUS_LABELS)}`);
  pushIfDefined(parts, parsed.period, (v) => `תקופה: ${toStringValue(v)}`);
  pushIfDefined(parts, parsed.final_vat_amount, (v) => `סכום מע"מ סופי: ${formatVatAmount(Number(v))}`);
  pushIfDefined(parts, parsed.filing_method, (v) => `אופן הגשה: ${asLabel(v, FILING_METHOD_LABELS)}`);
  pushIfDefined(parts, parsed.is_overridden, formatOverrideState);

  if (parts.length > 0) return parts.join(" | ");
  return raw;
};

const firstDetailText = (...values: Array<string | null>): string | null => {
  for (const value of values) {
    const text = toDetailText(value);
    if (text) return text;
  }
  return null;
};

const normalizeNote = (note: string | null): string | null =>
  note === AUTO_TRANSITION_NOTE ? "העברה אוטומטית בהזנת חשבונית ראשונה" : note;

const formatStatusTransition = (oldValue: string | null, newValue: string | null): string => {
  const hasOld = Boolean(oldValue);
  const hasNew = Boolean(newValue);
  const oldStatus = asLabel(oldValue, STATUS_LABELS);
  const newStatus = asLabel(newValue, STATUS_LABELS);

  if (hasOld && hasNew) return `מ-${oldStatus} ל-${newStatus}`;
  if (hasNew) return `ל-${newStatus}`;
  if (hasOld) return `מ-${oldStatus}`;
  return "";
};

const formatVatOverride = (oldValue: string | null, newValue: string | null): string | null => {
  if (!oldValue || !newValue) return null;
  return `מע"מ מחושב: ${formatVatAmount(Number(oldValue))} | מע"מ חלופי: ${formatVatAmount(Number(newValue))}`;
};

const formatDetails = (entry: VatAuditLogResponse): string => {
  const note = normalizeNote(entry.note);

  if (entry.action === "status_changed") {
    const transition = formatStatusTransition(entry.old_value, entry.new_value);
    if (note && transition) return `${note} | ${transition}`;
    if (note) return note;
    if (transition) return transition;
  }

  if (note) return note;

  const overrideDetails = formatVatOverride(entry.old_value, entry.new_value);
  if (entry.action === "vat_override" && overrideDetails) return overrideDetails;

  return firstDetailText(entry.new_value, entry.old_value) ?? "—";
};

export const VatHistoryTab: React.FC<VatHistoryTabProps> = ({ workItemId }) => {
  const [page, setPage] = useState(0);
  const { data, isPending } = useQuery({
    queryKey: QK.tax.vatWorkItems.audit(workItemId),
    queryFn: () => vatReportsApi.getAuditTrail(workItemId),
  });

  const items = [...(data?.items ?? [])].reverse();
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isPending) {
    return <p className="py-8 text-center text-sm text-gray-400">טוען...</p>;
  }

  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-400">אין היסטוריה</p>;
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-gray-100" dir="rtl">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 text-right">תאריך</th>
              <th className="px-4 py-3 text-right">פעולה</th>
              <th className="px-4 py-3 text-right">פרטים</th>
              <th className="px-4 py-3 text-right">בוצע ע&quot;י</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {pageItems.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3 text-gray-500 tabular-nums whitespace-nowrap">
                  {formatDateTime(entry.performed_at)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                  {formatDetails(entry)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {entry.performed_by_name ?? `#${entry.performed_by}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500" dir="rtl">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הקודם
          </button>
          <span>
            עמוד {page + 1} מתוך {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded px-3 py-1 hover:bg-gray-100 disabled:opacity-40"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
};

VatHistoryTab.displayName = "VatHistoryTab";
