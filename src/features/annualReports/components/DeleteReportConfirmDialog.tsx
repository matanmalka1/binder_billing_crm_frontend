interface DeleteReportConfirmDialogProps {
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteReportConfirmDialog = ({
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteReportConfirmDialogProps) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
      <h3 className="mb-2 text-base font-semibold text-gray-900">מחיקת דוח</h3>
      <p className="mb-4 text-sm text-gray-600">האם למחוק את הדוח? פעולה זו אינה הפיכה.</p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ביטול
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
        >
          {isDeleting ? "מוחק..." : "מחק"}
        </button>
      </div>
    </div>
  </div>
);

DeleteReportConfirmDialog.displayName = "DeleteReportConfirmDialog";
