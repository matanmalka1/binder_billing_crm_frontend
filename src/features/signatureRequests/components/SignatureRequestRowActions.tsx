import { useState } from "react";
import { Send, Link2, Copy, Check, X, History } from "lucide-react";
import { RowActionItem, RowActionLink, RowActionSeparator, RowActionsMenu } from "@/components/ui/table";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { toast } from "../../../utils/toast";
import type { SignatureRequestResponse } from "../api";
import { SIGNATURE_REQUEST_TERMINAL_STATUSES } from "../utils";

export interface SignatureRequestActionProps {
  request: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  canManage: boolean;
  onSend: (id: number) => Promise<unknown>;
  onCancel: (id: number) => Promise<unknown>;
  onAudit: (id: number) => void;
}

interface SignatureRequestRowActionsProps extends SignatureRequestActionProps {
  showOpenLink?: boolean;
  separateHistory?: boolean;
  copySuccessMessage?: string | null;
}

export const SignatureRequestRowActions: React.FC<SignatureRequestRowActionsProps> = ({
  request,
  signingUrl,
  isSending,
  isCanceling,
  canManage,
  onSend,
  onCancel,
  onAudit,
  showOpenLink = false,
  separateHistory = false,
  copySuccessMessage = "הקישור הועתק",
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isDraft = request.status === "draft";
  const isPending = request.status === "pending_signature";
  const isTerminal = SIGNATURE_REQUEST_TERMINAL_STATUSES.has(request.status);

  const handleCopy = async () => {
    if (!signingUrl) return;
    try {
      await navigator.clipboard.writeText(signingUrl);
    } catch {
      return;
    }
    setCopied(true);
    if (copySuccessMessage) {
      toast.success(copySuccessMessage);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <RowActionsMenu ariaLabel={`פעולות לבקשת חתימה ${request.id}`}>
        {canManage && isDraft && (
          <RowActionItem
            label="שלח"
            onClick={() => void onSend(request.id)}
            icon={<Send className="h-4 w-4" />}
            disabled={isSending}
          />
        )}
        {isPending && signingUrl && (
          <>
            {showOpenLink && (
              <RowActionLink
                href={signingUrl}
                target="_blank"
                rel="noopener noreferrer"
                label="פתח קישור"
                icon={<Link2 className="h-4 w-4" />}
              />
            )}
            <RowActionItem
              label={copied ? "הועתק!" : "העתק קישור"}
              onClick={() => void handleCopy()}
              icon={copied ? <Check className="h-4 w-4 text-positive-700" /> : <Copy className="h-4 w-4" />}
            />
          </>
        )}
        {separateHistory && <RowActionSeparator />}
        <RowActionItem
          label="היסטוריית פעילות"
          onClick={() => onAudit(request.id)}
          icon={<History className="h-4 w-4" />}
        />
        {canManage && !isTerminal && (
          <>
            <RowActionSeparator />
            <RowActionItem
              label="בטל בקשה"
              onClick={() => setConfirmCancel(true)}
              icon={<X className="h-4 w-4" />}
              danger
              disabled={isCanceling}
            />
          </>
        )}
      </RowActionsMenu>

      <ConfirmDialog
        open={confirmCancel}
        title="ביטול בקשת חתימה"
        message="האם לבטל את בקשת החתימה? פעולה זו אינה הפיכה."
        confirmLabel="בטל בקשה"
        cancelLabel="חזור"
        isLoading={isCanceling}
        onConfirm={() => {
          setConfirmCancel(false);
          onCancel(request.id).catch(() => {});
        }}
        onCancel={() => setConfirmCancel(false)}
      />
    </>
  );
};

SignatureRequestRowActions.displayName = "SignatureRequestRowActions";
