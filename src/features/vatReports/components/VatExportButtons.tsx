import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { vatReportsApi } from "../api";
import { buildYearOptions, showErrorToast } from "../../../utils/utils";
import type { VatExportButtonsProps } from "../types";
import { FILE_FORMAT_COLORS } from "../../../utils/chartColors";

export const VatExportButtons: React.FC<VatExportButtonsProps> = ({ clientId, period, showYearSelector = false }) => {
  const [selectedYear, setSelectedYear] = useState(() =>
    period ? Number(period.split("-")[0]) : new Date().getFullYear()
  );
  const [loadingType, setLoadingType] = useState<"excel" | "pdf" | null>(null);

  const year = showYearSelector ? selectedYear : Number(period?.split("-")[0] ?? selectedYear);
  const yearOptions = useMemo(() => 
    buildYearOptions().map((o) => ({ value: o.value, label: o.value })), 
  []);

  const handleExport = async (format: "excel" | "pdf") => {
    setLoadingType(format);
    try {
      await vatReportsApi.exportClientVat(clientId, format, year);
    } catch (err) {
      showErrorToast(err, "ייצוא נכשל, נסה שוב");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex items-center gap-2" dir="rtl">
      {showYearSelector && (
        <Select
          value={String(selectedYear)}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          options={yearOptions}
          className="w-28 py-1.5"
        />
      )}
      <Button variant="ghost" size="sm" isLoading={loadingType === "excel"} onClick={() => handleExport("excel")}>
        <FileSpreadsheet className={`h-4 w-4 ${FILE_FORMAT_COLORS.excel}`} />
        Excel
      </Button>
      <Button variant="ghost" size="sm" isLoading={loadingType === "pdf"} onClick={() => handleExport("pdf")}>
        <FileText className={`h-4 w-4 ${FILE_FORMAT_COLORS.pdf}`} />
        PDF
      </Button>
    </div>
  );
};

VatExportButtons.displayName = "VatExportButtons";
