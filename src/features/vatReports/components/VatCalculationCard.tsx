import { CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { cn } from "../../../utils/utils";
import { formatVatAmount } from "../utils";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";

const STATUS_STEPS = [
  { key: "pending_materials", label: "ממתין לחומרים" },
  { key: "material_received", label: "חומרים התקבלו" },
  { key: "data_entry_in_progress", label: "הקלדה" },
  { key: "ready_for_review", label: "לבדיקה" },
  { key: "filed", label: "הוגש" },
] as const;

interface VatCalculationCardProps {
  workItem: VatWorkItemResponse;
}

export const VatCalculationCard: React.FC<VatCalculationCardProps> = ({ workItem }) => {
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === workItem.status);
  const netVariant = workItem.net_vat > 0 ? "green" : workItem.net_vat < 0 ? "red" : "neutral";
  const netLabel = netVariant === "green" ? "לתשלום" : netVariant === "red" ? "לזיכוי" : "מאוזן";

  return (
    <Card variant="elevated" className="overflow-visible">
      {/* Workflow stepper */}
      <div className="flex items-center gap-0 pb-5 border-b border-gray-100" dir="rtl">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentStepIdx;
          const active = idx === currentStepIdx;
          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className={cn(
                "flex flex-col items-center gap-1.5 px-1 text-center",
                active ? "text-primary-700" : done ? "text-emerald-600" : "text-gray-300",
              )}>
                {done ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold border-2",
                    active
                      ? "bg-primary-600 border-primary-600 text-white"
                      : "border-gray-200 text-gray-300",
                  )}>
                    {idx + 1}
                  </div>
                )}
                <span className={cn("text-xs font-medium leading-tight whitespace-nowrap", active && "font-semibold")}>{step.label}</span>
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div className={cn("h-0.5 flex-1 mx-1 rounded", idx < currentStepIdx ? "bg-emerald-300" : "bg-gray-100")} />
              )}
            </div>
          );
        })}
      </div>

      {/* VAT equation */}
      <div className="flex items-center justify-center gap-4 pt-5 flex-wrap" dir="rtl">
        <div className="flex flex-col items-center gap-1 min-w-[120px] text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">מע"מ עסקאות</span>
          <span className="font-mono text-2xl font-bold text-blue-700 tabular-nums">{formatVatAmount(workItem.total_output_vat)}</span>
        </div>

        <span className="text-3xl font-light text-gray-200 select-none">−</span>

        <div className="flex flex-col items-center gap-1 min-w-[120px] text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">מע"מ תשומות</span>
          <span className="font-mono text-2xl font-bold text-orange-600 tabular-nums">{formatVatAmount(workItem.total_input_vat)}</span>
        </div>

        <span className="text-3xl font-light text-gray-200 select-none">=</span>

        <div className={cn(
          "flex flex-col items-center gap-1.5 rounded-2xl border-2 px-6 py-3 min-w-[150px] text-center",
          netVariant === "green" ? "bg-emerald-50 border-emerald-300" : netVariant === "red" ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200",
        )}>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">מע"מ נטו</span>
          <span className={cn(
            "font-mono text-3xl font-bold tabular-nums",
            netVariant === "green" ? "text-emerald-700" : netVariant === "red" ? "text-red-700" : "text-gray-700",
          )}>{formatVatAmount(workItem.net_vat)}</span>
          <span className={cn(
            "rounded-full px-3 py-0.5 text-xs font-semibold",
            netVariant === "green" ? "bg-emerald-100 text-emerald-700" : netVariant === "red" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600",
          )}>{netLabel}</span>
        </div>

        {workItem.final_vat_amount !== workItem.net_vat && (
          <>
            <div className="border-r border-gray-200 self-stretch hidden sm:block" />
            <div className="flex flex-col items-center gap-1 min-w-[120px] text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">סכום סופי</span>
              <span className="font-mono text-2xl font-bold text-gray-700 tabular-nums">{formatVatAmount(workItem.final_vat_amount)}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

VatCalculationCard.displayName = "VatCalculationCard";
