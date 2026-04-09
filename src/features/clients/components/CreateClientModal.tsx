import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { Input } from "../../../components/ui/inputs/Input";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Select } from "../../../components/ui/inputs/Select";
import type { CreateClientPayload, EntityType } from "../api";
import {
  CLIENT_ID_NUMBER_INPUT_LABELS,
  CLIENT_ID_NUMBER_PLACEHOLDERS,
  CLIENT_ID_NUMBER_TYPE_LABELS,
  ENTITY_TYPE_LABELS,
  VAT_TYPE_LABELS,
} from "../constants";
import { createClientSchema, type CreateClientFormValues } from "../schemas";
import type { ClientIdNumberType } from "../constants";

const ENTITY_OPTIONS_BY_ID_TYPE: Record<ClientIdNumberType, EntityType[]> = {
  individual: ["osek_patur", "osek_murshe", "employee"],
  corporation: ["company_ltd"],
  passport: ["osek_patur", "osek_murshe", "employee"],
  other: ["osek_patur", "osek_murshe", "company_ltd", "employee"],
};

const VAT_EXEMPT_CEILING_DEFAULT = "120000";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientPayload) => Promise<void>;
  isLoading?: boolean;
}

const stripNonDigits = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const cleaned = input.value.replace(/\D/g, "");
  if (cleaned !== input.value) input.value = cleaned;
};

const stripNonPhone = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const cleaned = input.value.replace(/[^\d-]/g, "");
  if (cleaned !== input.value) input.value = cleaned;
};

const stripNonDecimal = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  const cleaned = input.value.replace(/[^\d.]/g, "");
  if (cleaned !== input.value) input.value = cleaned;
};

