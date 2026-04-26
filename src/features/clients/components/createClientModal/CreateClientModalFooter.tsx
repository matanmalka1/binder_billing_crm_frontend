import { Button } from "@/components/ui/primitives/Button";
import { ModalFormActions } from "../../../../components/ui/overlays/ModalFormActions";

interface Props {
  isLastStep: boolean;
  isLoading: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onNext: () => void;
  stepIndex: number;
}

export const CreateClientModalFooter: React.FC<Props> = ({
  isLastStep,
  isLoading,
  onClose,
  onPrevious,
  onSubmit,
  onNext,
  stepIndex,
}) => {
  if (isLastStep) {
    return (
      <ModalFormActions
        cancelLabel="חזרה"
        cancelVariant="ghost"
        onCancel={onPrevious}
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitLabel="צור לקוח"
      />
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
        ביטול
      </Button>
      {stepIndex > 0 && (
        <Button type="button" variant="ghost" onClick={onPrevious} disabled={isLoading}>
          חזרה
        </Button>
      )}
      <Button type="button" onClick={onNext} disabled={isLoading}>
        הבא
      </Button>
    </div>
  );
};
