import { useState } from "react";
import { Send, X, Copy, Check, ChevronDown, ChevronUp, Link2 } from "lucide-react";
import { SignatureStatusBadge } from "./SignatureStatusBadge";
import type { SignatureRequestResponse } from "../../../api/signatureRequests.api";
import { getSignatureRequestTypeLabel } from "../../../utils/enums";
import { formatDate, formatDateTime } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

interface Props {
  request: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  canManage: boolean;
  onSend: (id: number) => Promise<unknown>;
  onCancel: (id: number) => Promise<unknown>;
}

export const SignatureRequestRow: React.FC<Props> = ({
  request,
  signingUrl,
  isSending,
  isCanceling,
  canManage,
  onSend,
  onCancel,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!signingUrl) return;
    await navigator.clipboard.writeText(signingUrl);
    setCopied(true);
    toast.success("הקישור הועתק");
    setTimeout(() => setCopied(false), 2000);
  };

  const isDraft = request.status === "draft";
  const isPending = request.status === "pending_signature";
  const isTerminal = ["signed", "declined", "expired", "canceled"].includes(request.status);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-sm">
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 truncate">{request.title}</span>
            <SignatureStatusBadge status={request.status} />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            {getSignatureRequestTypeLabel(request.request_type)}
            {" · "}
            {request.signer_name}
            {" · "}
            {formatDate(request.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {canManage && isDraft && (
            <button
              type="button"
              disabled={isSending}
              onClick={() => void onSend(request.id)}
              title="שלח לחתימה"
              className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              שלח
            </button>
          )}

          {isPending && signingUrl && (
            <button
              type="button"
              onClick={() => void handleCopy()}
              title="העתק קישור חתימה"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {canManage && !isTerminal && (
            <button
              type="button"
              disabled={isCanceling}
              onClick={() => void onCancel(request.id)}
              title="בטל בקשה"
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/60 px-4 pb-4 pt-3 space-y-2">
          {request.description && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">תיאור</span>
              <span className="text-gray-700">{request.description}</span>
            </div>
          )}
          {request.signer_email && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">דוא"ל</span>
              <span className="text-gray-700">{request.signer_email}</span>
            </div>
          )}
          {request.expires_at && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">תפוגה</span>
              <span className="text-gray-700">{formatDate(request.expires_at)}</span>
            </div>
          )}
          {request.sent_at && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">נשלח</span>
              <span className="text-gray-700 tabular-nums">{formatDateTime(request.sent_at)}</span>
            </div>
          )}
          {request.signed_at && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">נחתם</span>
              <span className="text-gray-700 tabular-nums">{formatDateTime(request.signed_at)}</span>
            </div>
          )}
          {request.decline_reason && (
            <div className="flex gap-2 text-xs">
              <span className="w-20 shrink-0 font-medium text-gray-600">סיבת דחייה</span>
              <span className="text-gray-700">{request.decline_reason}</span>
            </div>
          )}
          {isPending && signingUrl && (
            <div className="flex items-center gap-2 pt-1">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="break-all text-left text-xs text-blue-600 hover:underline"
              >
                {signingUrl}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
