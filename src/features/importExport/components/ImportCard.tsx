import { useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface ImportCardProps {
  entityLabel: string;
  importing: boolean;
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
}

export const ImportCard: React.FC<ImportCardProps> = ({
  entityLabel,
  importing,
  onFileSelect,
  onDownloadTemplate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card
      title="ייבוא מאקסל"
      variant="elevated"
      className="bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          העלה קובץ Excel לייבוא נתוני {entityLabel} חדשים או עדכון קיימים
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
          <p className="mt-2 text-xs text-gray-500">או גרור קובץ לכאן</p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">תבנית לייבוא</p>
              <p className="text-xs text-gray-600">
                הורד קובץ דוגמה עם המבנה הנכון
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDownloadTemplate}
            >
              הורד תבנית
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
