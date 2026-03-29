import { useState } from "react";
import type { ExpenseCategoryType } from "../../api";
import { EXPENSE_LABELS } from "../../report.constants";
import {
  ExpenseSupplementaryFields,
  FinancialAddFormShell,
  FinancialAmountDescriptionFields,
  FinancialSelectField,
  validatePercentage,
  validatePositiveAmount,
} from "./FinancialLineFormParts";

export interface AddExpensePayload {
  category: ExpenseCategoryType;
  amount: string;
  description?: string;
  recognition_rate?: string;
  supporting_document_ref?: string;
}

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
  const [recognitionRate, setRecognitionRate] = useState("100");
  const [docRef, setDocRef] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategory("");
    setAmount("");
    setDescription("");
    setRecognitionRate("100");
    setDocRef("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      setError("יש לבחור קטגוריה");
      return;
    }
    const parsed = validatePositiveAmount(amount);
    if (parsed == null) {
      setError("יש להזין סכום חיובי");
      return;
    }
    const rate = validatePercentage(recognitionRate);
    if (rate == null) {
      setError("שיעור הכרה חייב להיות בין 0 ל-100");
      return;
    }
    onAdd({
      category: category as ExpenseCategoryType,
      amount: String(parsed),
      description: description || undefined,
      recognition_rate: String(rate),
      supporting_document_ref: docRef || undefined,
    });
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
        placeholder="בחר קטגוריה..."
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
