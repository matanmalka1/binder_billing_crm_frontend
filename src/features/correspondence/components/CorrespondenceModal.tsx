import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import { correspondenceSchema, correspondenceDefaults, type CorrespondenceFormValues } from "../schemas";

interface CorrespondenceModalProps {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (values: CorrespondenceFormValues) => Promise<void>;
}

export const CorrespondenceModal: React.FC<CorrespondenceModalProps> = ({
  open,
  isCreating,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorrespondenceFormValues>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: correspondenceDefaults,
  });

  const handleClose = () => {
    reset(correspondenceDefaults);
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset(correspondenceDefaults);
  });

  return (
    <Modal
      open={open}
      title="הוספת רשומת התכתבות"
      onClose={handleClose}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" disabled={isCreating} onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" isLoading={isCreating} disabled={isCreating} onClick={submit}>
            הוסף
          </Button>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Select
          label="סוג"
          error={errors.correspondence_type?.message}
          {...register("correspondence_type")}
        >
          <option value="call">שיחה</option>
          <option value="letter">מכתב</option>
          <option value="email">אימייל</option>
          <option value="meeting">פגישה</option>
        </Select>

        <Input label="נושא *" error={errors.subject?.message} {...register("subject")} />

        <Input
          label="תאריך *"
          type="date"
          error={errors.occurred_at?.message}
          {...register("occurred_at")}
        />

        <Textarea
          label="הערות"
          rows={3}
          placeholder="הוסף הערות..."
          {...register("notes")}
        />
      </form>
    </Modal>
  );
};

CorrespondenceModal.displayName = "CorrespondenceModal";