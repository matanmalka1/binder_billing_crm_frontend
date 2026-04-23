import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Select } from "../../../components/ui/inputs/Select";
import type { CreateClientPayload, ISODateString } from "../api";
import { useClientCreationImpact } from "../hooks/useClientCreationImpact";
import {
  CLIENT_ID_NUMBER_INPUT_LABELS,
  CLIENT_ID_NUMBER_PLACEHOLDERS,
  CLIENT_ID_NUMBER_TYPE_OPTIONS,
  DEFAULT_CLIENT_ID_NUMBER_TYPE,
  DEFAULT_VAT_EXEMPT_CEILING,
  ENTITY_OPTIONS_BY_ID_TYPE,
  ENTITY_TYPE_LABELS,
  requiresIsraeliNumericId,
  VAT_TYPE_OPTIONS,
} from "../constants";
import { createClientSchema, type CreateClientFormValues } from "../schemas";

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
    control,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
    reset,
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
    defaultValues: {
      id_number_type: DEFAULT_CLIENT_ID_NUMBER_TYPE,
      full_name: "",
      id_number: "",
      entity_type: undefined,
      phone: "",
      email: "",
      address_street: "",
      address_building_number: "",
      address_apartment: "",
      address_city: "",
      address_zip_code: "",
      vat_reporting_frequency: undefined,
      vat_exempt_ceiling: null,
      advance_rate: "",
      accountant_name: "",
      business_name: "",
      business_opened_at: "",
    },
  });
  const { field: businessOpenedAtField } = useController({ name: "business_opened_at", control });

  const idNumberType = watch("id_number_type");
  const currentEntityType = watch("entity_type");
  const currentVatFrequency = watch("vat_reporting_frequency");

  const impactQuery = useClientCreationImpact(
    currentEntityType && currentVatFrequency
      ? { entity_type: currentEntityType, vat_reporting_frequency: currentVatFrequency }
      : null,
  );
  const idNumberLabel = CLIENT_ID_NUMBER_INPUT_LABELS[idNumberType] ?? "מספר מזהה";
  const idNumberPlaceholder = CLIENT_ID_NUMBER_PLACEHOLDERS[idNumberType] ?? "הזן מספר מזהה";
  const shouldStripToDigits = requiresIsraeliNumericId(idNumberType);

  const allowedEntityTypes = ENTITY_OPTIONS_BY_ID_TYPE[idNumberType] ?? [];
  const isOsekPatur = currentEntityType === "osek_patur";
  const showVatCeiling = isOsekPatur;

  const [ceilingEditable, setCeilingEditable] = useState(false);

  // אם סוג המזהה השתנה וסוג הישות הנוכחי כבר לא תקין — מאפסים
  useEffect(() => {
    if (currentEntityType && !allowedEntityTypes.includes(currentEntityType)) {
      resetField("entity_type", { defaultValue: undefined });
    }
    // אם יש רק אופציה אחת — בוחרים אותה אוטומטית
    if (allowedEntityTypes.length === 1) {
      setValue("entity_type", allowedEntityTypes[0]);
    }
  }, [idNumberType]); // eslint-disable-line react-hooks/exhaustive-deps

  // כשנבחר עוסק פטור — ממלאים תקרה ברירת מחדל; כשלא — מנקים
  useEffect(() => {
    if (isOsekPatur) {
      setValue("vat_exempt_ceiling", DEFAULT_VAT_EXEMPT_CEILING, { shouldValidate: false });
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
      entity_type: data.entity_type,
      phone: data.phone,
      email: data.email,
      address_street: data.address_street,
      address_building_number: data.address_building_number,
      address_apartment: data.address_apartment,
      address_city: data.address_city,
      address_zip_code: data.address_zip_code,
      vat_reporting_frequency: data.vat_reporting_frequency,
      vat_exempt_ceiling: data.vat_exempt_ceiling || null,
      advance_rate: data.advance_rate,
      accountant_name: data.accountant_name,
      business_name: data.business_name,
      business_opened_at: data.business_opened_at as ISODateString,
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
          submitLabel="צור לקוח"
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
          {CLIENT_ID_NUMBER_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
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

        {/* עסק ראשון */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">פרטי עסק</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="שם עסק *"
              placeholder="לדוגמה: מסעדת ישראל"
              error={errors.business_name?.message}
              disabled={isLoading}
              {...register("business_name")}
            />
            <DatePicker
              label="תאריך פתיחת עסק *"
              error={errors.business_opened_at?.message}
              disabled={isLoading}
              value={businessOpenedAtField.value ?? ""}
              onChange={businessOpenedAtField.onChange}
              onBlur={businessOpenedAtField.onBlur}
              name={businessOpenedAtField.name}
            />
          </div>
        </div>

        <Select
          label="סוג ישות *"
          error={errors.entity_type?.message}
          disabled={isLoading || allowedEntityTypes.length === 1}
          options={[
            { value: "", label: "בחר סוג ישות" },
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
              label="רחוב *"
              placeholder="שם הרחוב"
              error={errors.address_street?.message}
              disabled={isLoading}
              {...register("address_street")}
            />
            <Input
              label="מספר בניין *"
              placeholder="מספר"
              error={errors.address_building_number?.message}
              disabled={isLoading}
              {...register("address_building_number")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="דירה *"
              placeholder="מספר דירה"
              error={errors.address_apartment?.message}
              disabled={isLoading}
              {...register("address_apartment")}
            />
            <Input
              label="מיקוד *"
              placeholder="1234567"
              error={errors.address_zip_code?.message}
              disabled={isLoading}
              onInput={stripNonDigits}
              {...register("address_zip_code")}
            />
          </div>
          <Input
            label="עיר *"
            placeholder="שם העיר"
            error={errors.address_city?.message}
            disabled={isLoading}
            {...register("address_city")}
          />
        </div>

        {/* הגדרות מע״מ ומס */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <p className="text-sm font-medium text-gray-700">הגדרות מע״מ ומס</p>
          <Select
            label="תדירות דיווח מע״מ *"
            disabled={isLoading}
            options={[
              { value: "", label: "בחר תדירות דיווח" },
              ...VAT_TYPE_OPTIONS,
            ]}
            {...register("vat_reporting_frequency")}
          />
          <div className="grid grid-cols-2 gap-4">
            {showVatCeiling && (
              <div>
                <div className="relative">
                  <Input
                    label="תקרת פטור מע״מ (₪) *"
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
              label="אחוז מקדמה (%) *"
              placeholder="לדוגמה: 8.5"
              error={errors.advance_rate?.message}
              disabled={isLoading}
              onInput={stripNonDecimal}
              {...register("advance_rate")}
            />
          </div>
          <Input
            label="רואה חשבון מלווה *"
            error={errors.accountant_name?.message}
            disabled={isLoading}
            {...register("accountant_name")}
          />
        </div>

        <p className="text-xs text-gray-500">* שדות חובה</p>

        {impactQuery.data && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4" dir="rtl">
            <p className="mb-2 text-sm font-semibold text-blue-800">
              מה ייווצר אוטומטית עם פתיחת הלקוח
            </p>
            <ul className="space-y-1">
              {impactQuery.data.items.map((item) => (
                <li key={item.label} className="flex justify-between text-sm text-blue-700">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.count}</span>
                </li>
              ))}
            </ul>
            {impactQuery.data.note && (
              <p className="mt-2 text-xs text-blue-600">{impactQuery.data.note}</p>
            )}
            {impactQuery.data.years_scope === 2 && (
              <p className="mt-1 text-xs text-blue-600">ייווצר עבור השנה הנוכחית והשנה הבאה</p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
};
