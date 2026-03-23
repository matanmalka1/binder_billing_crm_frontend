import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { DatePicker } from "../../../components/ui/DatePicker";
import { Textarea } from "../../../components/ui/Textarea";
import { correspondenceSchema, correspondenceDefaults, type CorrespondenceFormValues } from "../schemas";
import type { CorrespondenceEntry } from "../api";
import type { AuthorityContactResponse } from "@/features/authorityContacts/api";
import { format } from "date-fns";

interface CorrespondenceModalProps {
  open: boolean;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (values: CorrespondenceFormValues) => Promise<void>;
  existing?: CorrespondenceEntry | null;
  contacts?: AuthorityContactResponse[];
}

export const CorrespondenceModal: React.FC<CorrespondenceModalProps> = ({
  open,
  isCreating,
  onClose,
  onSubmit,
  existing,
  contacts = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CorrespondenceFormValues>({
    resolver: zodResolver(correspondenceSchema),
    defaultValues: correspondenceDefaults,
  });

  useEffect(() => {
    if (open) {
      if (existing) {
        reset({
          correspondence_type: existing.correspondence_type,
          subject: existing.subject,
          notes: existing.notes ?? "",
          occurred_at: format(new Date(existing.occurred_at), "yyyy-MM-dd"),
          contact_id: existing.contact_id ?? null,
        });
      } else {
        reset({
          ...correspondenceDefaults,
          contact_id: contacts.length === 1 ? contacts[0].id : null,
        });
      }
    }
  }, [open, existing, contacts, reset]);

  const handleClose = () => {
    reset(correspondenceDefaults);
    onClose();
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset(correspondenceDefaults);
  });

  const title = existing ? "עריכת רשומת התכתבות" : "הוספת רשומת התכתבות";

  return (
    <Modal
      open={open}
      title={title}
      onClose={handleClose}
      footer={
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" disabled={isCreating} onClick={handleClose}>
            ביטול
          </Button>
          <Button type="button" isLoading={isCreating} disabled={isCreating} onClick={submit}>
            {existing ? "עדכן" : "הוסף"}
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

        <Controller
          name="occurred_at"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="תאריך *"
              error={errors.occurred_at?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        {contacts.length > 0 && (
          <Controller
            name="contact_id"
            control={control}
            render={({ field }) => (
              <Select
                label="איש קשר (רשות)"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
              >
                <option value="">ללא איש קשר</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.office ? ` — ${c.office}` : ""}
                  </option>
                ))}
              </Select>
            )}
          />
        )}

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
