import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { CreateChargePayload } from "../../../api/charges.api";
import {
  chargeCreateDefaultValues,
  chargeCreateSchema,
  toCreateChargePayload,
  type ChargeCreateFormValues,
} from "../schemas";

interface ChargesCreateCardProps {
  createError: string | null;
  createLoading: boolean;
  onSubmit: (payload: CreateChargePayload) => Promise<boolean>;
}

ChargesCreateCard.displayName = "ChargesCreateCard";

const CHARGE_TYPE_OPTIONS = [
  { value: "one_time", label: "חד פעמי" },
  { value: "retainer", label: "ריטיינר" },
];

export function ChargesCreateCard({
  createError,
  createLoading,
  onSubmit,
}: ChargesCreateCardProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ChargeCreateFormValues>({
    defaultValues: chargeCreateDefaultValues,
    resolver: zodResolver(chargeCreateSchema),
  });

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateChargePayload(values));
    if (created) {
      reset(chargeCreateDefaultValues);
    }
  });

  return (
    <Card title="יצירת חיוב חדש" subtitle="מלא את הפרטים הבאים ליצירת חיוב">
      <form onSubmit={submitForm} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="מזהה לקוח *"
            type="number"
            min={1}
            placeholder="123"
            error={errors.client_id?.message}
            {...register("client_id")}
          />
          <Input
            label="סכום *"
            type="number"
            min={0.01}
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
          <Select
            label="סוג חיוב *"
            error={errors.charge_type?.message}
            options={CHARGE_TYPE_OPTIONS}
            {...register("charge_type")}
          />
          <Input
            label="תקופה (YYYY-MM)"
            placeholder="2026-02"
            error={errors.period?.message}
            {...register("period")}
          />
          <Input
            label="מטבע *"
            placeholder="ILS"
            error={errors.currency?.message}
            {...register("currency")}
          />
        </div>

        {createError && (
          <p className="text-sm text-red-600">{createError}</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" isLoading={createLoading}>
            יצירת חיוב
          </Button>
        </div>
      </form>
    </Card>
  );
}