import type { AnnualReportFull, ClientTypeForReport } from "../../api";
import { DefinitionList } from "../../../../components/ui/DefinitionList";

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
  <DefinitionList
    columns={2}
    items={[
      { label: "שנת מס", value: report.tax_year },
      { label: "סוג לקוח", value: CLIENT_TYPE_LABELS[report.client_type] ?? report.client_type },
      { label: "מזהה דוח", value: report.form_type },
      { label: "מספר אסמכתא", value: report.ita_reference },
      { label: "הוגש בתאריך", value: formatDate(report.submitted_at) },
      { label: "מועד הגשה", value: formatDate(report.filing_deadline) },
    ]}
  />
);

ReportMetaGrid.displayName = "ReportMetaGrid";
