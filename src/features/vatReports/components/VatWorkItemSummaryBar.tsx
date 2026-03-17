import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Info, AlertTriangle, User } from "lucide-react";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { useRole } from "../../../hooks/useRole";
import { useVatWorkItemActions } from "../hooks/useVatWorkItemActions";
import { VatProgressBar } from "./VatProgressBar";
import { VatActionButtons } from "./VatActionButtons";
import { VatExportButtons } from "./VatExportButtons";
import { VatSendBackForm } from "./VatSendBackForm";
import { isFiled } from "../utils";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";

const STATUS_VARIANTS: Record<string, "success" | "warning" | "error" | "info" | "neutral"> = {
  pending_materials: "warning",
  material_received: "info",
  data_entry_in_progress: "info",
  ready_for_review: "warning",
  filed: "success",
};

interface VatWorkItemSummaryBarProps {
  workItem: VatWorkItemResponse;
}

export const VatWorkItemSummaryBar: React.FC<VatWorkItemSummaryBarProps> = ({ workItem }) => {
  const { isAdvisor } = useRole();
  const { handleReadyForReview, handleFile, handleSendBack, isLoading } =
    useVatWorkItemActions(workItem.id);
  const [showSendBack, setShowSendBack] = useState(false);
  const filed = isFiled(workItem.status);

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
      dir="rtl"
    >
      {/* Row 1: breadcrumb + title + assigned_to + status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-sm">
          <Link
            to="/tax/vat"
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            דוחות מע&quot;מ
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 text-gray-300" />
          <span className="font-semibold text-gray-800">
            {workItem.client_name ?? `לקוח #${workItem.client_id}`}
            <span className="mx-1.5 font-normal text-gray-400">—</span>
            <span className="font-mono">{workItem.period}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {workItem.assigned_to !== null && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              <User className="h-3 w-3" />
              <span className="text-gray-400">מטפל:</span>
              {workItem.assigned_to_name ?? `#${workItem.assigned_to}`}
            </span>
          )}
          <StatusBadge
            status={workItem.status}
            getLabel={getVatWorkItemStatusLabel}
            variantMap={STATUS_VARIANTS}
          />
        </div>
      </div>

      {/* Pending materials note */}
      {workItem.status === "pending_materials" && workItem.pending_materials_note && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <span>{workItem.pending_materials_note}</span>
        </div>
      )}

      {/* Override warning */}
      {workItem.is_overridden && (
        <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-semibold text-orange-700">
              סכום מע&quot;מ עוקף
            </span>
            {workItem.override_justification && (
              <span className="text-orange-700">{workItem.override_justification}</span>
            )}
          </div>
        </div>
      )}

      {/* Row 2: progress bar */}
      <VatProgressBar currentStatus={workItem.status} />

      {/* Row 3: actions + export (hidden when filed) */}
      {!filed && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          {showSendBack ? (
            <div className="w-full">
              <p className="mb-2 text-sm font-medium text-orange-700">הוספת הערה לתיקון</p>
              <VatSendBackForm
                loading={isLoading}
                onCancel={() => setShowSendBack(false)}
                onSubmit={async (note) => {
                  await handleSendBack(note);
                  setShowSendBack(false);
                }}
              />
            </div>
          ) : (
            <>
              <VatActionButtons
                status={workItem.status}
                isAdvisor={isAdvisor}
                isLoading={isLoading}
                clientStatus={workItem.client_status}
                onReadyForReview={handleReadyForReview}
                onFile={handleFile}
                onSendBack={() => setShowSendBack(true)}
              />
              {isAdvisor && (
                <VatExportButtons clientId={workItem.client_id} period={workItem.period} />
              )}
            </>
          )}
        </div>
      )}

      {/* Export only row when filed */}
      {filed && isAdvisor && (
        <div className="flex justify-end border-t border-gray-100 pt-3">
          <VatExportButtons clientId={workItem.client_id} period={workItem.period} />
        </div>
      )}
    </div>
  );
};

VatWorkItemSummaryBar.displayName = "VatWorkItemSummaryBar";
