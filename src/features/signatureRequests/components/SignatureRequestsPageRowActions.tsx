import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Send, Link2, Copy, Check, X, History } from "lucide-react";
import { cn } from "../../../utils/utils";
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
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isDraft = req.status === "draft";
  const isPending = req.status === "pending_signature";
  const isTerminal = TERMINAL_STATUSES.has(req.status);

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
    try { await navigator.clipboard.writeText(signingUrl); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

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
        aria-label={`פעולות לבקשה ${req.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[170px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {isDraft && item("שלח", () => { setOpen(false); onSend(req.id); }, <Send className="h-4 w-4" />, false, isSending)}
          {isPending && signingUrl && (
            <>
              <a
                href={signingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex w-full items-center px-3 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="grid w-full grid-cols-[minmax(0,1fr)_1rem] items-center gap-2">
                  <span className="truncate">פתח קישור</span>
                  <span className="flex h-4 w-4 items-center justify-center"><Link2 className="h-4 w-4" /></span>
                </span>
              </a>
              {item(
                copied ? "הועתק!" : "העתק קישור",
                () => void handleCopy(),
                copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />,
              )}
            </>
          )}
          <div className="my-1 border-t border-gray-100" />
          {item("היסטוריית פעילות", () => { setOpen(false); onAudit(req.id); }, <History className="h-4 w-4" />)}
          {!isTerminal && (
            <>
              <div className="my-1 border-t border-gray-100" />
              {item("בטל בקשה", () => { setOpen(false); onCancel(req.id); }, <X className="h-4 w-4" />, true, isCanceling)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

SignatureRequestsPageRowActions.displayName = "SignatureRequestsPageRowActions";
