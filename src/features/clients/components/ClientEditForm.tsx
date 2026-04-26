import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { ConfirmDialog } from "../../../components/ui/overlays/ConfirmDialog";
import { useAdvisorOptions } from "@/features/users";
import type { ClientResponse, UpdateClientPayload } from "../api";
import {
  CLIENT_ID_NUMBER_TYPE_LABELS,
  CLIENT_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  VAT_TYPE_OPTIONS,
} from "../constants";
import { formatClientOfficeId } from "@/utils/utils";
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

const buildImpactMessage = (
  oldStatus: string,
  newStatus: string,
  oldEntityType: string | null | undefined,
  newEntityType: string | null | undefined,
): string | null => {
  const statusChangesToDestructive =
    newStatus !== oldStatus && (newStatus === "frozen" || newStatus === "closed");
  const entityTypeChanged =
    newEntityType != null && newEntityType !== "" && newEntityType !== oldEntityType;

  if (!statusChangesToDestructive && !entityTypeChanged) return null;

  const lines: string[] = [];

  if (statusChangesToDestructive) {
    const label = newStatus === "frozen" ? "מוקפא" : "סגור";
    lines.push(`שינוי סטטוס ל"${label}" יבטל את כל הפעולות הממתינות הבאות:`);
    lines.push("• תזכורות ממתינות");
    lines.push("• מועדי מס ממתינים");
    lines.push("• דיווחי מע\"מ פתוחים");
    lines.push("• דוחות שנתיים פתוחים");
    lines.push("• תיקים במשרד יועברו לארכיון");
  }

  if (entityTypeChanged) {
    if (lines.length > 0) lines.push("");
    lines.push("שינוי סוג ישות יבטל את כל מועדי המס הממתינים.");
  }

  return lines.join("\n");
};

const ReadonlyField = ({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help?: string;
}) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
      {value}
    </p>
    {help ? <p className="text-xs text-gray-500">{help}</p> : null}
  </div>
);

const getClientDefaultValues = (client: ClientResponse): ClientEditFormValues => ({
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
  advance_rate: client.advance_rate ?? "",
  accountant_id: client.accountant_id != null ? String(client.accountant_id) : "",
});

const blankToNull = (value: string | null | undefined): string | null =>
  value?.trim() ? value.trim() : null;

