import { Button } from "../../../components/ui/Button";

interface AuthorityContactModalFooterProps {
  isEditing: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const AuthorityContactModalFooter: React.FC<AuthorityContactModalFooterProps> = ({
  isEditing,
  isSaving,
  onClose,
  onSubmit,
}) => (
  <div className="flex items-center justify-end gap-2">
    <Button type="button" variant="outline" disabled={isSaving} onClick={onClose}>
      ביטול
    </Button>
    <Button type="button" isLoading={isSaving} onClick={onSubmit}>
      {isEditing ? "עדכן" : "הוסף"}
    </Button>
  </div>
);
