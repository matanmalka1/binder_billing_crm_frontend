import { useCallback, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ClientPickerField,
  useClientPickerState,
} from "@/components/shared/client";
import { FormField, Input, SelectDropdown } from "@/components/ui/inputs";
import { Modal, ModalFormActions } from "@/components/ui/overlays";
import { useBusinessesForClient } from "@/hooks/useBusinessesForClient";
import { VatPeriodSelect } from "./VatPeriodSelect";
import {
  vatWorkItemCreateDefaultValues,
  vatWorkItemCreateSchema,
  toCreateVatWorkItemPayload,
  type VatWorkItemCreateFormValues,
} from "../schemas/workItem.schema";
import type { VatWorkItemsCreateModalProps } from "../types";

export const VatWorkItemsCreateModal: React.FC<
  VatWorkItemsCreateModalProps
> = ({
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

  const resetClientDependentFields = () => {
    setValue("business_id", "", { shouldDirty: true, shouldValidate: true });
    setValue("period", "", { shouldDirty: true, shouldValidate: true });
  };

  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState({
    onSelect: resetClientDependentFields,
    onClear: resetClientDependentFields,
  });

  const businessIdValue = watch("business_id");
  const periodValue = watch("period");
  const businessId = Number(businessIdValue);

  const { businesses } = useBusinessesForClient({
    clientId: selectedClient?.id,
    enabled: open && initialClientId === undefined,
    onAutoSelect: useCallback(
      (business: { id: number }) =>
        setValue("business_id", String(business.id), { shouldValidate: true }),
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
    resetClientPicker();
    onClose();
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
        <ModalFormActions
          onCancel={handleClose}
          cancelVariant="secondary"
          isLoading={createLoading}
          submitType="submit"
          submitForm="vat-work-items-create-form"
          submitLabel="פתיחת תיק"
        />
      }
    >
      <form
        id="vat-work-items-create-form"
        onSubmit={submitForm}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {initialClientId === undefined && (
            <>
              <div className="col-span-2">
                <ClientPickerField
                  selectedClient={selectedClient}
                  clientQuery={clientQuery}
                  onQueryChange={handleClientQueryChange}
                  onSelect={handleSelectClient}
                  onClear={handleClearClient}
                  label="לקוח *"
                />
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
            onChange={(value) =>
              setValue("period", value, {
                shouldDirty: true,
                shouldValidate: true,
                shouldTouch: true,
              })
            }
            error={errors.period?.message}
            className={colSpanClass}
            enabled={open}
          />
          <input type="hidden" {...register("period")} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600"
            {...register("mark_pending")}
          />
          <span className="text-sm font-medium text-gray-700">
            ממתין לחומרים
          </span>
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
