import { useEffect, useState, type ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import type { ReceiveBinderFormValues } from "../schemas";
import type { BinderResponse } from "../types";

interface BinderNumberFieldProps {
  form: UseFormReturn<ReceiveBinderFormValues>;
  selectedClient: { id: number; name: string; client_status?: string | null } | null;
  clientBinders: BinderResponse[];
  allBinders: BinderResponse[];
  onBinderSelect: (binderNumber: string, clientId: number, clientName: string, clientStatus: string | null) => void;
}

export const BinderNumberField: React.FC<BinderNumberFieldProps> = ({
  form,
  selectedClient,
  clientBinders,
  allBinders,
  onBinderSelect,
}) => {
  const [isNewMode, setIsNewMode] = useState(false);

  const {
    setValue,
    formState: { errors },
  } = form;
  const binderNumber = form.watch("binder_number") ?? "";

  useEffect(() => {
    setIsNewMode(false);
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient && clientBinders.length === 1 && !isNewMode) {
      setValue("binder_number", clientBinders[0].binder_number, { shouldValidate: true });
    }
  }, [selectedClient, clientBinders, setValue, isNewMode]);

  const handleEnableNewBinder = () => {
    setValue("binder_number", "", { shouldValidate: false });
    setIsNewMode(true);
  };

  const handleBackToSelection = () => {
    setIsNewMode(false);
    setValue("binder_number", "", { shouldValidate: false });
  };

  const handleClientBindersChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue("binder_number", event.target.value, { shouldValidate: true });
  };

  const handleAllBindersChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextBinderNumber = event.target.value;
    const picked = allBinders.find((b) => b.binder_number === nextBinderNumber);
    if (picked) {
      onBinderSelect(nextBinderNumber, picked.client_id, picked.client_name ?? "", null);
    } else {
      setValue("binder_number", nextBinderNumber, { shouldValidate: true });
    }
  };

  if (selectedClient && clientBinders.length === 0) {
    return (
      <Input
        label="מספר קלסר"
        error={errors.binder_number?.message}
        placeholder="לדוגמה: 2024-003"
        value={binderNumber}
        onChange={(e) => setValue("binder_number", e.target.value, { shouldValidate: true })}
      />
    );
  }

  if (selectedClient && isNewMode) {
    return (
      <div className="space-y-2" dir="rtl">
        <Input
          label="מספר קלסר"
          error={errors.binder_number?.message}
          placeholder="לדוגמה: 2024-003"
          value={binderNumber}
          onChange={(e) => setValue("binder_number", e.target.value, { shouldValidate: true })}
        />
        <Button type="button" variant="ghost" size="sm" onClick={handleBackToSelection}>
          חזור לבחירה
        </Button>
      </div>
    );
  }

  if (selectedClient && clientBinders.length === 1) {
    return (
      <div className="space-y-2" dir="rtl">
        <p className="text-sm font-medium text-gray-700">מספר קלסר</p>
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900">
          {clientBinders[0].binder_number}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={handleEnableNewBinder}>
          פתח קלסר חדש
        </Button>
      </div>
    );
  }

  if (selectedClient && clientBinders.length > 1) {
    return (
      <div className="space-y-2" dir="rtl">
        <Select
          label="מספר קלסר"
          error={errors.binder_number?.message}
          value={binderNumber}
          onChange={handleClientBindersChange}
          options={[
            { value: "", label: "בחר קלסר..." },
            ...clientBinders.map((binder) => ({ value: binder.binder_number, label: binder.binder_number })),
          ]}
        />
        <Button type="button" variant="ghost" size="sm" onClick={handleEnableNewBinder}>
          פתח קלסר חדש
        </Button>
      </div>
    );
  }

  return (
    <Select
      label="מספר קלסר"
      error={errors.binder_number?.message}
      value={binderNumber}
      onChange={handleAllBindersChange}
      options={[
        { value: "", label: "בחר קלסר מהמשרד..." },
        ...allBinders.map((binder) => ({
          value: binder.binder_number,
          label: `${binder.binder_number}${binder.client_name ? ` — ${binder.client_name}` : ""}`,
        })),
      ]}
    />
  );
};

BinderNumberField.displayName = "BinderNumberField";
