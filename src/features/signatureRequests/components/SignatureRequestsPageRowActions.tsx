import { useState } from "react";
import { Send, Link2, Copy, Check, X, History } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import type { SignatureRequestResponse } from "../../../api/signatureRequests.api";

const TERMINAL_STATUSES = new Set(["signed", "expired", "canceled", "declined"]);

interface SignatureRequestsPageRowActionsProps {
  req: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  onSend: (id: number) => void;
  onCancel: (id: number) => void;
  onAudit: (id: number) => void;
}

export const SignatureRequestsPageRowActions: React.FC<SignatureRequestsPageRowActionsProps> = ({
  req,
  signingUrl,
  isSending,
  isCanceling,
  onSend,
  onCancel,
  onAudit,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isDraft = req.status === "draft";
  const isPending = req.status === "pending_signature";
  const isTerminal = TERMINAL_STATUSES.has(req.status);

  const handleCopy = async () => {
    if (!signingUrl) return;
    try { await navigator.clipboard.writeText(signingUrl); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות לבקשה ${req.id}`}>
        {isDraft && (
          <DropdownMenuItem
            label="שלח"
            onClick={() => onSend(req.id)}
            icon={<Send className="h-4 w-4" />}
            disabled={isSending}
          />
        )}
        {isPending && signingUrl && (
          <>
            {/* Native link — open in new tab */}
            <a
              href={signingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center px-3 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
                <span className="truncate">פתח קישור</span>
                <span className="flex h-4 w-4 items-center justify-center"><Link2 className="h-4 w-4" /></span>
              </span>
            </a>
            <DropdownMenuItem
              label={copied ? "הועתק!" : "העתק קישור"}
              onClick={() => void handleCopy()}
              icon={copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            />
          </>
        )}
        <div className="my-1 border-t border-gray-100" />
        <DropdownMenuItem
          label="היסטוריית פעילות"
          onClick={() => onAudit(req.id)}
          icon={<History className="h-4 w-4" />}
        />
        {!isTerminal && (
          <>
            <div className="my-1 border-t border-gray-100" />
            <DropdownMenuItem
              label="בטל בקשה"
              onClick={() => setConfirmCancel(true)}
              icon={<X className="h-4 w-4" />}
              danger
              disabled={isCanceling}
            />
          </>
        )}
      </DropdownMenu>

      <ConfirmDialog
        open={confirmCancel}
        title="ביטול בקשת חתימה"
        message="האם לבטל את בקשת החתימה? פעולה זו אינה הפיכה."
        confirmLabel="בטל בקשה"
        cancelLabel="חזור"
        isLoading={isCanceling}
        onConfirm={() => { setConfirmCancel(false); onCancel(req.id); }}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
};

SignatureRequestsPageRowActions.displayName = "SignatureRequestsPageRowActions";
