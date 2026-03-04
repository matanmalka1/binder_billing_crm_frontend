import { useState } from "react";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAuthStore } from "../../../store/auth.store";
import { AdvancePaymentSummary } from "./AdvancePaymentSummary";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { Button } from "../../../components/ui/Button";

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

  const { rows, isLoading, totalExpected, totalPaid, create, isCreating } =
    useAdvancePayments(clientId, year);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <input
          type="number"
          min={2000}
          max={2099}
          value={year}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= 2000 && v <= 2099) setYear(v);
          }}
          className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        />

        {role === "advisor" && (
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            הוסף מקדמה
          </Button>
        )}
      </div>

      <AdvancePaymentSummary totalExpected={totalExpected} totalPaid={totalPaid} />

      <AdvancePaymentTable rows={rows} isLoading={isLoading} />

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
