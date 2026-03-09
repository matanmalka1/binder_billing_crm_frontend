import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, Percent, TrendingUp, Banknote, CheckCircle, AlertCircle, Edit2 } from "lucide-react";
import type { AdvancePaymentStatus } from "../api/advancePayments.types";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useAuthStore } from "../../../store/auth.store";
import { useTaxProfile } from "../../taxProfile/hooks/useTaxProfile";
import { AdvancePaymentTable } from "./AdvancePaymentTable";
import { AdvancePaymentsKPICards } from "../../../components/advancePayments/AdvancePaymentsKPICards";
import { AdvancePaymentsChart } from "../../../components/advancePayments/AdvancePaymentsChart";
import { CreateAdvancePaymentModal } from "./CreateAdvancePaymentModal";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import { StatsCard } from "../../../components/ui/StatsCard";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { TaxProfileForm } from "../../taxProfile/components/TaxProfileForm";
import { advancePaymentsApi } from "../api/advancePayments.api";
import { YEAR_OPTIONS, fmtCurrency } from "../utils";
import { QK } from "../../../lib/queryKeys";

interface ClientAdvancePaymentsTabProps {
  clientId: number;
}

export const ClientAdvancePaymentsTab: React.FC<ClientAdvancePaymentsTabProps> = ({
  clientId,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState<AdvancePaymentStatus[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRateOpen, setEditRateOpen] = useState(false);
  const [reductionOpen, setReductionOpen] = useState(false);
  const [reductionRate, setReductionRate] = useState("");

  const role = useAuthStore((s) => s.user?.role);
  const isAdvisor = role === "advisor";

  const { rows, isLoading, totalExpected, totalPaid, create, isCreating, updateRow, updatingId, deleteRow, isDeletingId } =
    useAdvancePayments(clientId, year, statusFilter);

  const { profile, updateProfile, isUpdating: isUpdatingProfile } = useTaxProfile(clientId);

  const { data: suggestion } = useQuery({
    queryKey: QK.tax.advancePayments.suggestion(clientId, year),
    queryFn: () => advancePaymentsApi.getSuggestion(clientId, year),
    enabled: clientId > 0 && year > 0,
    staleTime: 60_000,
  });

  const balance = totalExpected - totalPaid;
  const advanceRate = profile?.advance_rate ?? null;
  const annualIncome =
    suggestion?.has_data && suggestion.suggested_amount != null && advanceRate
      ? (Number(suggestion.suggested_amount) * 12 * 100) / advanceRate
      : null;

  const handleReductionSubmit = () => {
    const parsed = Number(reductionRate);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      updateProfile({ advance_rate: parsed });
      setReductionOpen(false);
      setReductionRate("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        {isAdvisor && (
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              הוסף מקדמה
            </Button>
            <Button variant="outline" size="sm" onClick={() => setReductionOpen(true)}>
              <TrendingDown size={14} className="mr-1" />
              בקש הפחתה
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditRateOpen(true)}>
              <Edit2 size={14} className="mr-1" />
              עריכת שיעור
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {(["pending", "paid", "partial", "overdue"] as AdvancePaymentStatus[]).map((s) => {
              const labels: Record<AdvancePaymentStatus, string> = {
                pending: "ממתין",
                paid: "שולם",
                partial: "חלקי",
                overdue: "באיחור",
              };
              const active = statusFilter.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setStatusFilter((prev) =>
                      active ? prev.filter((x) => x !== s) : [...prev, s],
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>
          <div className="w-28">
            <Select
              value={String(year)}
              onChange={(e) => setYear(Number(e.target.value))}
              options={YEAR_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatsCard
          title="שיעור מקדמה"
          value={advanceRate != null ? `${advanceRate}%` : "—"}
          icon={Percent}
          variant="purple"
        />
        <StatsCard
          title="הכנסה שנתית משוערת"
          value={annualIncome != null ? fmtCurrency(Math.round(annualIncome)) : "—"}
          icon={TrendingUp}
          variant="blue"
        />
        <StatsCard
          title="מס שנתי צפוי"
          value={fmtCurrency(totalExpected)}
          icon={Banknote}
          variant="blue"
          description="סכום מקדמות מתוכנן"
        />
        <StatsCard
          title="שולם"
          value={fmtCurrency(totalPaid)}
          icon={CheckCircle}
          variant="green"
        />
        <StatsCard
          title="יתרה"
          value={fmtCurrency(Math.abs(balance))}
          icon={AlertCircle}
          variant={balance > 0 ? "orange" : balance < 0 ? "blue" : "green"}
          description={balance > 0 ? "נותר לתשלום" : balance < 0 ? "שולם ביתר" : "הכל שולם"}
        />
      </div>

      {/* KPI Cards */}
      <AdvancePaymentsKPICards clientId={clientId} year={year} />

      {/* Monthly Chart */}
      <AdvancePaymentsChart clientId={clientId} year={year} />

      {/* Table */}
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

      {/* Add payment modal */}
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

      {/* Edit rate modal */}
      {isAdvisor && (
        <Modal open={editRateOpen} title="עריכת פרטי מס" onClose={() => setEditRateOpen(false)} footer={null}>
          <TaxProfileForm
            profile={profile}
            onSave={(data) => { updateProfile(data); setEditRateOpen(false); }}
            onCancel={() => setEditRateOpen(false)}
            isSaving={isUpdatingProfile}
          />
        </Modal>
      )}

      {/* Request reduction modal */}
      {isAdvisor && (
        <Modal
          open={reductionOpen}
          title="בקשת הפחתת מקדמה"
          onClose={() => setReductionOpen(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReductionOpen(false)}>ביטול</Button>
              <Button variant="primary" isLoading={isUpdatingProfile} onClick={handleReductionSubmit}>
                אשר הפחתה
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              שיעור נוכחי: <strong>{advanceRate != null ? `${advanceRate}%` : "לא הוגדר"}</strong>
            </p>
            <Input
              label="שיעור מקדמה חדש (%)"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={reductionRate}
              onChange={(e) => setReductionRate(e.target.value)}
              placeholder="לדוגמה: 2.5"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
