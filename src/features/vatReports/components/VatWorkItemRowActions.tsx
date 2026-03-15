import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, PackageCheck, SendHorizontal, FileCheck } from "lucide-react";
import { cn } from "../../../utils/utils";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { canMarkMaterialsComplete, canMarkReadyForReview, canFile, isFiled } from "../utils";
import type { VatWorkItemAction } from "../hooks/useVatWorkItemsPage";

interface VatWorkItemRowActionsProps {
  item: VatWorkItemResponse;
  isAdvisor: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  runAction: (itemId: number, action: VatWorkItemAction) => Promise<void>;
}

export const VatWorkItemRowActions: React.FC<VatWorkItemRowActionsProps> = ({
  item,
  isAdvisor,
  isLoading,
  isDisabled,
  runAction,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const hasAny =
    canMarkMaterialsComplete(item.status) ||
    canMarkReadyForReview(item.status) ||
    (isAdvisor && canFile(item.status));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (isFiled(item.status)) {
    return <span className="text-xs text-gray-400">הוגש</span>;
  }

  if (!hasAny) return null;

  const menuItem = (label: string, action: VatWorkItemAction, icon: React.ReactNode) => (
    <button
      key={action}
      type="button"
      disabled={isLoading || isDisabled}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(false);
        void runAction(item.id, action);
      }}
      className={cn(
        "w-full px-3 py-2 text-right text-sm text-gray-700 transition-colors hover:bg-gray-50",
        "disabled:opacity-40 disabled:cursor-not-allowed",
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
        disabled={isDisabled}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
        aria-label={`פעולות לפריט ${item.id}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {canMarkMaterialsComplete(item.status) && menuItem("אישור קבלה", "materialsComplete", <PackageCheck className="h-4 w-4" />)}
          {canMarkReadyForReview(item.status) && menuItem("שלח לבדיקה", "readyForReview", <SendHorizontal className="h-4 w-4" />)}
          {isAdvisor && canFile(item.status) && menuItem("סמן כהוגש", "file", <FileCheck className="h-4 w-4" />)}
        </div>
      )}
    </div>
  );
};

VatWorkItemRowActions.displayName = "VatWorkItemRowActions";
