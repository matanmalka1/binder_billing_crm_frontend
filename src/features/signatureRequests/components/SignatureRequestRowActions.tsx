import { useState } from "react";
import { Send, Copy, Check, X, History } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/DropdownMenu";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { toast } from "../../../utils/toast";
import type { SignatureRequestResponse } from "../api";

interface SignatureRequestRowActionsProps {
  request: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  canManage: boolean;
  onSend: (id: number) => Promise<unknown>;
  onCancel: (id: number) => Promise<unknown>;
  onAudit: (id: number) => void;
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
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isDraft = request.status === "draft";
  const isPending = request.status === "pending_signature";
  const isTerminal = ["signed", "declined", "expired", "canceled"].includes(request.status);

  const handleCopy = async () => {
    if (!signingUrl) return;
    await navigator.clipboard.writeText(signingUrl);
    setCopied(true);
    toast.success("הקישור הועתק");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu ariaLabel={`פעולות לבקשת חתימה ${request.id}`}>
        {canManage && isDraft && (
          <DropdownMenuItem
            label="שלח"
            onClick={() => void onSend(request.id)}
            icon={<Send className="h-4 w-4" />}
            disabled={isSending}
          />
        )}
        {isPending && signingUrl && (
          <DropdownMenuItem
            label={copied ? "הועתק!" : "העתק קישור"}
            onClick={() => void handleCopy()}
            icon={copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          />
        )}
        <DropdownMenuItem
          label="היסטוריית פעילות"
          onClick={() => onAudit(request.id)}
          icon={<History className="h-4 w-4" />}
        />
        {canManage && !isTerminal && (
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
        onConfirm={() => { setConfirmCancel(false); onCancel(request.id).catch(() => {}); }}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
};

SignatureRequestRowActions.displayName = "SignatureRequestRowActions";
