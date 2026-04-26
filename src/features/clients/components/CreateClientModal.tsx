import { useEffect, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { Select } from "../../../components/ui/inputs/Select";
import { Button } from "@/components/ui/primitives/Button";
import { useAdvisorOptions } from "@/features/users";
import type { CreateClientPayload, ISODateString } from "../api";
import { useClientCreationImpact } from "../hooks/useClientCreationImpact";
import {
  CREATE_CLIENT_DEFAULT_VALUES,
  CREATE_CLIENT_ENTITY_OPTIONS,
  CREATE_CLIENT_VAT_OPTIONS,
  DEFAULT_VAT_EXEMPT_CEILING,
  deriveCreateClientIdNumberType,
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

const STEPS = [
  { key: "identity", label: "זיהוי", fields: ["entity_type", "full_name", "id_number"] },
  {
    key: "business",
    label: "עסק ופרטי קשר",
    fields: [
      "business_name",
      "business_opened_at",
      "phone",
      "email",
      "address_street",
      "address_building_number",
      "address_apartment",
      "address_zip_code",
      "address_city",
    ],
  },
  { key: "tax", label: "מס ומע״מ", fields: ["vat_reporting_frequency", "advance_rate", "accountant_id"] },
] as const;

export const CreateClientModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientSchema),
    mode: "onBlur",
    defaultValues: CREATE_CLIENT_DEFAULT_VALUES,
  });
  const { field: businessOpenedAtField } = useController({ name: "business_opened_at", control });

  const currentEntityType = watch("entity_type");
  const currentVatFrequency = watch("vat_reporting_frequency");
  const { options: advisorOptions, isLoading: advisorsLoading } = useAdvisorOptions();
  const isCompany = currentEntityType === "company_ltd";
  const isExempt = currentEntityType === "osek_patur";
  const showVatFrequency = currentEntityType != null && !isExempt;

  const impactQuery = useClientCreationImpact(
    currentEntityType && (isExempt || currentVatFrequency)
      ? { entity_type: currentEntityType, vat_reporting_frequency: currentVatFrequency }
      : null,
  );
  const nameLabel = isCompany ? "שם חברה" : "שם מלא";
  const idNumberLabel = isCompany ? 'ח.פ' : 'ת.ז';
  const idNumberPlaceholder = isCompany ? "512345678" : "123456789";
  const openedAtLabel = isCompany ? "תאריך התאגדות / פתיחה" : "תאריך פתיחת עסק";
  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  useEffect(() => {
    if (isExempt) {
      setValue("vat_reporting_frequency", null, { shouldValidate: false });
    } else if (currentVatFrequency == null) {
      setValue("vat_reporting_frequency", "monthly", { shouldValidate: false });
    }
  }, [isExempt, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
      setStepIndex(0);
    }
  }, [open]);

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setStepIndex(0);
      onClose();
    }
  };

  const goToNextStep = async () => {
    const fields = currentStep.fields as unknown as Array<keyof CreateClientFormValues>;
    const isValid = await trigger(fields, { shouldFocus: true });
    if (isValid) setStepIndex((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goToPreviousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const onFormSubmit = handleSubmit(async (data) => {
    const trimmedIdNumber = data.id_number.trim();
    const idNumberType = deriveCreateClientIdNumberType(data.entity_type);

    const payload: CreateClientPayload = {
      full_name: data.full_name.trim(),
      id_number: trimmedIdNumber,
      id_number_type: idNumberType,
      entity_type: data.entity_type,
      phone: data.phone,
      email: data.email,
      address_street: data.address_street,
      address_building_number: data.address_building_number,
      address_apartment: data.address_apartment,
      address_city: data.address_city,
      address_zip_code: data.address_zip_code,
      vat_reporting_frequency: data.entity_type === "osek_patur" ? undefined : data.vat_reporting_frequency,
      advance_rate: data.advance_rate?.trim() ? data.advance_rate.trim() : null,
      accountant_id: Number(data.accountant_id),
      business_name: data.business_name.trim(),
      business_opened_at: (data.business_opened_at || null) as ISODateString | null,
    };
    try {
      await onSubmit(payload);
    } catch {
      return;
    }
    reset();
    setStepIndex(0);
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="יצירת לקוח חדש"
      footer={
        isLastStep ? (
          <ModalFormActions
            cancelLabel="חזרה"
            cancelVariant="ghost"
            onCancel={goToPreviousStep}
            onSubmit={onFormSubmit}
            isLoading={isLoading}
            submitLabel="צור לקוח"
          />
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              ביטול
            </Button>
            {stepIndex > 0 && (
              <Button type="button" variant="ghost" onClick={goToPreviousStep} disabled={isLoading}>
                חזרה
              </Button>
            )}
            <Button type="button" onClick={goToNextStep} disabled={isLoading}>
              הבא
            </Button>
          </div>
        )
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-2" aria-label="שלבי יצירת לקוח">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className={`rounded-md border px-3 py-2 text-center text-sm font-medium ${
                index === stepIndex
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : index < stepIndex
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-50 text-gray-500"
              }`}
            >
              {index + 1}. {step.label}
            </div>
          ))}
        </div>

        {stepIndex === 0 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">כל השדות בשלב זה חובה.</p>
            <Select
              label="סוג ישות *"
              error={errors.entity_type?.message}
              disabled={isLoading}
              options={[
                { value: "", label: "בחר סוג ישות" },
                ...CREATE_CLIENT_ENTITY_OPTIONS,
              ]}
              {...register("entity_type")}
            />

            <Input
              label={`${nameLabel} *`}
              error={errors.full_name?.message}
              disabled={isLoading}
              {...register("full_name")}
            />

            <Input
              label={`${idNumberLabel} *`}
              placeholder={idNumberPlaceholder}
              error={errors.id_number?.message}
              disabled={isLoading}
              onInput={isCompany ? stripNonDigits : undefined}
              {...register("id_number")}
            />
          </div>
        )}

        {stepIndex === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">שדות מסומנים בכוכבית חובה.</p>
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <p className="text-sm font-medium text-gray-700">
                {isCompany ? "פרטי התאגדות" : "פרטי עסק"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="שם עסק *"
                  placeholder={isCompany ? "לדוגמה: חטיבת פעילות מרכזית" : "לדוגמה: מסעדת ישראל"}
                  error={errors.business_name?.message}
                  disabled={isLoading}
                  {...register("business_name")}
                />
                <DatePicker
                  label={openedAtLabel}
                  error={errors.business_opened_at?.message}
                  disabled={isLoading}
                  value={businessOpenedAtField.value ?? ""}
                  onChange={businessOpenedAtField.onChange}
                  onBlur={businessOpenedAtField.onBlur}
                  name={businessOpenedAtField.name}
                />
              </div>
            </div>

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
          </div>
        )}

        {stepIndex === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">בדוק את הגדרות המס לפני יצירת הלקוח.</p>
            {showVatFrequency && (
              <Select
                label="תדירות דיווח מע״מ *"
                error={errors.vat_reporting_frequency?.message}
                disabled={isLoading}
                options={[
                  { value: "", label: "בחר תדירות דיווח" },
                  ...CREATE_CLIENT_VAT_OPTIONS,
                ]}
                {...register("vat_reporting_frequency")}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              {isExempt && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">תקרת פטור מע״מ</p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                    ₪{DEFAULT_VAT_EXEMPT_CEILING}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">נגזר אוטומטית לפי הגדרת המערכת</p>
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
            <Select
              label="רואה חשבון מלווה *"
              error={errors.accountant_id?.message}
              disabled={isLoading || advisorsLoading}
              options={[
                { value: "", label: advisorsLoading ? "טוען רואי חשבון..." : "בחר רואה חשבון" },
                ...advisorOptions,
              ]}
              {...register("accountant_id")}
            />

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
          </div>
        )}
      </form>
    </Modal>
  );
};
