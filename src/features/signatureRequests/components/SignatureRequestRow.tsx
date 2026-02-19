import { useState } from "react";
import { Send, X, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../components/ui/Button";
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
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 text-sm truncate">{request.title}</span>
            <SignatureStatusBadge status={request.status} />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {getSignatureRequestTypeLabel(request.request_type)} •{" "}
            {request.signer_name} •{" "}
            {formatDate(request.created_at)}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {canManage && isDraft && (
            <Button
              variant="outline"
              size="sm"
              isLoading={isSending}
              onClick={() => onSend(request.id)}
              title="שלח לחתימה"
            >
              <Send className="h-3.5 w-3.5" />
              <span>שלח</span>
            </Button>
          )}

          {isPending && signingUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title="העתק קישור חתימה"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}

          {canManage && !isTerminal && (
            <Button
              variant="ghost"
              size="sm"
              isLoading={isCanceling}
              onClick={() => onCancel(request.id)}
              title="בטל בקשה"
              className="text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2 text-xs text-gray-600 space-y-1 bg-gray-50">
          {request.description && (
            <div>
              <span className="font-medium text-gray-700">תיאור: </span>
              {request.description}
            </div>
          )}
          {request.signer_email && (
            <div>
              <span className="font-medium text-gray-700">דוא&quot;ל: </span>
              {request.signer_email}
            </div>
          )}
          {request.expires_at && (
            <div>
              <span className="font-medium text-gray-700">תפוגה: </span>
              {formatDate(request.expires_at)}
            </div>
          )}
          {request.sent_at && (
            <div>
              <span className="font-medium text-gray-700">נשלח: </span>
              {formatDateTime(request.sent_at)}
            </div>
          )}
          {request.signed_at && (
            <div>
              <span className="font-medium text-gray-700">נחתם: </span>
              {formatDateTime(request.signed_at)}
            </div>
          )}
          {request.decline_reason && (
            <div>
              <span className="font-medium text-gray-700">סיבת דחייה: </span>
              {request.decline_reason}
            </div>
          )}
          {isPending && signingUrl && (
            <div className="pt-1">
              <span className="font-medium text-gray-700">קישור לחתימה: </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-blue-600 hover:underline break-all text-left"
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
