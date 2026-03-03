import { useState } from "react";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAuthStore } from "../../../store/auth.store";
import { AdvancePaymentSummary } from "./AdvancePaymentSummary";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { Button } from "../../../components/ui/Button";
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

  const { rows, isLoading, totalExpected, totalPaid, create, isCreating } =
    useAdvancePayments(clientId, year);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <select
          value={String(year)}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {YEAR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

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
