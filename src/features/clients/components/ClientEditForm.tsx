import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { ClientResponse, UpdateClientPayload } from "../../../api/clients.api";
import { clientEditSchema, type ClientEditFormValues } from "../schemas";

interface ClientEditFormProps {
  client: ClientResponse;
  onSave: (data: UpdateClientPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  /** When true, the form renders without its own action buttons (parent renders them). */
  hideFooter?: boolean;
  /** Exposed form id so a parent can submit via <button form="...">. */
  formId?: string;
}

export const ClientEditForm: React.FC<ClientEditFormProps> = ({
  client,
  onSave,
  onCancel,
  isLoading = false,
  hideFooter = false,
  formId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ClientEditFormValues>({
    resolver: zodResolver(clientEditSchema),
    defaultValues: {
      full_name: client.full_name,
      phone: client.phone ?? "",
      email: client.email ?? "",
      status: client.status as ClientEditFormValues["status"],
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await onSave({
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      notes: data.notes || null,
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">מידע בסיסי</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="שם מלא *"
            error={errors.full_name?.message}
            disabled={isLoading}
            {...register("full_name")}
          />
          <Select
            label="סטטוס *"
            error={errors.status?.message}
            disabled={isLoading}
            {...register("status")}
          >
            <option value="active">פעיל</option>
            <option value="frozen">מוקפא</option>
            <option value="closed">סגור</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרטי התקשרות</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="טלפון"
            type="tel"
            placeholder="050-1234567"
            error={errors.phone?.message}
            disabled={isLoading}
            {...register("phone")}
          />
          <Input
            label="אימייל"
            type="email"
            placeholder="הזן כתובת אימייל"
            error={errors.email?.message}
            disabled={isLoading}
            {...register("email")}
          />
        </div>
      </div>

      <Textarea
        label="הערות לעדכון (אופציונלי)"
        rows={4}
        placeholder="הוסף הערות על העדכון..."
        disabled={isLoading}
        error={errors.notes?.message}
        {...register("notes")}
      />

      {!hideFooter && (
        <>
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              ביטול
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !isDirty}
            >
              שמור שינויים
            </Button>
          </div>

          {!isDirty && (
            <p className="text-center text-sm text-gray-500">לא בוצעו שינויים בטופס</p>
          )}
        </>
      )}
    </form>
  );
};