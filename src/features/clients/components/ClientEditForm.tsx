import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import type { ClientResponse, UpdateClientPayload } from "../api";
import {
  CLIENT_ID_NUMBER_TYPE_LABELS,
  CLIENT_STATUS_OPTIONS,
  DEFAULT_VAT_EXEMPT_CEILING,
  ENTITY_OPTIONS_BY_ID_TYPE,
  ENTITY_TYPE_LABELS,
  VAT_TYPE_OPTIONS,
} from "../constants";
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
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ClientEditFormValues>({
    resolver: zodResolver(clientEditSchema),
    defaultValues: {
      full_name: client.full_name,
      status: client.status,
      phone: client.phone ?? "",
      email: client.email ?? "",
      address_street: client.address_street ?? "",
      address_building_number: client.address_building_number ?? "",
      address_apartment: client.address_apartment ?? "",
      address_city: client.address_city ?? "",
      address_zip_code: client.address_zip_code ?? "",
      entity_type: client.entity_type ?? null,
      vat_reporting_frequency: client.vat_reporting_frequency ?? null,
      vat_exempt_ceiling: client.vat_exempt_ceiling ?? null,
      advance_rate: client.advance_rate ?? null,
      accountant_name: client.accountant_name ?? null,
      notes: client.notes ?? null,
    },
  });
  const idNumberType = client.id_number_type ?? "other";
  const allowedEntityTypes = ENTITY_OPTIONS_BY_ID_TYPE[idNumberType];

  const { field: statusField } = useController({ name: "status", control });
  const { field: entityTypeField } = useController({ name: "entity_type", control });

  const isOsekPatur = entityTypeField.value === "osek_patur";
  const { field: vatReportingFrequencyField } = useController({
    name: "vat_reporting_frequency",
    control,
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
      entity_type: data.entity_type || null,
      vat_reporting_frequency: data.vat_reporting_frequency || null,
      vat_exempt_ceiling: data.vat_exempt_ceiling || null,
      advance_rate: data.advance_rate || null,
      accountant_name: data.accountant_name || null,
      notes: data.notes || null,
    });
  });

  return (
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <Select
          label="סטטוס לקוח"
          disabled={isLoading}
          options={CLIENT_STATUS_OPTIONS}
          value={statusField.value}
          onChange={statusField.onChange}
          onBlur={statusField.onBlur}
          name={statusField.name}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">מספר מזהה</p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              {client.id_number}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">סוג מזהה</p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
              {client.id_number_type
                ? CLIENT_ID_NUMBER_TYPE_LABELS[client.id_number_type]
                : "לא הוגדר"}
            </p>
          </div>
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
            placeholder="050-1234567"
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

        <Select
          label="סוג ישות"
          disabled={isLoading || allowedEntityTypes.length === 1}
          options={[
            { value: "", label: "לא הוגדר" },
            ...allowedEntityTypes.map((type) => ({ value: type, label: ENTITY_TYPE_LABELS[type] })),
          ]}
          value={entityTypeField.value ?? ""}
          onChange={entityTypeField.onChange}
          onBlur={entityTypeField.onBlur}
          name={entityTypeField.name}
        />
        <Select
          label="תדירות דיווח מע״מ"
          disabled={isLoading}
          options={[
            { value: "", label: "לא הוגדר" },
            ...VAT_TYPE_OPTIONS,
          ]}
          value={vatReportingFrequencyField.value ?? ""}
          onChange={vatReportingFrequencyField.onChange}
          onBlur={vatReportingFrequencyField.onBlur}
          name={vatReportingFrequencyField.name}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isOsekPatur && (
            <Input
              label='תקרת פטור מע"מ'
              placeholder={DEFAULT_VAT_EXEMPT_CEILING}
              error={errors.vat_exempt_ceiling?.message}
              disabled={isLoading}
              {...register("vat_exempt_ceiling")}
            />
          )}
          <Input
            label="אחוז מקדמה %"
            placeholder="8.5"
            error={errors.advance_rate?.message}
            disabled={isLoading}
            {...register("advance_rate")}
          />
        </div>
        <Input
          label="רואה חשבון מלווה"
          error={errors.accountant_name?.message}
          disabled={isLoading}
          {...register("accountant_name")}
        />
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">הערות</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
            rows={3}
            placeholder="הערות חופשיות..."
            disabled={isLoading}
            {...register("notes")}
          />
          {errors.notes && <p className="text-xs text-negative-600">{errors.notes.message}</p>}
        </div>
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
