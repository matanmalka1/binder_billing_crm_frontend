import { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/layout/PageHeader";
import { toast } from "../../utils/toast";
import { getErrorMessage } from "../../utils/utils";

interface ExcelImportExportProps {
  entityType: "clients" | "charges" | "binders";
}

export const ExcelImportExportPage: React.FC<ExcelImportExportProps> = ({
  entityType,
}) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const entityLabels = {
    clients: "לקוחות",
    charges: "חיובים",
    binders: "קלסרים",
  };

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
      
      toast.success(`ייצוא ${entityLabels[entityType]} הושלם`);
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייצוא"));
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // TODO: Replace with actual API call
      // await api.post(`/${entityType}/import`, formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      toast.success(`ייבוא ${entityLabels[entityType]} הושלם`);
    } catch (error) {
      toast.error(getErrorMessage(error, "שגיאה בייבוא"));
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        toast.error("יש לבחור קובץ Excel (.xlsx או .xls)");
        return;
      }
      handleImport(file);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`ייבוא וייצוא ${entityLabels[entityType]}`}
        description="ייבוא וייצוא נתונים בפורמט Excel"
        variant="gradient"
      />

      {/* Export Section */}
      <Card
        title="ייצוא לאקסל"
        variant="elevated"
        className="bg-gradient-to-br from-green-50 to-emerald-50"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            ייצא את כל נתוני {entityLabels[entityType]} לקובץ Excel מעוצב
          </p>
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">הקובץ יכלול:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>כל השדות הרלוונטיים</li>
                <li>עיצוב וצבעים לקריאות מיטבית</li>
                <li>כותרות עם סינון אוטומטי</li>
              </ul>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleExport}
            isLoading={exporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            ייצוא ל-Excel
          </Button>
        </div>
      </Card>

      {/* Import Section */}
      <Card
        title="ייבוא מאקסל"
        variant="elevated"
        className="bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            העלה קובץ Excel לייבוא נתוני {entityLabels[entityType]} חדשים או עדכון קיימים
          </p>

          <div className="flex items-start gap-3 rounded-lg bg-orange-50 border border-orange-200 p-4">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-900">
              <p className="font-semibold mb-1">דרישות הקובץ:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>פורמט: .xlsx או .xls</li>
                <li>שורת כותרות חובה</li>
                <li>שמות עמודות צריכים להתאים למודל</li>
                <li>תאריכים בפורמט: YYYY-MM-DD</li>
              </ul>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={importing}
            />
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              isLoading={importing}
              disabled={importing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {importing ? "מייבא..." : "בחר קובץ לייבוא"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              או גרור קובץ לכאן
            </p>
          </div>

          {/* Download Template */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  תבנית לייבוא
                </p>
                <p className="text-xs text-gray-600">
                  הורד קובץ דוגמה עם המבנה הנכון
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  // TODO: Download template
                  toast.info("תבנית תורד בקרוב");
                }}
              >
                הורד תבנית
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card title="הוראות שימוש">
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">ייצוא:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>לחץ על כפתור "ייצוא ל-Excel"</li>
              <li>הקובץ יורד אוטומטית למחשב</li>
              <li>פתח את הקובץ ב-Excel או Google Sheets</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">ייבוא:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>הכן קובץ Excel עם הנתונים</li>
              <li>ודא שהעמודות תואמות לתבנית</li>
              <li>העלה את הקובץ דרך כפתור "בחר קובץ"</li>
              <li>המערכת תאמת ותייבא את הנתונים</li>
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
};