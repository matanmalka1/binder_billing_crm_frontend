import { useState } from "react";
import { format } from "date-fns";
import { importExportApi } from "../api";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

const downloadBlob = (data: unknown, filename: string) => {
  const blob = new Blob([data as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const useImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await importExportApi.exportClients();
      downloadBlob(data, `clients_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
      toast.success("ייצוא לקוחות הושלם בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בייצוא לקוחות");
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("יש לבחור קובץ Excel (.xlsx או .xls)");
      return;
    }
    setImporting(true);
    try {
      await importExportApi.importClients(file);
      toast.success("ייבוא לקוחות הושלם בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בייבוא לקוחות");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await importExportApi.downloadTemplate();
      downloadBlob(data, "clients_template.xlsx");
      toast.success("תבנית הורדה בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בהורדת תבנית");
    }
  };

  return { importing, exporting, handleExport, handleImport, handleDownloadTemplate };
};