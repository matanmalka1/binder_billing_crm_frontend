import { useState } from "react";
import type { AdvancePaymentStatus } from "../types";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAdvanceRateInsights } from "../hooks/useAdvanceRateInsights";
import { useRole } from "../../../hooks/useRole";
import { ClientAdvancePaymentsHeader } from "./ClientAdvancePaymentsHeader";
import { AdvancePaymentsStatsRow } from "./AdvancePaymentsStatsRow";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { AdvancePaymentsKPICards } from "./AdvancePaymentsKPICards";
import { AdvancePaymentsChart } from "./AdvancePaymentsChart";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { EditAdvanceRateModal } from "./EditAdvanceRateModal";
import { AdvanceReductionModal } from "./AdvanceReductionModal";
import { PaginationCard } from "../../../components/ui/PaginationCard";

interface ClientAdvancePaymentsTabProps {
  clientId: number;
}

export const ClientAdvancePaymentsTab: React.FC<ClientAdvancePaymentsTabProps> = ({
  clientId,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState<AdvancePaymentStatus[]>([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRateOpen, setEditRateOpen] = useState(false);
  const [reductionOpen, setReductionOpen] = useState(false);
  const { isAdvisor } = useRole();

  const { rows, isLoading, totalExpected, totalPaid, total, create, isCreating, updateRow, updatingId, deleteRow, isDeletingId } =
    useAdvancePayments(clientId, year, statusFilter, page);
  const { advanceRate, annualIncome, updateAdvanceRate, isUpdatingRate } = useAdvanceRateInsights(clientId, year);

  const totalPages = Math.max(1, Math.ceil(total / 20));
  const handleStatusToggle = (status: AdvancePaymentStatus) => {
    setPage(1);
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((x) => x !== status) : [...prev, status]));
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
      />
      <AdvancePaymentsStatsRow
        advanceRate={advanceRate}
        annualIncome={annualIncome}
        totalExpected={totalExpected}
        totalPaid={totalPaid}
      />

      <AdvancePaymentsKPICards clientId={clientId} year={year} />
      <AdvancePaymentsChart clientId={clientId} year={year} />
      <AdvancePaymentTable
        rows={rows}
        isLoading={isLoading}
        canEdit={isAdvisor}
        updatingId={updatingId}
        deletingId={isDeletingId}
        onUpdate={(id, paid_amount, status, expected_amount) =>
          updateRow(id, paid_amount, status, expected_amount)
        }
        onDelete={deleteRow}
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
          clientId={clientId}
          year={year}
          isCreating={isCreating}
          onClose={() => setModalOpen(false)}
          onCreate={create}
        />
      )}
      {isAdvisor && (
        <EditAdvanceRateModal clientId={clientId} isOpen={editRateOpen} onClose={() => setEditRateOpen(false)} />
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
