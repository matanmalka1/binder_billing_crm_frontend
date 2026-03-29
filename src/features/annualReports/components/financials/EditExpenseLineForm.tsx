import { useState } from "react";
import type { ExpenseLineResponse, ExpenseCategoryType } from "../../api";
import { EXPENSE_LABELS } from "../../report.constants";
import {
  ExpenseSupplementaryFields,
  FinancialAmountDescriptionFields,
  FinancialEditFormShell,
  FinancialSelectField,
  validatePercentage,
  validatePositiveAmount,
} from "./FinancialLineFormParts";

interface EditExpenseLineFormProps {
  line: ExpenseLineResponse;
  isSaving: boolean;
  onSave: (payload: {
    category: ExpenseCategoryType;
    amount: string;
    description?: string;
    recognition_rate?: string;
    supporting_document_ref?: string;
  }) => void;
  onCancel: () => void;
}

export const EditExpenseLineForm: React.FC<EditExpenseLineFormProps> = ({
  line,
  isSaving,
  onSave,
  onCancel,
}) => {
  const [category, setCategory] = useState<ExpenseCategoryType>(line.category);
  const [amount, setAmount] = useState(String(line.amount));
  const [description, setDescription] = useState(line.description ?? "");
  const [recognitionRate, setRecognitionRate] = useState(String(line.recognition_rate ?? 100));
  const [docRef, setDocRef] = useState(line.supporting_document_ref ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
    onSave({
      category: category as ExpenseCategoryType,
      amount: String(parsed),
      description: description || undefined,
      recognition_rate: String(rate),
      supporting_document_ref: docRef || undefined,
    });
  };

  return (
    <FinancialEditFormShell
      error={error}
      isSubmitting={isSaving}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <FinancialSelectField
        value={category}
        onChange={(value) => setCategory(value as ExpenseCategoryType)}
        options={EXPENSE_LABELS}
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
    </FinancialEditFormShell>
  );
};

EditExpenseLineForm.displayName = "EditExpenseLineForm";
