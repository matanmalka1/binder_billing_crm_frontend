import { Download, Eye, History, CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../../../components/ui/overlays/DropdownMenu";
import type { PermanentDocumentResponse } from "../api";

export interface DocumentRowActionsProps {
  doc: PermanentDocumentResponse;
  isAdvisor: boolean;
  canPerformActions: boolean;
  downloadingId: number | null;
  replacingId: number | null;
  deletingId: number | null;
  rejectingId: number | null;
  onDownload: (id: number) => void;
  onPreview: (doc: PermanentDocumentResponse) => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  handleApprove: (id: number) => void;
  handleReject: (id: number) => void;
  handleExpandVersions: (id: number) => void;
}

export const DocumentRowActions: React.FC<DocumentRowActionsProps> = ({
  doc,
  isAdvisor,
  canPerformActions,
  downloadingId,
  replacingId,
  deletingId,
  rejectingId,
  onDownload,
  onPreview,
  onReplace,
  onDelete,
  handleApprove,
  handleReject,
  handleExpandVersions,
}) => (
  <div onClick={(e) => e.stopPropagation()}>
    <DropdownMenu ariaLabel={`פעולות למסמך ${doc.id}`}>
      <DropdownMenuItem
        label="תצוגה מקדימה"
        onClick={() => onPreview(doc)}
        icon={<Eye className="h-4 w-4" />}
      />
      <DropdownMenuItem
        label={downloadingId === doc.id ? "מוריד..." : "הורד"}
        onClick={() => onDownload(doc.id)}
        icon={<Download className="h-4 w-4" />}
        disabled={downloadingId === doc.id}
      />
      <DropdownMenuItem
        label="היסטוריית גרסאות"
        onClick={() => handleExpandVersions(doc.id)}
        icon={<History className="h-4 w-4" />}
      />

      {canPerformActions && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <DropdownMenuItem
            label="אשר"
            onClick={() => handleApprove(doc.id)}
            icon={<CheckCircle className="h-4 w-4 text-positive-700" />}
          />
          <DropdownMenuItem
            label="דחה"
            onClick={() => handleReject(doc.id)}
            icon={<XCircle className="h-4 w-4 text-negative-500" />}
            danger
            disabled={rejectingId === doc.id}
          />
        </>
      )}

      {isAdvisor && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <DropdownMenuItem
            label={replacingId === doc.id ? "מחליף..." : "החלף"}
            onClick={() => onReplace(doc.id)}
            icon={<RefreshCw className="h-4 w-4" />}
            disabled={replacingId === doc.id}
          />
          <DropdownMenuItem
            label={deletingId === doc.id ? "מוחק..." : "מחק"}
            onClick={() => onDelete(doc.id)}
            icon={<Trash2 className="h-4 w-4" />}
            danger
            disabled={deletingId === doc.id}
          />
        </>
      )}
    </DropdownMenu>
  </div>
);

DocumentRowActions.displayName = "DocumentRowActions";
