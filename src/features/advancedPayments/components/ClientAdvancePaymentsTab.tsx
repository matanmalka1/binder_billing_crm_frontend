import { useState } from "react";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAuthStore } from "../../../store/auth.store";
import { AdvancePaymentSummary } from "./AdvancePaymentSummary";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { YEAR_OPTIONS } from "../utils";

interface ClientAdvancePaymentsTabProps {
  clientId: number;
}

export const ClientAdvancePaymentsTab: React.FC<ClientAdvancePaymentsTabProps> = ({
  clientId,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [modalOpen, setModalOpen] = useState(false);
  const role = useAuthStore((s) => s.user?.role);

  const { rows, isLoading, totalExpected, totalPaid, create, isCreating, updateRow, updatingId } =
    useAdvancePayments(clientId, year);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select
          value={String(year)}
          onChange={(e) => setYear(Number(e.target.value))}
          options={YEAR_OPTIONS}
          className="w-28"
        />

        {role === "advisor" && (
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            הוסף מקדמה
          </Button>
        )}
      </div>

      <AdvancePaymentSummary totalExpected={totalExpected} totalPaid={totalPaid} />

      <AdvancePaymentTable
        rows={rows}
        isLoading={isLoading}
        canEdit={role === "advisor"}
        updatingId={updatingId}
        onUpdate={(id, paid_amount, status, expected_amount) =>
          updateRow(id, paid_amount, status, expected_amount)
        }
      />

      {role === "advisor" && (
        <CreateAdvancePaymentModal
          open={modalOpen}
          clientId={clientId}
          year={year}
          isCreating={isCreating}
          onClose={() => setModalOpen(false)}
          onCreate={create}
        />
      )}
    </div>
  );
};
