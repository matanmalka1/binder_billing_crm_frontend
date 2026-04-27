import { useState } from "react";
import { EXPENSE_LABELS } from "../../report.constants";
import {
  DEFAULT_RECOGNITION_RATE,
  FIELD_PLACEHOLDERS,
} from "./financialConstants";
import {
  ExpenseSupplementaryFields,
  FinancialAddFormShell,
  FinancialAmountDescriptionFields,
  FinancialSelectField,
} from "./FinancialLineFormParts";
import { buildExpensePayload, type AddExpensePayload } from "./financialHelpers";

interface AddExpenseLineFormProps {
  onAdd: (payload: AddExpensePayload) => void;
  isAdding: boolean;
}

export const AddExpenseLineForm: React.FC<AddExpenseLineFormProps> = ({
  onAdd,
  isAdding,
}) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recognitionRate, setRecognitionRate] = useState(DEFAULT_RECOGNITION_RATE);
  const [docRef, setDocRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategory("");
    setAmount("");
    setDescription("");
    setRecognitionRate(DEFAULT_RECOGNITION_RATE);
    setDocRef("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { payload, error: validationError } = buildExpensePayload(
      category,
      amount,
      description,
      recognitionRate,
      docRef,
    );

    if (!payload) return setError(validationError ?? null);

    onAdd(payload);
    reset();
    setOpen(false);
  };

  return (
    <FinancialAddFormShell
      open={open}
      label="הוסף הוצאה"
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
        value={category}
        onChange={setCategory}
        options={EXPENSE_LABELS}
        placeholder={FIELD_PLACEHOLDERS.expenseCategory}
      />
      <FinancialAmountDescriptionFields
        amount={amount}
        onAmountChange={setAmount}
        description={description}
        onDescriptionChange={setDescription}
      />
      <ExpenseSupplementaryFields
        recognitionRate={recognitionRate}
        onRecognitionRateChange={setRecognitionRate}
        documentReference={docRef}
        onDocumentReferenceChange={setDocRef}
      />
    </FinancialAddFormShell>
  );
};
