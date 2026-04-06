import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import { Select } from "../../../components/ui/inputs/Select";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import { clientsApi } from "@/features/clients/api";
import { useSendNotification } from "../hooks/useSendNotification";
import type { SendNotificationModalProps } from "../types";

interface FormValues {
  channel: "WHATSAPP" | "EMAIL";
  message: string;
}

export const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  open,
  onClose,
  clientId,
}) => {
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(
    clientId != null ? { id: clientId, name: "" } : null
  );
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [clientError, setClientError] = useState<string | undefined>();
  const [clientContact, setClientContact] = useState<{ phone: string | null; email: string | null } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      channel: "EMAIL",
      message: "",
    },
  });

  const channel = useWatch({ control, name: "channel" });

  useEffect(() => {
    if (open) {
      reset({ channel: "EMAIL", message: "" });
      setSelectedClient(clientId != null ? { id: clientId, name: "" } : null);
      setSelectedBusinessId(null);
      setClientQuery("");
      setClientError(undefined);
      setClientContact(null);

      if (clientId != null) {
        clientsApi.getById(clientId).then((data) => {
          setClientContact({ phone: data.phone, email: data.email });
        }).catch(() => setClientContact(null));
        clientsApi.listAllBusinessesForClient(clientId).then((data) => {
          const active = data.items.find((b) => b.status === "active") ?? data.items[0];
          setSelectedBusinessId(active?.id ?? null);
        }).catch(() => setSelectedBusinessId(null));
      }
    }
  }, [open, clientId, reset]);

  const { sendNotification, isSending } = useSendNotification(onClose);

  const onSubmit = (values: FormValues) => {
    if (!selectedClient) {
      setClientError("שדה חובה");
      return;
    }
    if (!selectedBusinessId) {
      setClientError("לא נמצא עסק פעיל ללקוח זה");
      return;
    }
    setClientError(undefined);
    sendNotification({
      business_id: selectedBusinessId,
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
        <div className="space-y-1">
          {clientId != null ? (
            <SelectedClientDisplay
              label="לקוח"
              name={selectedClient?.name || `לקוח #${clientId}`}
              id={clientId}
              onClear={() => {}}
            />
          ) : selectedClient ? (
            <SelectedClientDisplay
              label="לקוח"
              name={selectedClient.name}
              id={selectedClient.id}
              onClear={() => { setSelectedClient(null); setClientQuery(""); setClientContact(null); }}
            />
          ) : (
            <ClientSearchInput
              label="לקוח"
              value={clientQuery}
              onChange={setClientQuery}
              onSelect={async (c) => {
                setSelectedClient({ id: c.id, name: c.name });
                setSelectedBusinessId(null);
                setClientError(undefined);
                try {
                  const [clientData, bizData] = await Promise.all([
                    clientsApi.getById(c.id),
                    clientsApi.listAllBusinessesForClient(c.id),
                  ]);
                  setClientContact({ phone: clientData.phone, email: clientData.email });
                  const active = bizData.items.find((b) => b.status === "active") ?? bizData.items[0];
                  setSelectedBusinessId(active?.id ?? null);
                } catch {
                  setClientContact(null);
                  setSelectedBusinessId(null);
                }
              }}
              error={clientError}
              placeholder="חפש לפי שם, ת.ז. / ח.פ..."
            />
          )}
          {selectedClient && clientContact && (
            <p className="text-xs text-gray-500 pe-1">
              {channel === "WHATSAPP"
                ? (clientContact.phone ?? "אין מספר טלפון ללקוח")
                : (clientContact.email ?? "אין כתובת אימייל ללקוח")}
            </p>
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
            <p className="mt-1 text-xs text-negative-600">{errors.message.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

SendNotificationModal.displayName = "SendNotificationModal";
