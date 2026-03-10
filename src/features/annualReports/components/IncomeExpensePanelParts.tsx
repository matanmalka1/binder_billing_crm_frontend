import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export interface AddLineFormProps {
  typeOptions: Record<string, string>;
  onAdd: (typeKey: string, amount: number, description?: string) => void;
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
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError("יש להזין סכום חיובי");
      return;
    }
    onAdd(typeKey, parsed, description || undefined);
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
        {label}
      </Button>
    );

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      <select
        value={typeKey}
        onChange={(e) => setTypeKey(e.target.value)}
        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
      >
        <option value="" disabled>
          בחר סוג...
        </option>
        {Object.entries(typeOptions).map(([key, lbl]) => (
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
