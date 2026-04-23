import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/inputs/DatePicker";
import { Input } from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/Select";
import { Textarea } from "@/components/ui/inputs/Textarea";
import { Button } from "@/components/ui/primitives/Button";
import { Checkbox } from "@/components/ui/primitives/Checkbox";
import { bindersApi, bindersQK } from "../../api";
import { formatMonthYear, buildYearOptions } from "@/utils/utils";

interface BinderHandoverPanelProps {
  clientId: number;
  initialBinderId: number;
  isSubmitting: boolean;
  onSubmit: (payload: {
    binderIds: number[];
    receivedByName: string;
    handedOverAt: string;
    untilPeriodYear: number;
    untilPeriodMonth: number;
    notes: string | null;
  }) => void;
}

const YEAR_OPTIONS = buildYearOptions().map((option) => ({ ...option, disabled: false as const }));
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1).padStart(2, "0"),
  disabled: false as const,
}));

export const BinderHandoverPanel: React.FC<BinderHandoverPanelProps> = ({
  clientId,
  initialBinderId,
  isSubmitting,
  onSubmit,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([initialBinderId]);
  const [receivedByName, setReceivedByName] = useState("");
  const [handedOverAt, setHandedOverAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [untilPeriodYear, setUntilPeriodYear] = useState(new Date().getFullYear());
  const [untilPeriodMonth, setUntilPeriodMonth] = useState(new Date().getMonth() + 1);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: bindersQK.list({ client_id: clientId, status: "ready_for_pickup", page_size: 100 }),
    queryFn: () => bindersApi.list({ client_id: clientId, status: "ready_for_pickup", page_size: 100 }),
    enabled: clientId > 0,
    staleTime: 30_000,
  });

  const readyBinders = useMemo(() => data?.items ?? [], [data?.items]);

  useEffect(() => {
    if (readyBinders.length === 0) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds((current) => {
      const keep = current.filter((id) => readyBinders.some((binder) => binder.id === id));
      if (keep.length > 0) return keep;
      if (readyBinders.some((binder) => binder.id === initialBinderId)) return [initialBinderId];
      return [readyBinders[0].id];
    });
  }, [readyBinders, initialBinderId]);

  const selectedCount = selectedIds.length;
  const canSubmit = selectedCount > 0 && receivedByName.trim().length > 0 && !!handedOverAt;

  const submitPayload = useMemo(
    () => ({
      binderIds: selectedIds,
      receivedByName: receivedByName.trim(),
      handedOverAt,
      untilPeriodYear,
      untilPeriodMonth,
      notes: notes.trim() || null,
    }),
    [selectedIds, receivedByName, handedOverAt, untilPeriodYear, untilPeriodMonth, notes],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <p className="text-sm font-medium text-gray-900">בחירת קלסרים למסירה</p>
        <p className="mt-1 text-xs text-gray-500">
          בחר את כל הקלסרים במצב "מוכן לאיסוף" שנמסרים ללקוח באותו אירוע.
        </p>

        <div className="mt-3 space-y-2">
          {isLoading ? (
            <p className="text-sm text-gray-500">טוען קלסרים מוכנים...</p>
          ) : readyBinders.length === 0 ? (
            <p className="text-sm text-gray-500">אין קלסרים מוכנים למסירה עבור לקוח זה.</p>
          ) : (
            readyBinders.map((binder) => {
              const checked = selectedIds.includes(binder.id);
              return (
                <label
                  key={binder.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
                >
                  <Checkbox
                    checked={checked}
                    onChange={() =>
                      setSelectedIds((current) =>
                        checked
                          ? current.filter((id) => id !== binder.id)
                          : [...current, binder.id],
                      )
                    }
                    inputClassName="mt-0.5"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900">{binder.binder_number}</div>
                    <div className="text-xs text-gray-500">
                      {binder.period_start ? `${formatMonthYear(binder.period_start)} - ${binder.period_end ? formatMonthYear(binder.period_end) : "פעיל"}` : "ללא תקופה"}
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      <Input
        label="נמסר לידי"
        value={receivedByName}
        onChange={(event) => setReceivedByName(event.target.value)}
        placeholder="שם מקבל הקלסרים"
      />

      <DatePicker
        label="תאריך מסירה"
        value={handedOverAt}
        onChange={setHandedOverAt}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label="עד שנת דיווח"
          value={String(untilPeriodYear)}
          onChange={(event) => setUntilPeriodYear(Number(event.target.value))}
          options={YEAR_OPTIONS}
        />
        <Select
          label="עד חודש דיווח"
          value={String(untilPeriodMonth)}
          onChange={(event) => setUntilPeriodMonth(Number(event.target.value))}
          options={MONTH_OPTIONS}
        />
      </div>

      <Textarea
        label="הערות"
        rows={3}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="הערת מסירה (אופציונלי)"
      />

      <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
        <span>{selectedCount} קלסרים נבחרו למסירה</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canSubmit || isSubmitting}
          onClick={() => onSubmit(submitPayload)}
        >
          אשר מסירה
        </Button>
      </div>
    </div>
  );
};

BinderHandoverPanel.displayName = "BinderHandoverPanel";