export const CreateClientModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
    defaultValues: {
      id_number_type: "individual",
      full_name: "",
      id_number: "",
      entity_type: null,
      phone: "",
      email: "",
      address_street: "",
      address_building_number: "",
      address_apartment: "",
      address_city: "",
      address_zip_code: "",
      vat_reporting_frequency: null,
      vat_start_date: null,
      vat_exempt_ceiling: null,
      advance_rate: null,
      fiscal_year_start_month: null,
      tax_year_start: null,
    },
  });

  const idNumberType = watch("id_number_type");
  const currentEntityType = watch("entity_type");
  const { field: vatStartDateField } = useController({ name: "vat_start_date", control });
  const idNumberLabel = CLIENT_ID_NUMBER_INPUT_LABELS[idNumberType] ?? "מספר מזהה";
  const idNumberPlaceholder = CLIENT_ID_NUMBER_PLACEHOLDERS[idNumberType] ?? "הזן מספר מזהה";
  const shouldStripToDigits = idNumberType === "individual" || idNumberType === "corporation";

  const allowedEntityTypes = ENTITY_OPTIONS_BY_ID_TYPE[idNumberType] ?? [];
  const isOsekPatur = currentEntityType === "osek_patur";
  const showVatCeiling = isOsekPatur;

  const [ceilingEditable, setCeilingEditable] = useState(false);

  // אם סוג המזהה השתנה וסוג הישות הנוכחי כבר לא תקין — מאפסים
  useEffect(() => {
    if (currentEntityType && !allowedEntityTypes.includes(currentEntityType)) {
      setValue("entity_type", null);
    }
    // אם יש רק אופציה אחת — בוחרים אותה אוטומטית
    if (allowedEntityTypes.length === 1) {
      setValue("entity_type", allowedEntityTypes[0]);
    }
  }, [idNumberType]); // eslint-disable-line react-hooks/exhaustive-deps

  // כשנבחר עוסק פטור — ממלאים תקרה ברירת מחדל; כשלא — מנקים
  useEffect(() => {
    if (isOsekPatur) {
      setValue("vat_exempt_ceiling", VAT_EXEMPT_CEILING_DEFAULT, { shouldValidate: false });
      setCeilingEditable(false);
    } else {
      setValue("vat_exempt_ceiling", null, { shouldValidate: false });
      setCeilingEditable(false);
    }
  }, [isOsekPatur, setValue]);

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const payload: CreateClientPayload = {
      full_name: data.full_name,
      id_number: data.id_number,
      id_number_type: data.id_number_type,
      entity_type: data.entity_type || null,
      phone: data.phone,
      email: data.email,
      address_street: data.address_street || null,
      address_building_number: data.address_building_number || null,
      address_apartment: data.address_apartment || null,
      address_city: data.address_city || null,
      address_zip_code: data.address_zip_code || null,
      vat_reporting_frequency: data.vat_reporting_frequency || null,
      vat_start_date: data.vat_start_date || null,
      vat_exempt_ceiling: data.vat_exempt_ceiling || null,
      advance_rate: data.advance_rate || null,
      fiscal_year_start_month: data.fiscal_year_start_month || null,
      tax_year_start: data.tax_year_start || null,
    };
    await onSubmit(payload);
    reset();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת לקוח חדש"
      footer={
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={onFormSubmit}
          isLoading={isLoading}
          submitLabel="יצור לקוח"
        />
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        {/* זיהוי */}
        <Select
          label="סוג מזהה *"
          error={errors.id_number_type?.message}
          disabled={isLoading}
          {...register("id_number_type")}
        >
          <option value="individual">{CLIENT_ID_NUMBER_TYPE_LABELS.individual}</option>
          <option value="corporation">{CLIENT_ID_NUMBER_TYPE_LABELS.corporation}</option>
          <option value="passport">{CLIENT_ID_NUMBER_TYPE_LABELS.passport}</option>
          <option value="other">{CLIENT_ID_NUMBER_TYPE_LABELS.other}</option>
        </Select>

        <Input
          label="שם מלא *"
          error={errors.full_name?.message}
          disabled={isLoading}
          {...register("full_name")}
        />

        <Input
          label={`${idNumberLabel} *`}
          placeholder={idNumberPlaceholder}
          error={errors.id_number?.message}
          disabled={isLoading}
          onInput={shouldStripToDigits ? stripNonDigits : undefined}
          {...register("id_number")}
        />

        <Select
          label="סוג ישות"
          error={errors.entity_type?.message}
          disabled={isLoading || allowedEntityTypes.length === 1}
          options={[
            { value: "", label: "לא הוגדר" },
            ...allowedEntityTypes.map((type) => ({
              value: type,
              label: ENTITY_TYPE_LABELS[type],
            })),
          ]}
          {...register("entity_type")}
        />

        {/* פרטי התקשרות */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">פרטי התקשרות</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="טלפון *"
              type="tel"
              placeholder="050-1234567"
              error={errors.phone?.message}
              disabled={isLoading}
              onInput={stripNonPhone}
              {...register("phone")}
            />
            <Input
              label="אימייל *"
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              disabled={isLoading}
              {...register("email")}
            />
          </div>
        </div>

        {/* כתובת */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">כתובת</p>
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="דירה"
              placeholder="מספר דירה"
              error={errors.address_apartment?.message}
              disabled={isLoading}
              {...register("address_apartment")}
            />
            <Input
              label="מיקוד"
              placeholder="1234567"
              error={errors.address_zip_code?.message}
              disabled={isLoading}
              onInput={stripNonDigits}
              {...register("address_zip_code")}
            />
          </div>
          <Input
            label="עיר"
            placeholder="שם העיר"
            error={errors.address_city?.message}
            disabled={isLoading}
            {...register("address_city")}
          />
        </div>

        {/* הגדרות מע״מ ומס */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">הגדרות מע״מ ומס</p>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="תדירות דיווח מע״מ"
              disabled={isLoading}
              options={[
                { value: "", label: "לא הוגדר" },
                { value: "monthly", label: VAT_TYPE_LABELS.monthly },
                { value: "bimonthly", label: VAT_TYPE_LABELS.bimonthly },
                { value: "exempt", label: VAT_TYPE_LABELS.exempt },
              ]}
              {...register("vat_reporting_frequency")}
            />
            <DatePicker
              label="תאריך תחילת מע״מ"
              error={errors.vat_start_date?.message}
              disabled={isLoading}
              value={vatStartDateField.value ?? ""}
              onChange={vatStartDateField.onChange}
              onBlur={vatStartDateField.onBlur}
              name={vatStartDateField.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {showVatCeiling && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  תקרת פטור מע״מ (₪)
                </label>
                <div className="relative">
                  <Input
                    error={errors.vat_exempt_ceiling?.message}
                    disabled={isLoading || !ceilingEditable}
                    onInput={stripNonDecimal}
                    className={!ceilingEditable ? "bg-gray-50 text-gray-600" : undefined}
                    {...register("vat_exempt_ceiling")}
                  />
                  {!ceilingEditable && (
                    <button
                      type="button"
                      onClick={() => setCeilingEditable(true)}
                      title="עריכה ידנית (למקרים מיוחדים כגון שנה קצרה)"
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-400">ברירת מחדל לפי חוק — לחץ על עריכה לשינוי ידני</p>
              </div>
            )}
            <Input
              label="אחוז מקדמה (%)"
              placeholder="לדוגמה: 8.5"
              error={errors.advance_rate?.message}
              disabled={isLoading}
              onInput={stripNonDecimal}
              {...register("advance_rate")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="חודש תחילת שנת מס"
              type="number"
              placeholder="1"
              min={1}
              max={12}
              error={errors.fiscal_year_start_month?.message}
              disabled={isLoading}
              {...register("fiscal_year_start_month", { valueAsNumber: true })}
            />
            <Input
              label="שנת מס התחלתית"
              type="number"
              placeholder="2024"
              error={errors.tax_year_start?.message}
              disabled={isLoading}
              {...register("tax_year_start", { valueAsNumber: true })}
            />
          </div>
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>
      </form>
    </Modal>
  );
};
