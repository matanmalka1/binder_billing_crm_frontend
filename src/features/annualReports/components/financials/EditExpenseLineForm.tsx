import { useState } from "react";
import type { ExpenseLineResponse, ExpenseCategoryType } from "../../api";
import { EXPENSE_LABELS } from "../../report.constants";
import { DEFAULT_RECOGNITION_RATE } from "./financialConstants";
import {
  ExpenseSupplementaryFields,
  FinancialAmountDescriptionFields,
  FinancialEditFormShell,
  FinancialSelectField,
} from "./FinancialLineFormParts";
import { buildExpensePayload } from "./financialHelpers";

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
  const [recognitionRate, setRecognitionRate] = useState(
    String(line.recognition_rate ?? DEFAULT_RECOGNITION_RATE),
  );
  const [docRef, setDocRef] = useState(line.supporting_document_ref ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { payload, error: validationError } = buildExpensePayload(
      category,
      amount,
      description,
      recognitionRate,
      docRef,
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
