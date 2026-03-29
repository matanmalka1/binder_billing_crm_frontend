import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Clock, FolderOpen, Info, AlertTriangle, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../../utils/utils";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { getVatWorkItemStatusLabel } from "../../../utils/enums";
import { useRole } from "../../../hooks/useRole";
import { useVatWorkItemActions } from "../hooks/useVatWorkItemActions";
import { bindersApi } from "@/features/binders/api";
import { QK } from "../../../lib/queryKeys";
import { VAT_STATUS_BADGE_VARIANTS } from "../constants";
import { VatProgressBar } from "./VatProgressBar";
import { VatActionButtons } from "./VatActionButtons";
import { VatExportButtons } from "./VatExportButtons";
import { VatSendBackForm } from "./VatSendBackForm";
import { VatFileModal } from "./VatFileModal";
import { isFiled } from "../utils";
import type { VatWorkItemSummaryBarProps } from "../types";

export const VatWorkItemSummaryBar: React.FC<VatWorkItemSummaryBarProps> = ({ workItem }) => {
  const { isAdvisor } = useRole();
  const { handleReadyForReview, handleSendBack, isLoading } =
    useVatWorkItemActions(workItem.id);
  const [showSendBack, setShowSendBack] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const filed = isFiled(workItem.status);

  const { data: binderData } = useQuery({
    queryKey: QK.binders.list({ client_id: workItem.client_id!, page_size: 1 }),
    queryFn: () => bindersApi.list({ client_id: workItem.client_id!, page_size: 1, status: "in_office" }),
    enabled: !!workItem.client_id,
    staleTime: 60_000,
  });
  const activeBinder = binderData?.items?.[0] ?? null;

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
            {workItem.business_name ?? `עסק #${workItem.business_id}`}
            <span className="mx-1.5 font-normal text-gray-400">—</span>
            <span className="font-mono">{workItem.period}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeBinder && (
            <Link
              to={`/binders?binder_number=${activeBinder.binder_number}`}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <FolderOpen className="h-3 w-3" />
              קלסר {activeBinder.binder_number}
            </Link>
          )}
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
            variantMap={VAT_STATUS_BADGE_VARIANTS}
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

      {/* Submission deadline banners */}
      {workItem.is_overdue && workItem.submission_deadline && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <span>⚠️ תאריך הגשה חלף — {formatDate(workItem.submission_deadline)}</span>
        </div>
      )}
      {!workItem.is_overdue && workItem.days_until_deadline != null && workItem.days_until_deadline <= 3 && (
        <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
          <span>נותרו {workItem.days_until_deadline} ימים להגשה</span>
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
                clientStatus={workItem.business_status}
                onReadyForReview={handleReadyForReview}
                onFile={() => setShowFileModal(true)}
                onSendBack={() => setShowSendBack(true)}
              />
              {isAdvisor && (
                <VatExportButtons clientId={workItem.business_id} period={workItem.period} />
              )}
            </>
          )}
        </div>
      )}

      {/* Export only row when filed */}
      {filed && isAdvisor && (
        <div className="flex justify-end border-t border-gray-100 pt-3">
          <VatExportButtons clientId={workItem.business_id} period={workItem.period} />
        </div>
      )}
      <VatFileModal
        open={showFileModal}
        workItemId={workItem.id}
        onClose={() => setShowFileModal(false)}
      />
    </div>
  );
};

VatWorkItemSummaryBar.displayName = "VatWorkItemSummaryBar";
