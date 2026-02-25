import { useState } from "react";
import { format } from "date-fns";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
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
      const { data } = await api.get(ENDPOINTS.clientsExport, { responseType: "blob" });
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
      const formData = new FormData();
      formData.append("file", file);
      await api.post(ENDPOINTS.clientsImport, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("ייבוא לקוחות הושלם בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בייבוא לקוחות");
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const { data } = await api.get(ENDPOINTS.clientsTemplate, { responseType: "blob" });
      downloadBlob(data, "clients_template.xlsx");
      toast.success("תבנית הורדה בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בהורדת תבנית");
    }
  };

  return { importing, exporting, handleExport, handleImport, handleDownloadTemplate };
};