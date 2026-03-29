import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { FormField } from "../../../components/ui/FormField";
import { SelectDropdown } from "../../../components/ui/SelectDropdown";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import { useBusinessesForClient } from "@/hooks/useBusinessesForClient";
import { VatPeriodSelect } from "./VatPeriodSelect";
import {
  vatWorkItemCreateDefaultValues,
  vatWorkItemCreateSchema,
  toCreateVatWorkItemPayload,
  type VatWorkItemCreateFormValues,
} from "../schemas/workItem.schema";
import type { VatWorkItemsCreateModalProps } from "../types";

export const VatWorkItemsCreateModal: React.FC<VatWorkItemsCreateModalProps> = ({
  open,
  createError,
  createLoading,
  onClose,
  onSubmit,
  initialClientId,
  initialPeriod,
}) => {
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
  } = useForm<VatWorkItemCreateFormValues>({
    defaultValues: vatWorkItemCreateDefaultValues,
    resolver: zodResolver(vatWorkItemCreateSchema),
  });

  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  const businessIdValue = watch("business_id");
  const periodValue = watch("period");
  const businessId = Number(businessIdValue);

  const { businesses } = useBusinessesForClient({
    clientId: selectedClient?.id,
    enabled: open && initialClientId === undefined,
    onAutoSelect: useCallback(
      (biz: { id: number }) => setValue("business_id", String(biz.id), { shouldValidate: true }),
      [setValue],
    ),
  });

  useEffect(() => {
    if (open && initialClientId !== undefined) {
      setValue("business_id", String(initialClientId));
    }
    if (open && initialPeriod) {
      setValue("period", initialPeriod);
    }
  }, [open, initialClientId, initialPeriod, setValue]);

  useEffect(() => {
    if (!open || initialClientId !== undefined) return;
    setValue("period", "");
  }, [open, initialClientId, businessIdValue, setValue]);

  const periodYear = useMemo(() => {
    if (initialPeriod && /^\d{4}-/.test(initialPeriod)) {
      return Number(initialPeriod.slice(0, 4));
    }
    return new Date().getFullYear();
  }, [initialPeriod]);

  const handleClose = () => {
    reset(vatWorkItemCreateDefaultValues);
    setClientQuery("");
    setSelectedClient(null);
    onClose();
  };

  const handleSelectClient = (client: { id: number; name: string }) => {
    setSelectedClient(client);
    setClientQuery(client.name);
    setValue("business_id", "", { shouldDirty: true, shouldValidate: true });
    setValue("period", "", { shouldDirty: true, shouldValidate: true });
  };

  const handleClientQueryChange = (query: string) => {
    setClientQuery(query);
    if (!selectedClient) return;
    setSelectedClient(null);
    setValue("business_id", "", { shouldDirty: true, shouldValidate: true });
    setValue("period", "", { shouldDirty: true, shouldValidate: true });
  };

  const submitForm = handleSubmit(async (values) => {
    const created = await onSubmit(toCreateVatWorkItemPayload(values));
    if (created) handleClose();
  });

  const colSpanClass = initialClientId !== undefined ? "col-span-2" : "";

  return (
    <Modal
      open={open}
      title='פתיחת תיק מע"מ חדש'
      isDirty={isDirty}
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={createLoading}>
            ביטול
          </Button>
          <Button type="button" isLoading={createLoading} onClick={() => void submitForm()}>
            פתיחת תיק
          </Button>
        </div>
      }
    >
      <form onSubmit={submitForm} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {initialClientId === undefined && (
            <>
              <div className="col-span-2">
                {selectedClient ? (
                  <SelectedClientDisplay
                    name={selectedClient.name}
                    id={selectedClient.id}
                    onClear={() => handleClientQueryChange("")}
                    label="לקוח *"
                  />
                ) : (
                  <ClientSearchInput
                    label="לקוח *"
                    placeholder='חפש לפי שם, ת"ז / ח.פ...'
                    value={clientQuery}
                    onChange={handleClientQueryChange}
                    onSelect={handleSelectClient}
                  />
                )}
              </div>
              <FormField label="עסק *" error={errors.business_id?.message}>
                <SelectDropdown
                  value={businessIdValue}
                  onChange={(e) =>
                    setValue("business_id", e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                      shouldTouch: true,
                    })
                  }
                  options={[
                    {
                      value: "",
                      label: selectedClient ? "בחר עסק..." : "בחר קודם לקוח",
                    },
                    ...businesses.map((business) => ({
                      value: String(business.id),
                      label: business.business_name ?? `עסק #${business.id}`,
                    })),
                  ]}
                  disabled={!selectedClient}
                />
              </FormField>
              <input type="hidden" {...register("business_id")} />
            </>
          )}
          <VatPeriodSelect
            businessId={businessId}
            year={periodYear}
            value={periodValue}
            onChange={(v) => setValue("period", v, { shouldDirty: true, shouldValidate: true, shouldTouch: true })}
            error={errors.period?.message}
            className={colSpanClass}
            enabled={open}
          />
          <input type="hidden" {...register("period")} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600"
            {...register("mark_pending")}
          />
          <span className="text-sm font-medium text-gray-700">ממתין לחומרים</span>
        </label>

        {watch("mark_pending") && (
          <Input
            label="הערה לחומרים חסרים"
            placeholder="פרט אילו מסמכים חסרים..."
            error={errors.pending_materials_note?.message}
            {...register("pending_materials_note")}
          />
        )}

        {createError && <p className="text-sm text-red-600">{createError}</p>}
      </form>
    </Modal>
  );
};

VatWorkItemsCreateModal.displayName = "VatWorkItemsCreateModal";
