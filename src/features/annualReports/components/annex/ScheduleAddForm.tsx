import { useMemo, useState } from "react";
import type { AnnualReportScheduleKey, ScheduleEntry } from "../../api";
import { getScheduleLabel } from "../../api";
import { Button } from "../../../../components/ui/primitives/Button";
import { ALL_SCHEDULES } from "../../annex.constants";

interface ScheduleAddFormProps {
  schedules: ScheduleEntry[];
  onAdd: (schedule: AnnualReportScheduleKey, notes?: string) => void;
  isAdding: boolean;
}

export const ScheduleAddForm: React.FC<ScheduleAddFormProps> = ({ schedules, onAdd, isAdding }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AnnualReportScheduleKey | "">("");
  const [notes, setNotes] = useState("");

  const available = useMemo(() => {
    const existing = new Set(schedules.map((entry) => entry.schedule));
    return ALL_SCHEDULES.filter((key) => !existing.has(key));
  }, [schedules]);

  const handleOpen = () => {
    setOpen(true);
    setSelected("");
    setNotes("");
  };

  const handleCancel = () => {
    setOpen(false);
    setSelected("");
    setNotes("");
  };

  const handleAdd = () => {
    if (!selected) return;
    onAdd(selected, notes.trim() || undefined);
    handleCancel();
  };

  if (available.length === 0) {
    return <p className="text-xs text-gray-500">כל סוגי הנספחים כבר קיימים בדוח</p>;
  }

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={handleOpen}>
        הוסף נספח
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
      <p className="text-xs font-medium text-gray-600">הוספת נספח ידנית</p>
      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value as AnnualReportScheduleKey | "")}
        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
      >
        <option value="">בחר נספח...</option>
        {available.map((key) => (
          <option key={key} value={key}>
            {getScheduleLabel(key)}
          </option>
        ))}
      </select>
      <input
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        type="text"
        placeholder="הערות (אופציונלי)"
        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
      />
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
          ביטול
        </Button>
        <Button type="button" size="sm" onClick={handleAdd} isLoading={isAdding} disabled={!selected}>
          הוסף
        </Button>
      </div>
    </div>
  );
};

ScheduleAddForm.displayName = "ScheduleAddForm";