export const ClientEditForm: React.FC<ClientEditFormProps> = ({
  client,
  onSave,
  onCancel,
  isLoading = false,
  hideFooter = false,
  formId,
}) => {
  const [pendingData, setPendingData] = useState<UpdateClientPayload | null>(null);
  const [impactMessage, setImpactMessage] = useState<string | null>(null);
  const { options: advisorOptions, isLoading: advisorsLoading } = useAdvisorOptions();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ClientEditFormValues>({
    resolver: zodResolver(clientEditSchema),
    defaultValues: getClientDefaultValues(client),
  });
  const { field: statusField } = useController({ name: "status", control });
  const { field: entityTypeField } = useController({ name: "entity_type", control });
  const { field: accountantIdField } = useController({ name: "accountant_id", control });

  const isOsekPatur = entityTypeField.value === "osek_patur";
  const { field: vatReportingFrequencyField } = useController({
    name: "vat_reporting_frequency",
    control,
  });

  useEffect(() => {
    reset(getClientDefaultValues(client));
  }, [client, reset]);

  const buildPayload = (data: ClientEditFormValues): UpdateClientPayload => {
    const payload: UpdateClientPayload = {};

    if (dirtyFields.full_name) payload.full_name = data.full_name.trim();
    if (dirtyFields.status) payload.status = data.status;
    if (dirtyFields.phone) payload.phone = blankToNull(data.phone);
    if (dirtyFields.email) payload.email = blankToNull(data.email);
    if (dirtyFields.address_street) payload.address_street = blankToNull(data.address_street);
    if (dirtyFields.address_building_number) {
      payload.address_building_number = blankToNull(data.address_building_number);
    }
    if (dirtyFields.address_apartment) payload.address_apartment = blankToNull(data.address_apartment);
    if (dirtyFields.address_city) payload.address_city = blankToNull(data.address_city);
    if (dirtyFields.address_zip_code) payload.address_zip_code = blankToNull(data.address_zip_code);
    if (dirtyFields.entity_type) payload.entity_type = data.entity_type || null;
    if (dirtyFields.vat_reporting_frequency || dirtyFields.entity_type) {
      payload.vat_reporting_frequency = data.entity_type === "osek_patur"
        ? null
        : data.vat_reporting_frequency || null;
    }
    if (dirtyFields.advance_rate) payload.advance_rate = blankToNull(data.advance_rate);
    if (dirtyFields.accountant_id) {
      payload.accountant_id = data.accountant_id ? Number(data.accountant_id) : null;
    }

    return payload;
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = buildPayload(data);
    const msg = buildImpactMessage(
      client.status,
      data.status,
      client.entity_type,
      data.entity_type,
    );
    if (msg) {
      setPendingData(payload);
      setImpactMessage(msg);
      return;
    }
    await onSave(payload);
  });

  const handleConfirm = async () => {
    if (!pendingData) return;
    const data = pendingData;
    setPendingData(null);
    setImpactMessage(null);
    await onSave(data);
  };

  const handleCancelConfirm = () => {
    setPendingData(null);
    setImpactMessage(null);
  };

  return (
    <>
    <ConfirmDialog
      open={!!impactMessage}
      title="אזהרה: פעולה בלתי הפיכה"
      message={impactMessage ?? ""}
      confirmLabel="אישור ושמירה"
      cancelLabel="ביטול"
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onCancel={handleCancelConfirm}
    />
    <form id={formId} onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">זהות משפטית</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="שם מלא *"
            error={errors.full_name?.message}
            disabled={isLoading}
            {...register("full_name")}
          />
          <Select
            label="סוג ישות"
            disabled={isLoading}
            options={[
              { value: "", label: "לא הוגדר" },
              ...ENTITY_TYPE_OPTIONS,
            ]}
            value={entityTypeField.value ?? ""}
            onChange={entityTypeField.onChange}
            onBlur={entityTypeField.onBlur}
            name={entityTypeField.name}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField
            label="מספר מזהה"
            value={client.id_number || "לא הוגדר"}
            help="שדה זה מנוהל כרשומת זהות ואינו ניתן לעריכה במסך זה."
          />
          <ReadonlyField
            label="סוג מזהה"
            value={client.id_number_type
              ? CLIENT_ID_NUMBER_TYPE_LABELS[client.id_number_type]
              : "לא הוגדר"}
            help="שינוי סוג מזהה דורש תהליך תיקון רשומה."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרטי קשר</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="טלפון"
            placeholder="050-1234567"
            error={errors.phone?.message}
            disabled={isLoading}
            {...register("phone")}
          />
          <Input
            label='דוא"ל'
            type="email"
            placeholder="example@domain.com"
            error={errors.email?.message}
            disabled={isLoading}
            {...register("email")}
          />
        </div>

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="דירה"
            placeholder="מספר דירה"
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
          <Input
            label="מיקוד"
            placeholder="מיקוד"
            error={errors.address_zip_code?.message}
            disabled={isLoading}
            {...register("address_zip_code")}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרופיל מס</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isOsekPatur && (
            <ReadonlyField
              label="תדירות דיווח מע״מ"
              value="פטור - לא רלוונטי לדיווח תקופתי"
              help="עוסק פטור אינו מדווח מע״מ תקופתי, לכן השדה אינו ניתן לעריכה."
            />
          )}
          {!isOsekPatur && (
            <Select
              label="תדירות דיווח מע״מ"
              disabled={isLoading}
              options={[
                { value: "", label: "לא הוגדר" },
                ...VAT_TYPE_OPTIONS.filter((option) => option.value !== "exempt"),
              ]}
              value={vatReportingFrequencyField.value ?? ""}
              onChange={vatReportingFrequencyField.onChange}
              onBlur={vatReportingFrequencyField.onBlur}
              name={vatReportingFrequencyField.name}
            />
          )}
          <ReadonlyField
            label="תקרת פטור מע״מ"
            value={client.vat_exempt_ceiling ? `₪${client.vat_exempt_ceiling}` : "נקבע על ידי המערכת"}
            help="ערך מערכת/תצורה, לא שדה עריכה ידני."
          />
          <Input
            label="אחוז מקדמה %"
            placeholder="8.5"
            error={errors.advance_rate?.message}
            disabled={isLoading}
            {...register("advance_rate")}
          />
          <ReadonlyField
            label="תאריך עדכון מקדמה"
            value={client.advance_rate_updated_at ?? "לא קיים תאריך עדכון"}
            help="בהיעדר תאריך, אין להניח שהאחוז אומת מול מקור רשמי."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרטי משרד</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField
            label="מספר לקוח במשרד"
            value={client.office_client_number != null
              ? formatClientOfficeId(client.office_client_number)
              : "לא הוגדר"}
            help="מזהה משרד ראשי להצגה, מנוהל על ידי המערכת."
          />
          <ReadonlyField
            label="מזהה מערכת"
            value={`#${client.id}`}
            help="מזהה פנימי לצורכי תמיכה ובקרה בלבד."
          />
        </div>

        <Select
          label="סטטוס לקוח"
          disabled={isLoading}
          options={CLIENT_STATUS_OPTIONS}
          value={statusField.value}
          onChange={statusField.onChange}
          onBlur={statusField.onBlur}
          name={statusField.name}
        />
        <Select
          label="רואה חשבון מלווה"
          error={errors.accountant_id?.message}
          disabled={isLoading || advisorsLoading}
          options={[
            { value: "", label: advisorsLoading ? "טוען רואי חשבון..." : "לא הוגדר" },
            ...advisorOptions,
          ]}
          value={accountantIdField.value ?? ""}
          onChange={accountantIdField.onChange}
          onBlur={accountantIdField.onBlur}
          name={accountantIdField.name}
        />
      </section>

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
    </>
  );
};
