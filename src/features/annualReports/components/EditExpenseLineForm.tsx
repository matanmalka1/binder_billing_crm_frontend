import { useState } from "react";
import type { ExpenseLineResponse, ExpenseCategoryType } from "../../../api/annualReports.api";
import { Button } from "../../../components/ui/Button";
import { EXPENSE_LABELS } from "../constants";

interface EditExpenseLineFormProps {
  line: ExpenseLineResponse;
  isSaving: boolean;
  onSave: (payload: {
    category: ExpenseCategoryType;
    amount: number;
    description?: string;
    recognition_rate?: number;
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
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("יש להזין סכום חיובי");
      return;
    }
    const rate = parseFloat(recognitionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError("שיעור הכרה חייב להיות בין 0 ל-100");
      return;
    }
    onSave({
      category: category as ExpenseCategoryType,
      amount: parsed,
      description: description || undefined,
      recognition_rate: rate,
      supporting_document_ref: docRef || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-2 rounded-md border border-blue-100 bg-blue-50/30 p-2 space-y-2">
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value as ExpenseCategoryType)}
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
      >
        {Object.entries(EXPENSE_LABELS).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        type="number"
        min="0"
        step="0.01"
        placeholder="סכום ₪"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        type="text"
        placeholder="תיאור (אופציונלי)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={recognitionRate}
        onChange={(event) => setRecognitionRate(event.target.value)}
        type="number"
        min="0"
        max="100"
        step="1"
        placeholder="שיעור הכרה (%)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={docRef}
        onChange={(event) => setDocRef(event.target.value)}
        type="text"
        placeholder="אסמכתא (אופציונלי)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={isSaving} className="flex-1">
          שמור
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          ביטול
        </Button>
      </div>
    </form>
  );
};

EditExpenseLineForm.displayName = "EditExpenseLineForm";
