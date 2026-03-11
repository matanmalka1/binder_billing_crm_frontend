import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { annualReportTaxApi } from "../../../../api/annualReport.tax.api";
import { annualReportsApi } from "../../../../api/annualReport.api";
import { QK } from "../../../../lib/queryKeys";
import { cn } from "../../../../utils/utils";
import { TaxBracketsTable } from "./TaxBracketsTable";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";

interface Props {
  reportId: number;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { style: "currency", currency: "ILS", maximumFractionDigits: 0 });

const Row: React.FC<{ label: string; value: string; className?: string }> = ({
  label,
  value,
  className,
}) => (
  <div className="flex justify-between py-1.5 text-sm">
    <dt className="text-gray-500">{label}</dt>
    <dd className={cn("font-medium text-gray-900", className)}>{value}</dd>
  </div>
);

export const TaxCalculationPanel: React.FC<Props> = ({ reportId }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: QK.tax.annualReportTaxCalc(reportId),
    queryFn: () => annualReportTaxApi.getTaxCalculation(reportId),
  });

  const detailQ = useQuery({
    queryKey: QK.tax.annualReports.detail(reportId),
    queryFn: () => annualReportsApi.getReportDetails(reportId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Parameters<typeof annualReportsApi.patchReportDetails>[1]) =>
      annualReportsApi.patchReportDetails(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReportTaxCalc(reportId) });
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.detail(reportId) });
    },
  });

  const d = detailQ.data;

  const [creditPoints, setCreditPoints] = useState("");
  const [pension, setPension] = useState("");
  const [otherCredits, setOtherCredits] = useState("");
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    updateMutation.mutate({
      credit_points: creditPoints !== "" ? Number(creditPoints) : undefined,
      pension_contribution: pension !== "" ? Number(pension) : undefined,
      other_credits: otherCredits !== "" ? Number(otherCredits) : undefined,
    });
    setEditMode(false);
  };

  const handleEdit = () => {
    if (d) {
      setCreditPoints(d.credit_points != null ? String(d.credit_points) : "");
      setPension(d.pension_contribution != null ? String(d.pension_contribution) : "");
      setOtherCredits(d.other_credits != null ? String(d.other_credits) : "");
    }
    setEditMode(true);
  };

  if (isLoading || detailQ.isLoading)
    return <p className="text-sm text-gray-400">מחשב מס...</p>;
  if (isError || !data)
    return <p className="text-sm text-red-500">שגיאה בטעינת חישוב מס</p>;

  const liabilityColor =
    data.total_liability === null
      ? ""
      : data.total_liability > 0
        ? "text-red-600"
        : "text-green-600";

  return (
    <div className="space-y-4">
      {/* Editable calculator inputs */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-amber-700 font-medium">
            💡 המחשבון מציג שיעורי מס עפ"י מדרגות מס לעסק יחיד/שותפות.
          </p>
          {!editMode ? (
            <Button variant="ghost" size="sm" onClick={handleEdit} className="text-xs h-7">
              עריכה
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                isLoading={updateMutation.isPending}
                className="h-7 text-xs"
              >
                שמור
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(false)}
                className="h-7 text-xs"
              >
                ביטול
              </Button>
            </div>
          )}
        </div>
        {editMode && (
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="נקודות זיכוי"
              type="number"
              step="0.25"
              value={creditPoints}
              onChange={(e) => setCreditPoints(e.target.value)}
            />
            <Input
              label={'הפקדות פנסיה/קה"ש (₪)'}
              type="number"
              value={pension}
              onChange={(e) => setPension(e.target.value)}
            />
            <Input
              label="זיכויים אחרים (₪)"
              type="number"
              value={otherCredits}
              onChange={(e) => setOtherCredits(e.target.value)}
              className="col-span-2"
            />
          </div>
        )}
      </div>

      {/* Tax summary */}
      <dl className="divide-y divide-gray-100">
        <Row label="הכנסה חייבת" value={fmt(data.taxable_income)} />
        <Row label="ניכוי פנסיה" value={fmt(data.pension_deduction)} />
        <Row label="מס לפני זיכויים" value={fmt(data.tax_before_credits)} />
        <Row label="שווי נקודות זיכוי" value={fmt(data.credit_points_value)} />
        {data.donation_credit > 0 && (
          <Row label="זיכוי תרומות (סע׳ 46)" value={fmt(data.donation_credit)} />
        )}
        <Row label="מס לתשלום" value={fmt(data.tax_after_credits)} />
        <Row
          label="שיעור מס אפקטיבי"
          value={`${(data.effective_rate * 100).toFixed(2)}%`}
        />
      </dl>

      {/* National insurance */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          ביטוח לאומי — פירוט
        </p>
        <dl className="divide-y divide-gray-100">
          <Row label="הכנסה מבוטחת" value={fmt(data.net_profit)} />
          <Row label="שיעור עד תקרה (5.97%)" value={fmt(data.national_insurance.base_amount)} />
          <Row
            label="שיעור מעל תקרה (17.83%)"
            value={fmt(data.national_insurance.high_amount)}
          />
          <Row
            label='סה"כ ביטוח לאומי'
            value={fmt(data.national_insurance.total)}
            className="font-semibold"
          />
        </dl>
      </div>

      {/* Net profit + total liability */}
      <dl className="divide-y divide-gray-100 rounded-md border border-gray-200 bg-gray-50 px-3">
        <Row label="רווח נקי" value={fmt(data.net_profit)} />
        {data.total_liability !== null && (
          <Row
            label='חבות כוללת (מס + בל + מע"מ − מקדמות)'
            value={fmt(data.total_liability)}
            className={liabilityColor}
          />
        )}
      </dl>

      {/* Tax summary cards (3 boxes) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-green-50 p-3 text-center">
          <p className="text-xs text-gray-500">מס סופי לתשלום</p>
          <p className="mt-1 text-lg font-bold text-green-700">{fmt(data.tax_after_credits)}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-xs text-gray-500">זיכויי מס</p>
          <p className="mt-1 text-lg font-bold text-blue-700">
            {fmt(-(data.credit_points_value + data.donation_credit + (data.other_credits ?? 0)))}
          </p>
        </div>
        <div className="rounded-lg bg-red-50 p-3 text-center">
          <p className="text-xs text-gray-500">מס לפני זיכויים</p>
          <p className="mt-1 text-lg font-bold text-red-700">{fmt(data.tax_before_credits)}</p>
        </div>
      </div>

      {/* Tax brackets */}
      <TaxBracketsTable brackets={data.brackets} />
    </div>
  );
};
