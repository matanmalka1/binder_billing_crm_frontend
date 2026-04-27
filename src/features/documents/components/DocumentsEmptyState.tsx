import { FileText, Plus } from "lucide-react";
import { Button } from "../../../components/ui/primitives/Button";

interface DocumentsEmptyStateProps {
  hasDocuments: boolean;
  onUploadClick: () => void;
}

export const DocumentsEmptyState: React.FC<DocumentsEmptyStateProps> = ({
  hasDocuments,
  onUploadClick,
}) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-200 py-14 text-center">
    <FileText className="h-9 w-9 text-gray-300" />
    {!hasDocuments ? (
      <>
        <p className="text-sm font-medium text-gray-500">
          עדיין לא הועלו מסמכים ללקוח זה
        </p>
        <Button size="sm" onClick={onUploadClick} className="gap-1.5 mt-1">
          <Plus className="h-4 w-4" />
          העלאת מסמך ראשון
        </Button>
      </>
    ) : (
      <p className="text-sm font-medium text-gray-500">
        לא נמצאו מסמכים מתאימים לחיפוש
      </p>
    )}
  </div>
);
