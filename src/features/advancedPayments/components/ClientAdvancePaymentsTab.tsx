import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdvancePaymentStatus } from "../types";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAdvanceRateInsights } from "../hooks/useAdvanceRateInsights";
import { useRole } from "../../../hooks/useRole";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import { toast } from "../../../utils/toast";
import { getHttpStatus, showErrorToast } from "../../../utils/utils";
import { ClientAdvancePaymentsHeader } from "./ClientAdvancePaymentsHeader";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { AdvancePaymentsKPICards } from "./AdvancePaymentsKPICards";
import { AdvancePaymentsChart } from "./AdvancePaymentsChart";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { EditAdvanceRateModal } from "./EditAdvanceRateModal";
import { AdvanceReductionModal } from "./AdvanceReductionModal";
import { PaginationCard } from "../../../components/ui/table/PaginationCard";

interface ClientAdvancePaymentsTabProps {
  businessId: number;
}

export const ClientAdvancePaymentsTab: React.FC<ClientAdvancePaymentsTabProps> = ({
  businessId,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState<AdvancePaymentStatus[]>([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRateOpen, setEditRateOpen] = useState(false);
  const [reductionOpen, setReductionOpen] = useState(false);
  const { isAdvisor } = useRole();

  const queryClient = useQueryClient();
  const { rows, isLoading, total, create, isCreating, updateRow, updatingId, deleteRow, isDeletingId } =
    useAdvancePayments(businessId, year, statusFilter, page);
  const { advanceRate, updateAdvanceRate, isUpdatingRate } = useAdvanceRateInsights(businessId);

  const generateMutation = useMutation({
    mutationFn: () => advancePaymentsApi.generateSchedule(businessId, year, 1),
    onSuccess: (data) => {
      const msg = data.created > 0 ? `נוצרו ${data.created} מקדמות` : "הכול קיים";
      toast.success(msg);
      void queryClient.invalidateQueries({ queryKey: advancedPaymentsQK.forBusinessYear(businessId, year) });
    },
    onError: (err) => showErrorToast(err, "שגיאה ביצירת לוח מקדמות"),
  });

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const handleStatusToggle = (status: AdvancePaymentStatus) => {
    setPage(1);
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((x) => x !== status) : [...prev, status]));
  };

  const handleUpdateRow = async (
    id: number,
    paid_amount: string | null,
    status?: AdvancePaymentStatus,
    expected_amount?: string | null,
  ) => {
    try {
      await updateRow(id, paid_amount, status, expected_amount);
      toast.success("מקדמה עודכנה בהצלחה");
    } catch (err) {
      showErrorToast(err, "שגיאה בעדכון מקדמה");
    }
  };

  const handleCreate = async (...args: Parameters<typeof create>) => {
    try {
      const result = await create(...args);
      toast.success("מקדמה נוצרה בהצלחה");
      return result;
    } catch (err) {
      if (getHttpStatus(err) === 409) {
        toast.error("מקדמה לחודש זה כבר קיימת");
      } else {
        showErrorToast(err, "שגיאה ביצירת מקדמה");
      }
      throw err;
    }
  };

  const handleDeleteRow = async (id: number) => {
    try {
      await deleteRow(id);
      toast.success("מקדמה נמחקה בהצלחה");
    } catch (err) {
      showErrorToast(err, "שגיאה במחיקת מקדמה");
    }
  };

  return (
    <div className="space-y-6">
      <ClientAdvancePaymentsHeader
        isAdvisor={isAdvisor}
        statusFilter={statusFilter}
        onToggleStatus={handleStatusToggle}
        year={year}
        onYearChange={(nextYear) => { setPage(1); setYear(nextYear); }}
        onOpenCreate={() => setModalOpen(true)}
        onOpenReduction={() => setReductionOpen(true)}
        onOpenEditRate={() => setEditRateOpen(true)}
        onGenerateSchedule={() => generateMutation.mutate()}
        isGenerating={generateMutation.isPending}
      />
      <AdvancePaymentsKPICards businessId={businessId} year={year} />
      <AdvancePaymentsChart businessId={businessId} year={year} />
      <AdvancePaymentTable
        rows={rows}
        isLoading={isLoading}
        canEdit={isAdvisor}
        updatingId={updatingId}
        deletingId={isDeletingId}
        onUpdate={handleUpdateRow}
        onDelete={handleDeleteRow}
      />

      {totalPages > 1 && (
        <PaginationCard
          page={page}
          totalPages={totalPages}
          total={total}
          label="מקדמות"
        onPageChange={setPage}
      />
      )}

      {isAdvisor && (
        <CreateAdvancePaymentModal
          open={modalOpen}
          businessId={businessId}
          year={year}
          isCreating={isCreating}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
      {isAdvisor && (
        <EditAdvanceRateModal businessId={businessId} isOpen={editRateOpen} onClose={() => setEditRateOpen(false)} />
      )}
      {isAdvisor && (
        <AdvanceReductionModal
          isOpen={reductionOpen}
          onClose={() => setReductionOpen(false)}
          advanceRate={advanceRate}
          isUpdating={isUpdatingRate}
          onSubmit={updateAdvanceRate}
        />
      )}
    </div>
  );
};
