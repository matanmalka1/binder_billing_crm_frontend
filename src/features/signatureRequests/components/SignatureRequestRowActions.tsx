import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Send, Copy, Check, X } from "lucide-react";
import { cn } from "../../../utils/utils";
import { toast } from "../../../utils/toast";
import type { SignatureRequestResponse } from "../../../api/signatureRequests.api";

interface SignatureRequestRowActionsProps {
  request: SignatureRequestResponse;
  signingUrl?: string;
  isSending: boolean;
  isCanceling: boolean;
  canManage: boolean;
  onSend: (id: number) => Promise<unknown>;
  onCancel: (id: number) => Promise<unknown>;
}

export const SignatureRequestRowActions: React.FC<SignatureRequestRowActionsProps> = ({
  request,
  signingUrl,
  isSending,
  isCanceling,
  canManage,
  onSend,
  onCancel,
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isDraft = request.status === "draft";
  const isPending = request.status === "pending_signature";
  const isTerminal = ["signed", "declined", "expired", "canceled"].includes(request.status);

  const hasActions = (canManage && isDraft) || (isPending && !!signingUrl) || (canManage && !isTerminal);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleCopy = async () => {
    if (!signingUrl) return;
    await navigator.clipboard.writeText(signingUrl);
    setCopied(true);
    toast.success("הקישור הועתק");
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  if (!hasActions) return null;

  const item = (label: string, onClick: () => void, icon: React.ReactNode, danger = false, disabled = false) => (
    <button
      key={label}
      type="button"
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm transition-colors hover:bg-gray-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700",
      )}
    >
      <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
        <span className="truncate">{label}</span>
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      </span>
    </button>
  );

  return (
    <div ref={ref} className="relative flex justify-center" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600"
        aria-label={`פעולות לבקשת חתימה ${request.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {canManage && isDraft && item("שלח", () => void onSend(request.id), <Send className="h-4 w-4" />, false, isSending)}
          {isPending && signingUrl && item(
            copied ? "הועתק!" : "העתק קישור",
            () => void handleCopy(),
            copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />,
          )}
          {canManage && !isTerminal && (
            <>
              {(isDraft || isPending) && <div className="my-1 border-t border-gray-100" />}
              {item("בטל בקשה", () => void onCancel(request.id), <X className="h-4 w-4" />, true, isCanceling)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

SignatureRequestRowActions.displayName = "SignatureRequestRowActions";
