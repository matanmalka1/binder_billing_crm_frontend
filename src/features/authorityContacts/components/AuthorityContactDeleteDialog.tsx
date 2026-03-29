import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";

interface AuthorityContactDeleteDialogProps {
  confirmDeleteId: number | null;
  deletingId: number | null;
  onCancel: () => void;
  onConfirm: (id: number) => void;
}

export const AuthorityContactDeleteDialog: React.FC<AuthorityContactDeleteDialogProps> = ({
  confirmDeleteId,
  deletingId,
  onCancel,
  onConfirm,
}) => (
  <ConfirmDialog
    open={confirmDeleteId !== null}
    title="מחיקת איש קשר"
    message="האם למחוק את איש הקשר? פעולה זו אינה הפיכה."
    confirmLabel="מחק"
    cancelLabel="ביטול"
    isLoading={deletingId === confirmDeleteId}
    onConfirm={() => {
      if (confirmDeleteId !== null) {
        onConfirm(confirmDeleteId);
      }
      onCancel();
    }}
    onCancel={onCancel}
  />
);
