import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import type { ClientResponse, UpdateClientPayload } from "../api";
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
      address_street: client.address_street ?? "",
      address_building_number: client.address_building_number ?? "",
      address_apartment: client.address_apartment ?? "",
      address_city: client.address_city ?? "",
      address_zip_code: client.address_zip_code ?? "",
      notes: client.notes ?? "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await onSave({
      ...data,
      phone: data.phone || null,
      email: data.email || null,
      address_street: data.address_street || null,
      address_building_number: data.address_building_number || null,
      address_apartment: data.address_apartment || null,
      address_city: data.address_city || null,
      address_zip_code: data.address_zip_code || null,
      notes: data.notes || null,
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">מידע בסיסי</h3>

        {/* Read-only identity number */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">מספר זהות / ח.פ</p>
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            {client.id_number}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="שם מלא *"
            error={errors.full_name?.message}
            disabled={isLoading}
            {...register("full_name")}
          />
          <Input
            label="טלפון"
            placeholder="05X-XXXXXXX"
            error={errors.phone?.message}
            disabled={isLoading}
            {...register("phone")}
          />
        </div>

        <Input
          label='דוא"ל'
          type="email"
          placeholder="example@domain.com"
          error={errors.email?.message}
          disabled={isLoading}
          {...register("email")}
        />
      </div>

      {/* Shipment address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">כתובת</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="רחוב"
            placeholder="שם הרחוב"
            error={errors.address_street?.message}
            disabled={isLoading}
            {...register("address_street")}
          />
          <Input
            label="מספר בניין"
            placeholder="מספר"
            error={errors.address_building_number?.message}
            disabled={isLoading}
            {...register("address_building_number")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="דירה"
            placeholder="מספר דירה (אופציונלי)"
            error={errors.address_apartment?.message}
            disabled={isLoading}
            {...register("address_apartment")}
          />
          <Input
            label="עיר"
            placeholder="שם העיר"
            error={errors.address_city?.message}
            disabled={isLoading}
            {...register("address_city")}
          />
        </div>

        <Input
          label="מיקוד"
          placeholder="מיקוד"
          error={errors.address_zip_code?.message}
          disabled={isLoading}
          {...register("address_zip_code")}
        />
      </div>

      {/* Admin fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">נתונים אדמיניסטרטיביים</h3>
        <Textarea
          label="הערות לעדכון (אופציונלי)"
          rows={4}
          placeholder="הוסף הערות על העדכון..."
          disabled={isLoading}
          error={errors.notes?.message}
          {...register("notes")}
        />
      </div>

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
