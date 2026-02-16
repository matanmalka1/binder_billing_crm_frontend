import { Card } from "../../../components/ui/Card";

export const ImportExportInstructions: React.FC = () => {
  return (
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
  );
};
