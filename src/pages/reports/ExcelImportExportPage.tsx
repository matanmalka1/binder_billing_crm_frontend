import { PageHeader } from "../../components/layout/PageHeader";
import { ExportCard } from "../../features/importExport/components/ExportCard";
import { ImportCard } from "../../features/importExport/components/ImportCard";
import { ImportExportInstructions } from "../../features/importExport/components/ImportExportInstructions";
import { useImportExport } from "../../features/importExport/hooks/useImportExport";

export const ExcelImportExportPage: React.FC = () => {
  const {
    importing,
    exporting,
    entityLabel,
    handleExport,
    handleImport,
    handleDownloadTemplate,
  } = useImportExport();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ייבוא וייצוא ${entityLabel}`}
        description="ייבוא וייצוא נתונים בפורמט Excel"
        variant="gradient"
      />

      <ExportCard
        entityLabel={entityLabel}
        exporting={exporting}
        onExport={handleExport}
      />

      <ImportCard
        entityLabel={entityLabel}
        importing={importing}
        onFileSelect={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <ImportExportInstructions />
    </div>
  );
};
