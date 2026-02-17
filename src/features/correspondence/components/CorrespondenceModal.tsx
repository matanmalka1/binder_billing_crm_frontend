import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { correspondenceSchema, correspondenceDefaults, type CorrespondenceFormValues } from "./correspondenceSchema";

interface Props {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (values: CorrespondenceFormValues) => void;
}

export const CorrespondenceModal: React.FC<Props> = ({ open, isCreating, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CorrespondenceFormValues>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: correspondenceDefaults,
  });

  const handleClose = () => { reset(correspondenceDefaults); onClose(); };

  const submit = handleSubmit((values) => {
    onSubmit(values);
    reset(correspondenceDefaults);
    onClose();
  });

  return (
    <Modal
      open={open}
      title="הוספת רשומת התכתבות"
      onClose={handleClose}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" disabled={isCreating} onClick={handleClose}>ביטול</Button>
          <Button type="button" isLoading={isCreating} onClick={submit}>הוסף</Button>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Select label="סוג" error={errors.correspondence_type?.message} {...register("correspondence_type")}>
          <option value="call">שיחה</option>
          <option value="letter">מכתב</option>
          <option value="email">אימייל</option>
          <option value="meeting">פגישה</option>
        </Select>
        <Input label="נושא *" error={errors.subject?.message} {...register("subject")} />
        <Input label="תאריך *" type="date" error={errors.occurred_at?.message} {...register("occurred_at")} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות</label>
          <textarea rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" {...register("notes")} />
        </div>
      </form>
    </Modal>
  );
};
