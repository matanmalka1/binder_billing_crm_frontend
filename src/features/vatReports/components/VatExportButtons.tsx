import { useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";
import { vatReportsApi } from "../api";
import { showErrorToast } from "../../../utils/utils";
import type { VatExportButtonsProps } from "../types";
import { FILE_FORMAT_COLORS } from "../../../utils/chartColors";

export const VatExportButtons: React.FC<VatExportButtonsProps> = ({ clientId, period }) => {
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const handleExport = async (format: "excel" | "pdf") => {
    const year = Number(period.split("-")[0]);
    const setLoad = format === "excel" ? setLoadingExcel : setLoadingPdf;
    setLoad(true);
    try {
      await vatReportsApi.exportBusinessVat(clientId, format, year);
    } catch (err) {
      showErrorToast(err, "ייצוא נכשל, נסה שוב");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="flex items-center gap-2" dir="rtl">
      <Button variant="ghost" size="sm" isLoading={loadingExcel} onClick={() => handleExport("excel")}>
        <FileSpreadsheet className={`h-4 w-4 ${FILE_FORMAT_COLORS.excel}`} />
        Excel
      </Button>
      <Button variant="ghost" size="sm" isLoading={loadingPdf} onClick={() => handleExport("pdf")}>
        <FileText className={`h-4 w-4 ${FILE_FORMAT_COLORS.pdf}`} />
        PDF
      </Button>
    </div>
  );
};

VatExportButtons.displayName = "VatExportButtons";
