import { useMemo, useState } from "react";
import type { AnnualReportScheduleKey, ScheduleEntry } from "../../api";
import { getScheduleLabel } from "../../api";
import { Button } from "../../../../components/ui/primitives/Button";
import { Input } from "../../../../components/ui/inputs/Input";
import { Select } from "../../../../components/ui/inputs/Select";
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
      <Select
        value={selected}
        onChange={(event) => setSelected(event.target.value as AnnualReportScheduleKey | "")}
        options={[
          { value: "", label: "בחר נספח...", disabled: true },
          ...available.map((key) => ({ value: key, label: getScheduleLabel(key) })),
        ]}
      />
      <Input
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        type="text"
        placeholder="הערות (אופציונלי)"
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
