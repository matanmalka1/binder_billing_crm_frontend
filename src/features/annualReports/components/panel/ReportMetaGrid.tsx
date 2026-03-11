import type {
  AnnualReportFull,
  ClientTypeForReport,
} from "../../../../api/annualReport.api";
import { DrawerField } from "../../../../components/ui/DetailDrawer";

interface ReportMetaGridProps {
  report: AnnualReportFull;
}

const CLIENT_TYPE_LABELS: Record<ClientTypeForReport, string> = {
  individual: "יחיד",
  self_employed: "עוסק",
  corporation: "חברה",
  partnership: "שותפות",
};

const formatDate = (value: string | null): string => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("he-IL");
};

export const ReportMetaGrid = ({ report }: ReportMetaGridProps) => (
  <div className="grid grid-cols-2 gap-x-6" dir="rtl">
    <DrawerField label="שנת מס" value={report.tax_year} />
    <DrawerField
      label="סוג לקוח"
      value={CLIENT_TYPE_LABELS[report.client_type] ?? report.client_type}
    />
    <DrawerField label="מזהה דוח" value={report.form_type} />
    <DrawerField label="מספר אסמכתא" value={report.ita_reference} />
    <DrawerField label="הוגש בתאריך" value={formatDate(report.submitted_at)} />
    <DrawerField label="מועד הגשה" value={formatDate(report.filing_deadline)} />
  </div>
);

ReportMetaGrid.displayName = "ReportMetaGrid";
