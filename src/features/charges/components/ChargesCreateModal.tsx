import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FormField } from "../../../components/ui/FormField";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import { MONTH_NAMES } from "../../../utils/utils";
import type { CreateChargePayload } from "../api";
import { CHARGE_TYPE_OPTIONS } from "../constants";
import {
  chargeCreateDefaultValues,
  chargeCreateSchema,
  toCreateChargePayload,
  type ChargeCreateFormValues,
} from "../schemas";

interface ChargesCreateModalProps {
  open: boolean;
  createError: string | null;
  createLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateChargePayload) => Promise<boolean>;
}

export const ChargesCreateModal: React.FC<ChargesCreateModalProps> = ({
  open,
  createError,
  createLoading,
  onClose,
  onSubmit,
}) => {
  const {
    formState: { errors, isDirty },
    handleSubmit,
    control,
    register,
    reset,
    setValue,
  } = useForm<ChargeCreateFormValues>({
    defaultValues: chargeCreateDefaultValues,
    resolver: zodResolver(chargeCreateSchema),
  });

  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const periodOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const opts = [{ value: "", label: "ללא תקופה" }];
    for (const year of [currentYear - 1, currentYear, currentYear + 1]) {
      for (let m = 0; m < 12; m++) {
        opts.push({
          value: `${year}-${String(m + 1).padStart(2, "0")}`,
          label: `${MONTH_NAMES[m]} ${year}`,
        });
      }
    }
    return opts;
  }, []);

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    setValue("client_id", String(client.id), { shouldValidate: true, shouldDirty: true });
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setClientQuery("");
    setValue("client_id", "", { shouldDirty: true, shouldValidate: true });
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (selectedClient) {
      setSelectedClient(null);
      setValue("client_id", "", { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleClose = () => {
    reset(chargeCreateDefaultValues);
    setClientQuery("");
    setSelectedClient(null);
    onClose();
  };

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateChargePayload(values));
    if (created) {
      reset(chargeCreateDefaultValues);
      setClientQuery("");
      setSelectedClient(null);
      onClose();
    }
  });

  return (
    <Modal
      open={open}
      title="יצירת חיוב חדש"
      isDirty={isDirty}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={createLoading}>
            ביטול
          </Button>
          <Button type="button" isLoading={createLoading} onClick={() => void submitForm()}>
            יצירת חיוב
          </Button>
        </div>
      }
    >
      <form id="charges-create-form" onSubmit={submitForm} className="space-y-4">
        <input type="hidden" {...register("client_id")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="col-span-2">
            {selectedClient ? (
              <SelectedClientDisplay
                name={selectedClient.name}
                id={selectedClient.id}
                onClear={handleClearClient}
                label="לקוח *"
              />
            ) : (
              <ClientSearchInput
                label="לקוח *"
                placeholder='חפש לפי שם, ת"ז / ח.פ...'
                value={clientQuery}
                onChange={handleClientQueryChange}
                onSelect={handleSelectClient}
                error={errors.client_id?.message}
              />
            )}
          </div>
          <Input
            label="סכום *"
            type="number"
            min={0.01}
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount")}
          />
          <Controller
            control={control}
            name="charge_type"
            render={({ field }) => (
              <FormField label="סוג חיוב *" error={errors.charge_type?.message}>
                <SelectDropdown
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  options={CHARGE_TYPE_OPTIONS}
                  className={errors.charge_type ? "border-red-500" : undefined}
                />
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="period"
            render={({ field }) => (
              <FormField label="תקופה" error={errors.period?.message} className="col-span-2">
                <SelectDropdown
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  options={periodOptions}
                />
              </FormField>
            )}
          />
        </div>

        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>
    </Modal>
  );
};

ChargesCreateModal.displayName = "ChargesCreateModal";
