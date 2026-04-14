import { useEffect } from "react";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from "../../../components/shared/client";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import type { CreateReminderFormValues } from "../types";
import type { BinderResponse } from "@/features/binders";
import type { ChargeResponse } from "@/features/charges/api";
import { getChargeTypeLabel } from "@/features/charges";
import { getChargeStatusLabel } from "../../../utils/enums";
import type { TaxDeadlineResponse } from "@/features/taxDeadlines";
import { getDeadlineTypeLabel } from "@/features/taxDeadlines";
import type { AnnualReportFull } from "@/features/annualReports";
import type { AdvancePaymentRow } from "@/features/advancedPayments";
import { reminderTypeOptions } from "../types";

interface CreateReminderModalProps {
  open: boolean;
  form: UseFormReturn<CreateReminderFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  fixedClientId?: number;
  fixedClientName?: string;
  clientBinders?: BinderResponse[];
  clientCharges?: ChargeResponse[];
  clientTaxDeadlines?: TaxDeadlineResponse[];
  clientAnnualReports?: AnnualReportFull[];
  clientAdvancePayments?: AdvancePaymentRow[];
}

// react-hook-form types errors on discriminated unions narrowly; cast once here.
type FormErrors = Partial<Record<keyof CreateReminderFormValues, { message?: string }>>;

export const CreateReminderModal: React.FC<CreateReminderModalProps> = ({
  open,
  form,
  isSubmitting,
  onClose,
  onSubmit,
  fixedClientId,
  fixedClientName,
  clientBinders = [],
  clientCharges = [],
  clientTaxDeadlines = [],
  clientAnnualReports = [],
  clientAdvancePayments = [],
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const e = errors as FormErrors;
  const reminderType = watch("reminder_type");
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) =>
      setValue("client_id", value, options),
    ),
  );

  const clientDisplay = fixedClientId
    ? fixedClientName
      ? `${fixedClientName} (#${fixedClientId})`
      : `#${fixedClientId}`
    : null;

  useEffect(() => {
    if (open || fixedClientId) return;
    resetClientPicker();
  }, [fixedClientId, open, resetClientPicker]);

  const handleClose = () => {
    if (!fixedClientId) {
      resetClientPicker();
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      title="תזכורת חדשה"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleClose}>ביטול</Button>
          <Button type="button" variant="primary" onClick={onSubmit} isLoading={isSubmitting}>יצירה</Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register("client_id", { required: "שדה חובה" })} />
        {clientDisplay ? (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">לקוח</p>
            <p className="text-sm text-gray-900">{clientDisplay}</p>
          </div>
        ) : (
          <ClientPickerField
            selectedClient={selectedClient}
            clientQuery={clientQuery}
            onQueryChange={handleClientQueryChange}
            onSelect={handleSelectClient}
            onClear={handleClearClient}
            error={e.client_id?.message}
            label="לקוח *"
          />
        )}

        <Select
          label="סוג תזכורת"
          error={e.reminder_type?.message}
          {...register("reminder_type")}
        >
          {reminderTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {(reminderType === "tax_deadline_approaching" || reminderType === "vat_filing") &&
          (clientTaxDeadlines.length > 0 ? (
            <Select label="מועד מס" error={e.tax_deadline_id?.message} {...register("tax_deadline_id")}>
              <option value="">בחר מועד מס...</option>
              {clientTaxDeadlines.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {getDeadlineTypeLabel(d.deadline_type)} — {d.due_date}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              min={1}
              label="מזהה מועד מס"
              error={e.tax_deadline_id?.message}
              {...register("tax_deadline_id")}
            />
          ))}
        {reminderType === "binder_idle" &&
          (clientBinders.length > 0 ? (
            <Select label="תיק" error={e.binder_id?.message} {...register("binder_id")}>
              <option value="">בחר תיק...</option>
              {clientBinders.map((b) => (
              <option key={b.id} value={String(b.id)}>
                {b.binder_number}
              </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              min={1}
              label="מזהה תיק"
              error={e.binder_id?.message}
              {...register("binder_id")}
            />
          ))}
        {reminderType === "unpaid_charge" &&
          (clientCharges.length > 0 ? (
            <Select label="חשבונית" error={e.charge_id?.message} {...register("charge_id")}>
              <option value="">בחר חשבונית...</option>
              {clientCharges.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  #{c.id} — {getChargeTypeLabel(c.charge_type)} ({getChargeStatusLabel(c.status)})
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              min={1}
              label="מזהה חשבונית"
              error={e.charge_id?.message}
              {...register("charge_id")}
            />
          ))}
        {reminderType === "annual_report_deadline" &&
          (clientAnnualReports.length > 0 ? (
            <Select label="דוח שנתי" error={e.annual_report_id?.message} {...register("annual_report_id")}>
              <option value="">בחר דוח שנתי...</option>
              {clientAnnualReports.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.tax_year} — {r.status}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              min={1}
              label="מזהה דוח שנתי"
              error={e.annual_report_id?.message}
              {...register("annual_report_id")}
            />
          ))}
        {reminderType === "advance_payment_due" &&
          (clientAdvancePayments.length > 0 ? (
            <Select label="מקדמה" error={e.advance_payment_id?.message} {...register("advance_payment_id")}>
              <option value="">בחר מקדמה...</option>
              {clientAdvancePayments.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.period} — {p.status}
                </option>
              ))}
            </Select>
          ) : (
            <Input
              type="number"
              min={1}
              label="מזהה מקדמה"
              error={e.advance_payment_id?.message}
              {...register("advance_payment_id")}
            />
          ))}

        {reminderType === "custom" && (
          <Input
            label="שם תזכורת מותאמת *"
            placeholder="לדוג': תזכורת לחידוש רישיון"
            error={e.message?.message}
            {...register("message")}
          />
        )}
        {reminderType === "document_missing" && (
          <Textarea
            label="הודעה"
            rows={3}
            placeholder="אופציונלי — אם ריק תופק הודעת ברירת מחדל"
            error={e.message?.message}
            {...register("message")}
          />
        )}

        <Controller
          name="target_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="תאריך יעד"
              error={e.target_date?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <Input type="number" label="ימים לפני" min={0}
          error={e.days_before?.message}
          {...register("days_before", { valueAsNumber: true })} />

        {(reminderType === "tax_deadline_approaching" ||
          reminderType === "vat_filing" ||
          reminderType === "annual_report_deadline" ||
          reminderType === "advance_payment_due" ||
          reminderType === "binder_idle" ||
          reminderType === "unpaid_charge") && (
          <Textarea
            label="הודעה"
            rows={3}
            placeholder="אופציונלי — אם ריק תופק הודעת ברירת מחדל"
            error={e.message?.message}
            {...register("message")}
          />
        )}
      </form>
    </Modal>
  );
};

CreateReminderModal.displayName = "CreateReminderModal";
