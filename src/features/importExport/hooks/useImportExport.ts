import { useState } from "react";
import { format } from "date-fns";
import { api } from "../../../api/client";
import { showErrorToast } from "../../../utils/utils";
import { toast } from "../../../utils/toast";

type EntityType = "clients";

export const useImportExport = (entityType: EntityType = "clients") => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const entityLabels: Record<EntityType, string> = {
    clients: "לקוחות",
  };

  const entityLabel = entityLabels[entityType];

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get(`/${entityType}/export`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${entityType}_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
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

      await api.post(`/${entityType}/import`, formData, {
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
      const response = await api.get(`/${entityType}/template`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${entityType}_template.xlsx`;
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
