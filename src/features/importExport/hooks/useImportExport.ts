import { useState } from "react";
import { toast } from "../../../utils/toast";
import { getErrorMessage } from "../../../utils/utils";

type EntityType = "clients" | "charges" | "binders";

export const useImportExport = (entityType: EntityType) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const entityLabels: Record<EntityType, string> = {
    clients: "לקוחות",
    charges: "חיובים",
    binders: "קלסרים",
  };

  const entityLabel = entityLabels[entityType];

  const handleExport = async () => {
    setExporting(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/${entityType}/export`, {
      //   responseType: 'blob'
      // });
      // const blob = new Blob([response.data]);
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${entityType}_export_${new Date().toISOString()}.xlsx`;
      // link.click();

      toast.success(`ייצוא ${entityLabel} הושלם`);
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייצוא"));
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

      // TODO: Replace with actual API call
      // await api.post(`/${entityType}/import`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      toast.success(`ייבוא ${entityLabel} הושלם`);
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייבוא"));
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    // TODO: Download template
    toast.info("תבנית תורד בקרוב");
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
