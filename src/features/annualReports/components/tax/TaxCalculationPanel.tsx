import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { annualReportTaxApi } from "../../api";
import { annualReportsApi, annualReportsQK } from "../../api";
import { cn } from "../../../../utils/utils";
import { TaxBracketsTable } from "./TaxBracketsTable";
import { TaxCalculatorInputs } from "./TaxCalculatorInputs";

interface Props { reportId: number; }

const fmt = (n: string | number) =>
  Number(n).toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const Row: React.FC<{ label: string; value: string; className?: string; muted?: boolean }> = ({
  label, value, className, muted,
}) => (
  <div className="flex justify-between py-2 text-sm">
    <dt className={cn("text-gray-500", muted && "text-gray-400 text-xs")}>{label}</dt>
    <dd className={cn("font-medium text-gray-900", className)}>{value}</dd>
  </div>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="border-b border-gray-100 bg-gray-50 px-5 py-3">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h4>
    </div>
    <dl className="divide-y divide-gray-50 px-5">{children}</dl>
  </div>
);

export const TaxCalculationPanel: React.FC<Props> = ({ reportId }) => {
  const queryClient = useQueryClient();
  const [creditPoints, setCreditPoints] = useState("");
  const [pension, setPension] = useState("");
  const [otherCredits, setOtherCredits] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: annualReportsQK.taxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
    enabled: !!reportId,
  });

  const detailQ = useQuery({
    queryKey: annualReportsQK.details(reportId),
    queryFn: () => annualReportsApi.getReportDetails(reportId),
    enabled: !!reportId,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof annualReportsApi.patchReportDetails>[1]) =>
      annualReportsApi.patchReportDetails(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: annualReportsQK.taxCalc(reportId) });
      queryClient.invalidateQueries({ queryKey: annualReportsQK.details(reportId) });
    },
  });

  const handleEditInit = () => {
    const d = detailQ.data;
    if (d) {
      setCreditPoints(d.credit_points != null ? String(d.credit_points) : "");
      setPension(d.pension_contribution != null ? String(d.pension_contribution) : "");
      setOtherCredits(d.other_credits != null ? String(d.other_credits) : "");
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      credit_points: creditPoints !== "" ? Number(creditPoints) : undefined,
      pension_contribution: pension !== "" ? pension : undefined,
      other_credits: otherCredits !== "" ? otherCredits : undefined,
    });
  };

  if (isLoading || detailQ.isLoading)
    return <p className="py-8 text-center text-sm text-gray-400">מחשב מס...</p>;
  if (isError || !data)
    return <p className="py-8 text-center text-sm text-red-500">שגיאה בטעינת חישוב מס</p>;

  const totalLiability = data.total_liability == null ? null : Number(data.total_liability);
  const liabilityColor = totalLiability == null ? ""
    : totalLiability > 0 ? "text-red-600" : "text-green-600";
  const totalCredits =
    Number(data.credit_points_value) + Number(data.donation_credit) + Number(data.other_credits ?? 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">מס לפני זיכויים</p>
          <p className="text-xl font-bold text-red-700">{fmt(data.tax_before_credits)}</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">זיכויי מס</p>
          <p className="text-xl font-bold text-blue-700">{fmt(totalCredits)}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">מס סופי לתשלום</p>
          <p className="text-xl font-bold text-green-700">{fmt(data.tax_after_credits)}</p>
        </div>
      </div>

      <TaxCalculatorInputs
        creditPoints={creditPoints} pension={pension} otherCredits={otherCredits}
        onCreditPointsChange={setCreditPoints} onPensionChange={setPension} onOtherCreditsChange={setOtherCredits}
        onSave={handleSave} onEditInit={handleEditInit} isSaving={updateMutation.isPending}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="חישוב מס הכנסה">
          <Row label="הכנסה חייבת" value={fmt(data.taxable_income)} />
          <Row label="ניכוי פנסיה" value={fmt(data.pension_deduction)} muted />
          <Row label="מס לפני זיכויים" value={fmt(data.tax_before_credits)} />
          <Row label="שווי נקודות זיכוי" value={fmt(data.credit_points_value)} muted />
          {Number(data.donation_credit) > 0 && <Row label="זיכוי תרומות (סע׳ 46)" value={fmt(data.donation_credit)} muted />}
          <Row label="שיעור אפקטיבי" value={`${(data.effective_rate * 100).toFixed(2)}%`} muted />
          <Row label="מס לתשלום" value={fmt(data.tax_after_credits)} className="text-green-700 font-semibold" />
        </SectionCard>
        <SectionCard title="ביטוח לאומי">
          <Row label="הכנסה מבוטחת" value={fmt(data.net_profit)} />
          <Row label="שיעור עד תקרה (5.97%)" value={fmt(data.national_insurance.base_amount)} muted />
          <Row label="שיעור מעל תקרה (17.83%)" value={fmt(data.national_insurance.high_amount)} muted />
          <Row label='סה"כ ביטוח לאומי' value={fmt(data.national_insurance.total)} className="font-semibold" />
        </SectionCard>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-1 shadow-sm">
        <dl className="divide-y divide-gray-100">
          <Row label="רווח נקי" value={fmt(data.net_profit)} />
          {totalLiability !== null && (
            <Row label='חבות כוללת (מס + בל + מע"מ − מקדמות)' value={fmt(totalLiability)} className={liabilityColor} />
          )}
        </dl>
      </div>

      <TaxBracketsTable brackets={data.brackets} />
    </div>
  );
};

TaxCalculationPanel.displayName = "TaxCalculationPanel";
