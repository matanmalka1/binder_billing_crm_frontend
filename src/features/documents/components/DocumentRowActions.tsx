import { Download, Eye, History, RefreshCw, Trash2 } from "lucide-react";
import { RowActionItem, RowActionSeparator, RowActionsMenu } from "@/components/ui/table";
import type { PermanentDocumentResponse } from "../api";

export interface DocumentRowActionsProps {
  doc: PermanentDocumentResponse;
  isAdvisor: boolean;
  downloadingId: number | null;
  replacingId: number | null;
  deletingId: number | null;
  onDownload: (id: number) => void;
  onPreview: (doc: PermanentDocumentResponse) => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  handleExpandVersions: (id: number) => void;
}

export const DocumentRowActions: React.FC<DocumentRowActionsProps> = ({
  doc,
  isAdvisor,
  downloadingId,
  replacingId,
  deletingId,
  onDownload,
  onPreview,
  onReplace,
  onDelete,
  handleExpandVersions,
}) => (
  <RowActionsMenu ariaLabel={`פעולות למסמך ${doc.id}`}>
      <RowActionItem
        label="תצוגה מקדימה"
        onClick={() => onPreview(doc)}
        icon={<Eye className="h-4 w-4" />}
      />
      <RowActionItem
        label={downloadingId === doc.id ? "מוריד..." : "הורד"}
        onClick={() => onDownload(doc.id)}
        icon={<Download className="h-4 w-4" />}
        disabled={downloadingId === doc.id}
      />
      <RowActionItem
        label="היסטוריית גרסאות"
        onClick={() => handleExpandVersions(doc.id)}
        icon={<History className="h-4 w-4" />}
      />

      {isAdvisor && (
        <>
          <RowActionSeparator />
          <RowActionItem
            label={replacingId === doc.id ? "מחליף..." : "החלף"}
            onClick={() => onReplace(doc.id)}
            icon={<RefreshCw className="h-4 w-4" />}
            disabled={replacingId === doc.id}
          />
          <RowActionItem
            label={deletingId === doc.id ? "מוחק..." : "מחק"}
            onClick={() => onDelete(doc.id)}
            icon={<Trash2 className="h-4 w-4" />}
            danger
            disabled={deletingId === doc.id}
          />
        </>
      )}
    </RowActionsMenu>
);

DocumentRowActions.displayName = "DocumentRowActions";
