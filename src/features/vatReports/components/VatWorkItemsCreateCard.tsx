import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import type { CreateVatWorkItemPayload } from "../../../api/vatReports.api";
import {
  vatWorkItemCreateDefaultValues,
  vatWorkItemCreateSchema,
  toCreateVatWorkItemPayload,
  type VatWorkItemCreateFormValues,
} from "../schemas";

interface VatWorkItemsCreateCardProps {
  createError: string | null;
  createLoading: boolean;
  onSubmit: (payload: CreateVatWorkItemPayload) => Promise<boolean>;
}

export const VatWorkItemsCreateCard = ({
  createError,
  createLoading,
  onSubmit,
}: VatWorkItemsCreateCardProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<VatWorkItemCreateFormValues>({
    defaultValues: vatWorkItemCreateDefaultValues,
    resolver: zodResolver(vatWorkItemCreateSchema),
  });

  const markPending = watch("mark_pending");

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateVatWorkItemPayload(values));
    if (created) {
      reset(vatWorkItemCreateDefaultValues);
    }
  });

  return (
    <Card title='פתיחת תיק מע"מ חדש' subtitle="מלא את הפרטים ליצירת תיק מע״מ לתקופה">
      <form onSubmit={submitForm} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="מזהה לקוח *"
            type="number"
            min={1}
            placeholder="123"
            error={errors.client_id?.message}
            {...register("client_id")}
          />
          <Input
            label="תקופה (YYYY-MM) *"
            placeholder="2026-02"
            error={errors.period?.message}
            {...register("period")}
          />
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
                {...register("mark_pending")}
              />
              <span className="text-sm font-medium text-gray-700">ממתין לחומרים</span>
            </label>
          </div>
          {markPending && (
            <Input
              label="הערה לחומרים חסרים"
              placeholder="פרט אילו מסמכים חסרים..."
              error={errors.pending_materials_note?.message}
              {...register("pending_materials_note")}
            />
          )}
        </div>

        {createError && (
          <p className="text-sm text-red-600">{createError}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" isLoading={createLoading}>
            פתיחת תיק
          </Button>
        </div>
      </form>
    </Card>
  );
};

VatWorkItemsCreateCard.displayName = "VatWorkItemsCreateCard";
