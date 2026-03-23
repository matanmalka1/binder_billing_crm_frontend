import { useState } from "react";
import type { IncomeLineResponse, IncomeSourceType } from "../../api";
import { Button } from "../../../../components/ui/Button";

interface EditIncomeLineFormProps {
  line: IncomeLineResponse;
  typeOptions: Record<string, string>;
  isSaving: boolean;
  onSave: (payload: { source_type: IncomeSourceType; amount: number; description?: string }) => void;
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
    if (!typeKey) {
      setError("יש לבחור סוג");
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("יש להזין סכום חיובי");
      return;
    }
    onSave({ source_type: typeKey, amount: parsed, description: description || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 mb-2 rounded-md border border-blue-100 bg-blue-50/30 p-2 space-y-2">
      <select
        value={typeKey}
        onChange={(event) => setTypeKey(event.target.value as IncomeSourceType)}
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
      >
        {Object.entries(typeOptions).map(([key, label]) => (
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

EditIncomeLineForm.displayName = "EditIncomeLineForm";
