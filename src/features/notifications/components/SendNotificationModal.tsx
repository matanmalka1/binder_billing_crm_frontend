import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useSendNotification } from "../hooks/useSendNotification";
import type { SendNotificationModalProps } from "../types";

interface FormValues {
  client_id: number;
  channel: "WHATSAPP" | "EMAIL";
  message: string;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  open,
  onClose,
  clientId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      client_id: clientId ?? undefined,
      channel: "EMAIL",
      message: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ client_id: clientId ?? undefined, channel: "EMAIL", message: "" });
    }
  }, [open, clientId, reset]);

  const { sendNotification, isSending } = useSendNotification(onClose);

  const onSubmit = (values: FormValues) => {
    sendNotification({
      client_id: values.client_id,
      channel: values.channel,
      message: values.message,
    });
  };

  return (
    <Modal
      open={open}
      title="שלח הודעה"
      onClose={onClose}
      isDirty={isDirty}
      footer={
        <div className="flex gap-2 justify-start" dir="rtl">
          <Button type="submit" form="send-notification-form" disabled={isSending}>
            {isSending ? "שולח..." : "שלח"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>
            ביטול
          </Button>
        </div>
      }
    >
      <form
        id="send-notification-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        dir="rtl"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">מספר לקוח</label>
          <Input
            type="number"
            {...register("client_id", { required: "שדה חובה", valueAsNumber: true })}
            readOnly={clientId != null}
            className={clientId != null ? "bg-gray-50 text-gray-500" : ""}
          />
          {errors.client_id && (
            <p className="mt-1 text-xs text-red-600">{errors.client_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ערוץ שליחה</label>
          <Select {...register("channel", { required: true })}>
            <option value="EMAIL">אימייל</option>
            <option value="WHATSAPP">וואטסאפ</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תוכן ההודעה</label>
          <Textarea
            {...register("message", { required: "שדה חובה", maxLength: { value: 1000, message: "עד 1000 תווים" } })}
            rows={4}
            placeholder="הכנס את תוכן ההודעה..."
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

SendNotificationModal.displayName = "SendNotificationModal";
