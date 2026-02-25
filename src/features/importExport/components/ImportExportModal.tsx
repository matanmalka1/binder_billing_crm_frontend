import { useRef } from "react";
import { Download, Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useImportExport } from "../hooks/useImportExport";

// ── Shared info box ────────────────────────────────────────────────────────────

interface InfoBoxProps {
  items: string[];
}

const InfoBox: React.FC<InfoBoxProps> = ({ items }) => (
  <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
    <ul className="space-y-1 text-sm text-blue-900">
      {items.map((item) => (
        <li key={item}>• {item}</li>
      ))}
    </ul>
  </div>
);

// ── Export panel ───────────────────────────────────────────────────────────────

interface ExportPanelProps {
  exporting: boolean;
  onExport: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ exporting, onExport }) => (
  <Card title="ייצוא לאקסל" variant="elevated" className="bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="space-y-3">
      <p className="text-sm text-gray-700">ייצא את כל נתוני הלקוחות לקובץ Excel מעוצב</p>
      <InfoBox items={["כל השדות הרלוונטיים", "עיצוב וצבעים לקריאות מיטבית", "כותרות עם סינון אוטומטי"]} />
      <Button variant="primary" onClick={onExport} isLoading={exporting} className="gap-2">
        <Download className="h-4 w-4" />
        ייצוא ל-Excel
      </Button>
    </div>
  </Card>
);

// ── Import panel ───────────────────────────────────────────────────────────────

interface ImportPanelProps {
  importing: boolean;
  onFileSelect: (file: File) => void;
  onDownloadTemplate: () => void;
}

const ImportPanel: React.FC<ImportPanelProps> = ({ importing, onFileSelect, onDownloadTemplate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <Card title="ייבוא מאקסל" variant="elevated" className="bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="space-y-3">
        <p className="text-sm text-gray-700">העלה קובץ Excel לייבוא נתוני לקוחות חדשים</p>
        <InfoBox
          items={[
            "פורמט: .xlsx או .xls",
            "שורת כותרות חובה",
            "שמות עמודות צריכים להתאים למודל",
            "תאריכים בפורמט: YYYY-MM-DD",
          ]}
        />
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-primary-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            className="hidden"
            disabled={importing}
          />
          <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-gray-400" />
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
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <div>
            <p className="text-sm font-medium text-gray-900">תבנית לייבוא</p>
            <p className="text-xs text-gray-500">הורד קובץ דוגמה עם המבנה הנכון</p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onDownloadTemplate}>
            הורד תבנית
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ── Modal ──────────────────────────────────────────────────────────────────────

interface ImportExportModalProps {
  open: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ open, onClose }) => {
  const { importing, exporting, handleExport, handleImport, handleDownloadTemplate } =
    useImportExport();

  return (
    <Modal
      open={open}
      title="ייבוא וייצוא לקוחות"
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            סגור
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <ExportPanel exporting={exporting} onExport={handleExport} />
        <ImportPanel
          importing={importing}
          onFileSelect={handleImport}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </div>
    </Modal>
  );
};