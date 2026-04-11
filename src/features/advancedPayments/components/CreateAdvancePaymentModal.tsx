import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { Button } from "../../../components/ui/primitives/Button";
import { Select } from "../../../components/ui/inputs/Select";
import { DatePicker } from "../../../components/ui/inputs/DatePicker";
import { BIMONTHLY_START_MONTH_VALUES } from "@/constants/periodOptions.constants";
import {
  createAdvancePaymentSchema,
  CREATE_ADVANCE_PAYMENT_DEFAULTS,
  type CreateAdvancePaymentFormValues,
} from "../schemas";
import { ADVANCE_PAYMENT_FREQUENCY_OPTIONS } from "../constants";
import { MONTH_OPTIONS } from "../utils";
import { advancePaymentsApi, advancedPaymentsQK } from "../api";
import type { CreateAdvancePaymentPayload } from "../types";

interface CreateAdvancePaymentModalProps {
  open: boolean;
  clientId: number;
  year: number;
  isCreating: boolean;
  onClose: () => void;
  onCreate: (payload: CreateAdvancePaymentPayload) => Promise<unknown>;
}

export const CreateAdvancePaymentModal: React.FC<CreateAdvancePaymentModalProps> = ({
  open,
  clientId,
  year,
  isCreating,
  onClose,
  onCreate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAdvancePaymentFormValues>({
    resolver: zodResolver(createAdvancePaymentSchema),
    defaultValues: CREATE_ADVANCE_PAYMENT_DEFAULTS,
  });
  const periodMonthsCount = watch("period_months_count");
  const month = watch("month");
  const monthOptions =
    periodMonthsCount === 2
      ? MONTH_OPTIONS.filter((option) => BIMONTHLY_START_MONTH_VALUES.has(option.value))
      : MONTH_OPTIONS;

  useEffect(() => {
    if (periodMonthsCount !== 2) return;
    if (BIMONTHLY_START_MONTH_VALUES.has(String(month))) return;
    setValue("month", 1, { shouldValidate: true });
  }, [month, periodMonthsCount, setValue]);

  const { data: suggestion } = useQuery({
    queryKey: advancedPaymentsQK.suggestion(clientId, year, periodMonthsCount),
    queryFn: () => advancePaymentsApi.getSuggestion(clientId, year, periodMonthsCount),
    enabled: open && clientId > 0 && year > 0,
    staleTime: 60_000,
  });

  const handleClose = () => {
    reset(CREATE_ADVANCE_PAYMENT_DEFAULTS);
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    await onCreate({
      period: `${year}-${String(data.month).padStart(2, "0")}`,
      period_months_count: data.period_months_count,
      due_date: data.due_date,
      expected_amount: data.expected_amount != null ? String(data.expected_amount) : null,
      paid_amount: data.paid_amount != null ? String(data.paid_amount) : null,
      notes: data.notes ?? null,
    });
    reset(CREATE_ADVANCE_PAYMENT_DEFAULTS);
    onClose();
  });

  const applySuggestion = () => {
    if (suggestion?.suggested_amount != null) {
      setValue("expected_amount", Number(suggestion.suggested_amount), { shouldValidate: true });
    }
  };

  return (
    <Modal
      open={open}
      title="מקדמה חדשה"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            ביטול
          </Button>
          <Button variant="primary" isLoading={isCreating} onClick={onSubmit}>
            יצירה
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <Select
              label="חודש"
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
              options={monthOptions}
              error={errors.month?.message}
            />
          )}
        />
        <Controller
          name="period_months_count"
          control={control}
          render={({ field }) => (
            <Select
              label="תדירות"
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value) as 1 | 2)}
              options={ADVANCE_PAYMENT_FREQUENCY_OPTIONS}
            />
          )}
        />
        <Controller
          name="due_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="תאריך יעד"
              error={errors.due_date?.message}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Controller
          name="expected_amount"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <Input
                label="סכום צפוי"
                type="number"
                min={0}
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? null : Number(e.target.value))
                }
                error={errors.expected_amount?.message}
              />
              {suggestion?.has_data && suggestion.suggested_amount != null && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={applySuggestion}
                  className="text-sm text-primary-600 hover:underline text-right w-full px-0 hover:bg-transparent justify-end"
                >
                  הצעה לפי מחזור שנה קודמת: ₪{Number(suggestion.suggested_amount).toLocaleString("he-IL")} — לחץ למילוי
                </Button>
              )}
            </div>
          )}
        />
        <Controller
          name="paid_amount"
          control={control}
          render={({ field }) => (
            <Input
              label="סכום ששולם (אופציונלי)"
              type="number"
              min={0}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : Number(e.target.value))
              }
              error={errors.paid_amount?.message}
            />
          )}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">הערות (אופציונלי)</label>
          <textarea
            {...register("notes")}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="הערות..."
          />
        </div>
      </form>
    </Modal>
  );
};

CreateAdvancePaymentModal.displayName = "CreateAdvancePaymentModal";
