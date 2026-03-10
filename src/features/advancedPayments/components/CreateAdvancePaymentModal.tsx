import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import {
  createAdvancePaymentSchema,
  CREATE_ADVANCE_PAYMENT_DEFAULTS,
  type CreateAdvancePaymentFormValues,
} from "../schemas";
import { MONTH_OPTIONS } from "../utils";
import { advancePaymentsApi } from "../../../api/advancePayments.api";
import type { CreateAdvancePaymentPayload } from "../types";
import { QK } from "../../../lib/queryKeys";

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
    formState: { errors },
  } = useForm<CreateAdvancePaymentFormValues>({
    resolver: zodResolver(createAdvancePaymentSchema),
    defaultValues: CREATE_ADVANCE_PAYMENT_DEFAULTS,
  });

  const { data: suggestion } = useQuery({
    queryKey: QK.tax.advancePayments.suggestion(clientId, year),
    queryFn: () => advancePaymentsApi.getSuggestion(clientId, year),
    enabled: open && clientId > 0 && year > 0,
    staleTime: 60_000,
  });

  const handleClose = () => {
    reset(CREATE_ADVANCE_PAYMENT_DEFAULTS);
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    await onCreate({
      client_id: clientId,
      year,
      month: data.month,
      due_date: data.due_date,
      expected_amount: data.expected_amount,
      paid_amount: data.paid_amount,
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
              options={MONTH_OPTIONS}
              error={errors.month?.message}
            />
          )}
        />
        <Input
          label="תאריך יעד"
          type="date"
          {...register("due_date")}
          error={errors.due_date?.message}
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
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-sm text-blue-600 hover:underline text-right w-full"
                >
                  הצעה לפי מחזור שנה קודמת: ₪{suggestion.suggested_amount.toLocaleString("he-IL")} — לחץ למילוי
                </button>
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
