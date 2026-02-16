import { Download, AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

interface ExportCardProps {
  entityLabel: string;
  exporting: boolean;
  onExport: () => void;
}

export const ExportCard: React.FC<ExportCardProps> = ({
  entityLabel,
  exporting,
  onExport,
}) => {
  return (
    <Card
      title="ייצוא לאקסל"
      variant="elevated"
      className="bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          ייצא את כל נתוני {entityLabel} לקובץ Excel מעוצב
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
          onClick={onExport}
          isLoading={exporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          ייצוא ל-Excel
        </Button>
      </div>
    </Card>
  );
};
