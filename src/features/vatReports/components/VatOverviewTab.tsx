import { useState } from "react";
import { Send, RotateCcw, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import type { VatWorkItemResponse } from "../../../api/vatReports.api";
import { canMarkReadyForReview, canSendBack, canFile } from "../utils";
import { useRole } from "../../../hooks/useRole";
import { vatReportsApi } from "../../../api/vatReports.api";
import { toast } from "../../../utils/toast";
import { showErrorToast } from "../../../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "../../../lib/queryKeys";
import { VatCalculationCard } from "./VatCalculationCard";
import { VatSendBackForm } from "./VatSendBackForm";

interface VatOverviewTabProps {
  workItem: VatWorkItemResponse;
}

export const VatOverviewTab: React.FC<VatOverviewTabProps> = ({ workItem }) => {
  const { isAdvisor } = useRole();
  const queryClient = useQueryClient();
  const [showSendBackForm, setShowSendBackForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.detail(workItem.id) });
    await queryClient.invalidateQueries({ queryKey: QK.tax.vatWorkItems.all });
  };

  const run = async (fn: () => Promise<unknown>, successMsg: string, errMsg: string) => {
    setLoading(true);
    try { await fn(); toast.success(successMsg); await invalidate(); }
    catch (err) { showErrorToast(err, errMsg); }
    finally { setLoading(false); }
  };

  const handleExport = async (format: "excel" | "pdf") => {
    const year = Number(workItem.period.split("-")[0]);
    const setLoad = format === "excel" ? setLoadingExcel : setLoadingPdf;
    setLoad(true);
    try { await vatReportsApi.exportClientVat(workItem.client_id, format, year); }
    catch { toast.error("ייצוא נכשל, נסה שוב"); }
    finally { setLoad(false); }
  };

  const hasActions = canMarkReadyForReview(workItem.status) || (isAdvisor && canFile(workItem.status)) || (isAdvisor && canSendBack(workItem.status));

  return (
    <div className="space-y-4" dir="rtl">
      <VatCalculationCard workItem={workItem} />

      {hasActions && (
        <Card title="פעולות">
          <div className="flex flex-wrap gap-2">
            {canMarkReadyForReview(workItem.status) && (
              <Button variant="primary" size="md" isLoading={loading} onClick={() =>
                run(() => vatReportsApi.markReadyForReview(workItem.id), "התיק נשלח לבדיקה", "שגיאה בשינוי סטטוס")
              }>
                <Send className="h-4 w-4" />
                סיום הקלדה — שלח לבדיקה
              </Button>
            )}
            {isAdvisor && canFile(workItem.status) && (
              <Button variant="primary" size="md" isLoading={loading} onClick={() =>
                run(() => vatReportsApi.fileVatReturn(workItem.id, { filing_method: "online" }), 'התיק הוגש בהצלחה', "שגיאה בהגשה")
              }>
                <Send className="h-4 w-4" />
                הגש מע"מ
              </Button>
            )}
            {isAdvisor && canSendBack(workItem.status) && !showSendBackForm && (
              <Button variant="outline" size="md" onClick={() => setShowSendBackForm(true)}
                className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100">
                <RotateCcw className="h-4 w-4" />
                החזר לתיקון
              </Button>
            )}
          </div>
          {showSendBackForm && (
            <div className="mt-4">
              <VatSendBackForm
                loading={loading}
                onCancel={() => setShowSendBackForm(false)}
                onSubmit={async (note) => {
                  await run(() => vatReportsApi.sendBack(workItem.id, note), "התיק הוחזר לתיקון", "שגיאה בהחזרה לתיקון");
                  setShowSendBackForm(false);
                }}
              />
            </div>
          )}
        </Card>
      )}

      {isAdvisor && (
        <Card title="ייצוא">
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" isLoading={loadingExcel} onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              ייצוא Excel
            </Button>
            <Button variant="secondary" size="sm" isLoading={loadingPdf} onClick={() => handleExport("pdf")}>
              <FileText className="h-4 w-4 text-red-500" />
              ייצוא PDF
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

VatOverviewTab.displayName = "VatOverviewTab";
