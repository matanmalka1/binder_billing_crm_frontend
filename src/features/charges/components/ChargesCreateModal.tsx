import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Input } from "../../../components/ui/inputs/Input";
import { ModalFormActions } from "../../../components/ui/overlays/ModalFormActions";
import { FormField } from "../../../components/ui/inputs/FormField";
import { SelectDropdown } from "../../../components/ui/inputs/SelectDropdown";
import { ClientPickerField } from "@/components/shared/client";
import type { CreateChargePayload } from "../api";
import { CHARGE_TYPE_OPTIONS } from "../constants";
import {
  chargeCreateDefaultValues,
  chargeCreateSchema,
  toCreateChargePayload,
  type ChargeCreateFormValues,
} from "../schemas";
import { getChargePeriodLabel } from "../utils";

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
  const currencySuffix = <span className="text-sm text-gray-400">₪</span>;

  const {
    formState: { errors, isDirty },
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ChargeCreateFormValues>({
    defaultValues: chargeCreateDefaultValues,
    resolver: zodResolver(chargeCreateSchema),
  });

  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const monthsCovered = watch("months_covered") ?? 1;

  const periodOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [{ value: "", label: "ללא תקופה" }];
    for (const year of [currentYear - 1, currentYear, currentYear + 1]) {
      for (let month = 0; month < 12; month += 1) {
        const value = `${year}-${String(month + 1).padStart(2, "0")}`;
        options.push({
          value,
          label: getChargePeriodLabel(value, monthsCovered),
        });
      }
    }
    return options;
  }, [monthsCovered]);

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
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={() => void submitForm()}
          cancelVariant="secondary"
          cancelDisabled={createLoading}
          submitLabel="יצירת חיוב"
          submitLoading={createLoading}
        />
      }
    >
      <form id="charges-create-form" onSubmit={submitForm} className="space-y-4">
        <input type="hidden" {...register("client_id")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="col-span-2">
            <ClientPickerField
              selectedClient={selectedClient}
              clientQuery={clientQuery}
              onQueryChange={handleClientQueryChange}
              onSelect={handleSelectClient}
              onClear={handleClearClient}
              error={errors.client_id?.message}
              label="לקוח *"
            />
          </div>
          <Input
            label="סכום *"
            type="number"
            min={0.01}
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            endElement={currencySuffix}
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
            name="months_covered"
            render={({ field }) => (
              <FormField label="תדירות" error={errors.months_covered?.message}>
                <SelectDropdown
                  value={String(field.value ?? 1)}
                  onChange={(e) => field.onChange(Number(e.target.value) as 1 | 2)}
                  onBlur={field.onBlur}
                  name={field.name}
                  options={[
                    { value: "1", label: "חודשי" },
                    { value: "2", label: "דו-חודשי" },
                  ]}
                />
              </FormField>
            )}
          />
          <Controller
            control={control}
            name="period"
            render={({ field }) => (
              <FormField label="תקופה" error={errors.period?.message}>
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
