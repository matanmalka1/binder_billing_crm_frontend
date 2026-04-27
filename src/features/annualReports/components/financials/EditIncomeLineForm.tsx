import { useState } from "react";
import type { IncomeLineResponse, IncomeSourceType } from "../../api";
import {
  FinancialAmountDescriptionFields,
  FinancialEditFormShell,
  FinancialSelectField,
} from "./FinancialLineFormParts";
import { buildIncomePayload, type IncomeFormPayload } from "./financialHelpers";

interface EditIncomeLineFormProps {
  line: IncomeLineResponse;
  typeOptions: Record<string, string>;
  isSaving: boolean;
  onSave: (payload: IncomeFormPayload) => void;
  onCancel: () => void;
}

export const EditIncomeLineForm: React.FC<EditIncomeLineFormProps> = ({
  line,
  typeOptions,
  isSaving,
  onSave,
  onCancel,
}) => {
  const [typeKey, setTypeKey] = useState<IncomeSourceType>(line.source_type);
  const [amount, setAmount] = useState(String(line.amount));
  const [description, setDescription] = useState(line.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { payload, error: validationError } = buildIncomePayload(
      typeKey,
      amount,
      description,
    );

    if (!payload) return setError(validationError ?? null);

    onSave(payload);
  };

  return (
    <FinancialEditFormShell
      error={error}
      isSubmitting={isSaving}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FinancialSelectField
        value={typeKey}
        onChange={(value) => setTypeKey(value as IncomeSourceType)}
        options={typeOptions}
      />
      <FinancialAmountDescriptionFields
        amount={amount}
        onAmountChange={setAmount}
        description={description}
        onDescriptionChange={setDescription}
      />
    </FinancialEditFormShell>
  );
};

EditIncomeLineForm.displayName = "EditIncomeLineForm";
