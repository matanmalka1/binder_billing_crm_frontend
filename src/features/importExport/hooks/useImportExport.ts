import { useState } from "react";
import { format } from "date-fns";
import { api } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

export const useImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const entityLabel = "לקוחות";

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get(ENDPOINTS.clientsExport, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clients_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`ייצוא ${entityLabel} הושלם בהצלחה`);
    } catch (error) {
      showErrorToast(error, `שגיאה בייצוא ${entityLabel}`);
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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`ייבוא ${entityLabel} הושלם בהצלחה`);
    } catch (error) {
      showErrorToast(error, `שגיאה בייבוא ${entityLabel}`);
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get(ENDPOINTS.clientsTemplate, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "clients_template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("תבנית הורדה בהצלחה");
    } catch (error) {
      showErrorToast(error, "שגיאה בהורדת תבנית");
    }
  };

  return {
    importing,
    exporting,
    entityLabel,
    handleExport,
    handleImport,
    handleDownloadTemplate,
  };
};
