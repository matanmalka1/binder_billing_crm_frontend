import { Button } from "../../../../components/ui/primitives/Button";
import { useEscapeToClose } from "@/components/ui/overlays/useEscapeToClose";

interface DeleteReportConfirmDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteReportConfirmDialog = ({
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteReportConfirmDialogProps) => {
  useEscapeToClose({ open: true, onClose: onCancel });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-2 text-base font-semibold text-gray-900">מחיקת דוח</h3>
        <p className="mb-4 text-sm text-gray-600">האם למחוק את הדוח? פעולה זו אינה הפיכה.</p>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            ביטול
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            isLoading={isDeleting}
          >
            מחק
          </Button>
        </div>
      </div>
    </div>
  );
};

DeleteReportConfirmDialog.displayName = "DeleteReportConfirmDialog";
