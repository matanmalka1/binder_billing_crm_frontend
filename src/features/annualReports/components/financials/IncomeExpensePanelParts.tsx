import { useState } from "react";
import {
  FinancialAddFormShell,
  FinancialAmountDescriptionFields,
  FinancialSelectField,
} from "./FinancialLineFormParts";
import { validatePositiveAmount } from "./financialValidators";

export interface AddLineFormProps {
  typeOptions: Record<string, string>;
  onAdd: (typeKey: string, amount: string, description?: string) => void;
  isAdding: boolean;
  label: string;
}

export const AddLineForm: React.FC<AddLineFormProps> = ({
  typeOptions,
  onAdd,
  isAdding,
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [typeKey, setTypeKey] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTypeKey("");
    setAmount("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeKey) {
      setError("יש לבחור סוג");
      return;
    }
    const parsed = validatePositiveAmount(amount);
    if (parsed == null) {
      setError("יש להזין סכום חיובי");
      return;
    }
    onAdd(typeKey, String(parsed), description || undefined);
    reset();
    setOpen(false);
  };

  return (
    <FinancialAddFormShell
      open={open}
      label={label}
      error={error}
      isSubmitting={isAdding}
      onOpen={() => setOpen(true)}
      onSubmit={handleSubmit}
      onCancel={() => {
        reset();
        setOpen(false);
      }}
    >
      <FinancialSelectField
        value={typeKey}
        onChange={setTypeKey}
        options={typeOptions}
        placeholder="בחר סוג..."
      />
      <FinancialAmountDescriptionFields
        amount={amount}
        onAmountChange={setAmount}
        description={description}
        onDescriptionChange={setDescription}
      />
    </FinancialAddFormShell>
  );
};
