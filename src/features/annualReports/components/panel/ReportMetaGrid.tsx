import type { AnnualReportFull, ClientTypeForReport } from "../../api";
import { DefinitionList } from "../../../../components/ui/layout/DefinitionList";

interface ReportMetaGridProps {
  report: AnnualReportFull;
}

const CLIENT_TYPE_LABELS: Record<ClientTypeForReport, string> = {
  individual: "יחיד (1301)",
  self_employed: "עצמאי (1301)",
  corporation: "חברה (1214)",
  public_institution: 'מלכ"ר / מוסד ציבורי (1215)',
  partnership: "שותף בשותפות (1301)",
  control_holder: "בעל שליטה (1301)",
  exempt_dealer: "עוסק פטור (1301)",
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
      { label: "טופס", value: report.form_type ? `טופס ${report.form_type}` : "—" },
      { label: "מספר אסמכתא", value: report.ita_reference },
      { label: "הוגש בתאריך", value: formatDate(report.submitted_at) },
      { label: "מועד הגשה", value: formatDate(report.filing_deadline) },
    ]}
  />
);

ReportMetaGrid.displayName = "ReportMetaGrid";
