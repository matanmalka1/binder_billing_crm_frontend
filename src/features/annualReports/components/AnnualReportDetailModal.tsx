import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { DescriptionList } from "../../../components/ui/DescriptionList";
import { getReportStageLabel } from "../../../api/annualReports.utils";
import { useAnnualReportDetail } from "../hooks/useAnnualReportDetail";
import { AnnualReportDetailForm } from "./AnnualReportDetailForm";
import { formatDate } from "../../../utils/utils";

interface Props {
  open: boolean;
  reportId: number | null;
  clientName: string;
  taxYear: number;
  onClose: () => void;
}

export const AnnualReportDetailModal: React.FC<Props> = ({
  open,
  reportId,
  clientName,
  taxYear,
  onClose,
}) => {
  const { detail, isLoading, updateDetail, isUpdating } = useAnnualReportDetail(
    open ? reportId : null,
  );

  return (
    <Modal
      open={open}
      title={`דוח שנתי ${taxYear} — ${clientName}`}
      onClose={onClose}
      footer={
        <Button type="button" variant="outline" onClick={onClose}>
          סגור
        </Button>
      }
    >
      {isLoading && <p className="text-sm text-gray-500 py-4">טוען פרטי דוח...</p>}

      {detail && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">
              {detail.stage ? getReportStageLabel(detail.stage) : "שלב לא ידוע"}
            </Badge>
            <Badge variant="neutral">שנת מס {detail.tax_year}</Badge>
            {detail.due_date && (
              <Badge variant="warning">מועד: {formatDate(detail.due_date)}</Badge>
            )}
          </div>

          <DescriptionList
            columns={2}
            items={[
              { label: "סכום החזר מס", value: detail.tax_refund_amount != null ? `₪${detail.tax_refund_amount.toLocaleString("he-IL")}` : "—" },
              { label: "סכום לתשלום", value: detail.tax_due_amount != null ? `₪${detail.tax_due_amount.toLocaleString("he-IL")}` : "—" },
              { label: "תאריך אישור לקוח", value: detail.client_approved_at ? formatDate(detail.client_approved_at) : "—" },
              { label: "הערות פנימיות", value: detail.internal_notes ?? "—", fullWidth: true },
            ]}
          />

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">עדכון פרטים</h4>
            <AnnualReportDetailForm
              detail={detail}
              onSave={updateDetail}
              isSaving={isUpdating}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
