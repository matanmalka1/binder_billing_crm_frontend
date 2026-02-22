import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { useCreateReport } from "../hooks/useCreateReport";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FLAG_FIELDS = [
  { name: "has_rental_income" as const, label: "הכנסת שכירות (נספח ב)" },
  { name: "has_capital_gains" as const, label: "רווחי הון (נספח בית)" },
  { name: "has_foreign_income" as const, label: "הכנסות מחו\"ל (נספח ג)" },
  { name: "has_depreciation" as const, label: "פחת (נספח ד)" },
  { name: "has_exempt_rental" as const, label: "שכר דירה פטור (נספח ה)" },
];

export const CreateReportModal: React.FC<Props> = ({ open, onClose }) => {
  const { form, onSubmit, isSubmitting } = useCreateReport(onClose);
  const { register, formState: { errors } } = form;

  return (
    <Modal
      open={open}
      title="דוח שנתי חדש"
      onClose={() => {
        form.reset();
        onClose();
      }}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button type="button" onClick={onSubmit} isLoading={isSubmitting}>
            צור דוח
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="מזהה לקוח *"
            type="number"
            error={errors.client_id?.message}
            {...register("client_id")}
          />
          <Input
            label="שנת מס *"
            type="number"
            min={2015}
            max={2099}
            error={errors.tax_year?.message}
            {...register("tax_year")}
          />
        </div>

        <Select
          label="סוג לקוח *"
          error={errors.client_type?.message}
          {...register("client_type")}
        >
          <option value="individual">יחיד (טופס 1301)</option>
          <option value="self_employed">עצמאי (טופס 1215)</option>
          <option value="corporation">חברה (טופס 6111)</option>
          <option value="partnership">שותפות (טופס 1215)</option>
        </Select>

        <Select
          label="סוג מועד"
          error={errors.deadline_type?.message}
          {...register("deadline_type")}
        >
          <option value="standard">סטנדרטי — 30 אפריל</option>
          <option value="extended">מורחב מייצגים — 31 ינואר</option>
          <option value="custom">מותאם אישית</option>
        </Select>

        {/* Income flags */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">נספחים נדרשים</p>
          <div className="space-y-2 rounded-lg border border-gray-200 p-3">
            {FLAG_FIELDS.map(({ name, label }) => (
              <label key={name} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  {...register(name)}
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">הערות</label>
          <textarea
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            {...register("notes")}
          />
        </div>
      </form>
    </Modal>
  );
};
