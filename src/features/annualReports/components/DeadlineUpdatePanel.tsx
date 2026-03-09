import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annualReportsApi } from "../../../api/annualReports.api";
import type { DeadlineType } from "../../../api/annualReports.api";
import { QK } from "../../../lib/queryKeys";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../utils/toast";
import { formatDate } from "../../../utils/utils";
import { getDeadlineTypeLabel } from "../../../api/taxDeadlines.utils";

interface Props {
  reportId: number;
  deadlineType: DeadlineType;
  filingDeadline: string | null;
}

const DEADLINE_OPTIONS: { value: DeadlineType; label: string }[] = [
  { value: "standard", label: "רגיל (30 אפריל)" },
  { value: "extended", label: "מורחב (31 ינואר — מייצגים)" },
  { value: "custom", label: "מותאם אישית" },
];

export const DeadlineUpdatePanel: React.FC<Props> = ({
  reportId,
  deadlineType,
  filingDeadline,
}) => {
  const [selected, setSelected] = useState<DeadlineType>(deadlineType);
  const [customNote, setCustomNote] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      annualReportsApi.updateDeadline(reportId, {
        deadline_type: selected,
        ...(selected === "custom" && customNote ? { custom_deadline_note: customNote } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QK.tax.annualReports.detail(reportId) });
      toast.success("מועד ההגשה עודכן בהצלחה");
    },
    onError: () => {
      toast.error("שגיאה בעדכון מועד ההגשה");
    },
  });

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-500">
        <span>מועד נוכחי: </span>
        <span className="font-medium text-gray-900">
          {getDeadlineTypeLabel(deadlineType)}
          {filingDeadline ? ` (${formatDate(filingDeadline)})` : ""}
        </span>
      </div>

      <fieldset className="space-y-2">
        {DEADLINE_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="deadline_type"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </fieldset>

      {selected === "custom" && (
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder="הערת מועד מותאם אישית"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
      )}

      <Button
        type="button"
        size="sm"
        onClick={() => mutate()}
        isLoading={isPending}
        disabled={isPending}
      >
        שמור
      </Button>
    </div>
  );
};
