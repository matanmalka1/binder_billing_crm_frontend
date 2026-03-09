import { useState } from "react";
import { Plus } from "lucide-react";
import type { ExpenseCategoryType } from "../../../api/annualReports.api";
import { Button } from "../../../components/ui/Button";
import { EXPENSE_LABELS } from "./IncomeExpensePanelParts";

export interface AddExpensePayload {
  category: ExpenseCategoryType;
  amount: number;
  description?: string;
  recognition_rate?: number;
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
    onAdd({
      category: category as ExpenseCategoryType,
      amount: parsed,
      description: description || undefined,
      recognition_rate: rate,
      supporting_document_ref: docRef || undefined,
    });
    reset();
    setOpen(false);
  };

  if (!open)
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1 text-xs mt-1"
      >
        <Plus className="h-3.5 w-3.5" />
        הוסף הוצאה
      </Button>
    );

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
      >
        <option value="" disabled>
          בחר קטגוריה...
        </option>
        {Object.entries(EXPENSE_LABELS).map(([key, lbl]) => (
          <option key={key} value={key}>
            {lbl}
          </option>
        ))}
      </select>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        min="0"
        step="0.01"
        placeholder="סכום ₪"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="תיאור (אופציונלי)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={recognitionRate}
        onChange={(e) => setRecognitionRate(e.target.value)}
        type="number"
        min="0"
        max="100"
        step="1"
        placeholder="שיעור הכרה (%)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      <input
        value={docRef}
        onChange={(e) => setDocRef(e.target.value)}
        type="text"
        placeholder="אסמכתא (אופציונלי)"
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={isAdding} className="flex-1">
          הוסף
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          ביטול
        </Button>
      </div>
    </form>
  );
};
