interface ConfirmDeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm space-y-4">
      <p className="text-sm text-gray-700">האם למחוק מסמך זה?</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel}
          className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50">
          ביטול
        </button>
        <button onClick={onConfirm}
          className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700">
          מחק
        </button>
      </div>
    </div>
  </div>
);
