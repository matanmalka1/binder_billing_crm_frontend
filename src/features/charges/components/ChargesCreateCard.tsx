import React from "react";
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

export const ChargesCreateCard: React.FC<ChargesCreateCardProps> = ({
  createError,
  createLoading,
  onSubmit,
}) => {
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
    <Card title="יצירת חיוב חדש">
      <form onSubmit={submitForm} className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <Input
          label="מזהה לקוח"
          type="number"
          min={1}
          error={errors.client_id?.message}
          {...register("client_id")}
        />
        <Input
          label="סכום"
          type="number"
          min={0.01}
          step="0.01"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <Select label="סוג חיוב" error={errors.charge_type?.message} {...register("charge_type")}>
          <option value="one_time">חד פעמי</option>
          <option value="retainer">ריטיינר</option>
        </Select>
        <Input
          label="תקופה (YYYY-MM)"
          placeholder="2026-02"
          error={errors.period?.message}
          {...register("period")}
        />
        <Input label="מטבע" error={errors.currency?.message} {...register("currency")} />
        {createError && <p className="text-sm text-red-600 md:col-span-5">{createError}</p>}
        <div className="md:col-span-5">
          <Button type="submit" isLoading={createLoading}>
            יצירת חיוב
          </Button>
        </div>
      </form>
    </Card>
  );
};
