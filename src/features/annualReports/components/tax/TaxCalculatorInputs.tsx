import { useState } from "react";
import { Pencil, X, Check, Info } from "lucide-react";
import { Input } from "../../../../components/ui/inputs/Input";

interface TaxCalculatorInputsProps {
  creditPoints: string;
  pension: string;
  otherCredits: string;
  onCreditPointsChange: (v: string) => void;
  onPensionChange: (v: string) => void;
  onOtherCreditsChange: (v: string) => void;
  onSave: () => void;
  onEditInit: () => void;
  isSaving: boolean;
}

export const TaxCalculatorInputs = ({
  creditPoints, pension, otherCredits,
  onCreditPointsChange, onPensionChange, onOtherCreditsChange,
  onSave, onEditInit, isSaving,
}: TaxCalculatorInputsProps) => {
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => { onEditInit(); setEditMode(true); };
  const handleSave = () => { onSave(); setEditMode(false); };
  const handleCancel = () => setEditMode(false);

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-px" />
          <p className="text-xs text-amber-700">המחשבון מציג שיעורי מס עפ"י מדרגות מס לעסק יחיד/שותפות.</p>
        </div>
        {!editMode ? (
          <button type="button" onClick={handleEdit}
            className="flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 shrink-0">
            <Pencil className="h-3 w-3" /> עריכה
          </button>
        ) : (
          <div className="flex gap-1 shrink-0">
            <button type="button" onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-1 rounded-md bg-amber-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50">
              <Check className="h-3 w-3" /> שמור
            </button>
            <button type="button" onClick={handleCancel}
              className="flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-700">
              <X className="h-3 w-3" /> ביטול
            </button>
          </div>
        )}
      </div>
      {editMode && (
        <div className="grid grid-cols-2 gap-3">
          <Input label="נקודות זיכוי" type="number" step="0.25" value={creditPoints}
            onChange={(e) => onCreditPointsChange(e.target.value)} />
          <Input label={'הפקדות פנסיה/קה"ש (₪)'} type="number" value={pension}
            onChange={(e) => onPensionChange(e.target.value)} />
          <Input label="זיכויים אחרים (₪)" type="number" value={otherCredits}
            onChange={(e) => onOtherCreditsChange(e.target.value)} className="col-span-2" />
        </div>
      )}
    </div>
  );
};

TaxCalculatorInputs.displayName = "TaxCalculatorInputs";
