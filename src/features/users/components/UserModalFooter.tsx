import { Button } from "../../../components/ui/primitives/Button";

interface UserModalFooterProps {
  isLoading: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export const UserModalFooter: React.FC<UserModalFooterProps> = ({
  isLoading,
  submitLabel,
  onCancel,
  onSubmit,
}) => (
  <div className="flex justify-end gap-3">
    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
      ביטול
    </Button>
    <Button variant="primary" onClick={onSubmit} isLoading={isLoading}>
      {submitLabel}
    </Button>
  </div>
);
