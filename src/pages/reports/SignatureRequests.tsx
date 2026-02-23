import { useState } from "react";
import { Link } from "react-router-dom";
import { History, Send, X, FileSignature, Link2 } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageStateGuard } from "../../components/ui/PageStateGuard";
import { EmptyState } from "../../components/ui/EmptyState";
import { SignatureStatusBadge } from "../../features/signatureRequests/components/SignatureStatusBadge";
import { SignatureRequestAuditDrawer } from "../../features/signatureRequests/components/SignatureRequestAuditDrawer";
import { usePendingSignatureRequests } from "../../features/signatureRequests/hooks/usePendingSignatureRequests";
import { usePendingSignatureRequestActions } from "../../features/signatureRequests/hooks/usePendingSignatureRequestActions";
import type { SignatureRequestResponse } from "../../api/signatureRequests.api";
import { getSignatureRequestTypeLabel } from "../../utils/enums";
import { formatDate } from "../../utils/utils";

/* ── Summary strip ──────────────────────────────────────────── */

interface SummaryStripProps {
  items: SignatureRequestResponse[];
  total: number;
}

const SummaryStrip: React.FC<SummaryStripProps> = ({ items, total }) => {
  const draft = items.filter((r) => r.status === "draft").length;
  const pending = items.filter((r) => r.status === "pending_signature").length;
  const terminal = items.filter((r) => ["expired", "declined"].includes(r.status)).length;

  const stats = [
    { label: 'סה"כ', value: total, color: "text-gray-900" },
    { label: "טיוטה", value: draft, color: "text-gray-600" },
    { label: "ממתין לחתימה", value: pending, color: "text-blue-700" },
    { label: "פג / נדחה", value: terminal, color: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
        >
          <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
          <p className="mt-0.5 text-xs text-gray-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

/* ── Main page ──────────────────────────────────────────────── */

export const SignatureRequestsPage: React.FC = () => {
  const { items, total, clientNames, isLoading, error } = usePendingSignatureRequests();
  const { send, isSending, cancel, isCanceling } = usePendingSignatureRequestActions();

  const [signingUrls, setSigningUrls] = useState<Record<number, string>>({});
  const [auditRequestId, setAuditRequestId] = useState<number | null>(null);

  const handleSend = async (id: number) => {
    const result = await send(id);
    if (result?.signing_url_hint) {
      const hint = result.signing_url_hint;
      const path = hint.startsWith("/") ? hint : `/${hint}`;
      setSigningUrls((prev) => ({ ...prev, [id]: `${window.location.origin}${path}` }));
    }
  };

  const header = (
    <PageHeader
      title="בקשות חתימה"
      description="כל בקשות החתימה הפעילות בכלל הלקוחות"
      variant="gradient"
    />
  );

  return (
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען בקשות חתימה...">
      <div className="space-y-4">
        <SummaryStrip items={items} total={total} />

        {items.length === 0 ? (
          <EmptyState icon={FileSignature} message="אין בקשות חתימה פעילות" />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-right">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">כותרת</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">לקוח</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">סוג</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">חותם</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">סטטוס</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">נוצר</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((req) => {
                  const isDraft = req.status === "draft";
                  const isTerminal = ["signed", "declined", "expired", "canceled"].includes(req.status);
                  const signingUrl = signingUrls[req.id];

                  return (
                    <tr key={req.id} className="transition-colors duration-100 hover:bg-blue-50/30">
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                        {req.title}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/clients/${req.client_id}`}
                          className="text-sm text-gray-700 hover:text-blue-600 hover:underline"
                        >
                          {clientNames[req.client_id] ?? `#${req.client_id}`}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {getSignatureRequestTypeLabel(req.request_type)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {req.signer_name}
                      </td>
                      <td className="px-4 py-3.5">
                        <SignatureStatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 tabular-nums">
                        {formatDate(req.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {isDraft && (
                            <button
                              type="button"
                              disabled={isSending}
                              onClick={() => void handleSend(req.id)}
                              title="שלח לחתימה"
                              className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                            >
                              <Send className="h-3 w-3" />
                              שלח
                            </button>
                          )}
                          {req.status === "pending_signature" && signingUrl && (
                            <a
                              href={signingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                            >
                              <Link2 className="h-3 w-3" />
                              קישור
                            </a>
                          )}
                          {!isTerminal && (
                            <button
                              type="button"
                              disabled={isCanceling}
                              onClick={() => void cancel(req.id)}
                              title="בטל בקשה"
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setAuditRequestId(req.id)}
                            title="היסטוריית פעילות"
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                          >
                            <History className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SignatureRequestAuditDrawer
        requestId={auditRequestId}
        onClose={() => setAuditRequestId(null)}
      />
    </PageStateGuard>
  );
};
