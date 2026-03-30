import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  ClientPickerField,
  createClientIdPickerHandlers,
  useClientPickerState,
} from "@/components/shared/client";
import { DatePicker, Input, Select, Textarea } from "@/components/ui/inputs";
import { Modal, ModalFormActions } from "@/components/ui/overlays";
import { useCreateReport } from "../../hooks/useCreateReport";
import { FLAG_FIELDS } from "../../utils";

interface CreateReportModalProps {
  open: boolean;
  onClose: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const currencySuffix = <span className="text-sm text-gray-400">₪</span>;

export const CreateReportModal: React.FC<CreateReportModalProps> = ({ open, onClose }) => {
  const { form, onSubmit, isSubmitting, preview } = useCreateReport(onClose);
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const {
    clientQuery,
    selectedClient,
    handleSelectClient,
    handleClearClient,
    handleClientQueryChange,
    resetClientPicker,
  } = useClientPickerState(
    createClientIdPickerHandlers((value, options) => setValue("business_id", value, options)),
  );

  useEffect(() => {
    if (open) return;
    form.reset();
    resetClientPicker();
  }, [form, open, resetClientPicker]);

  const handleClose = () => {
    form.reset();
    resetClientPicker();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="דוח שנתי חדש"
      onClose={handleClose}
      footer={
        <ModalFormActions
          onCancel={handleClose}
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          submitLabel="צור דוח"
        />
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register("business_id")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ClientPickerField
              selectedClient={selectedClient}
              clientQuery={clientQuery}
              onQueryChange={handleClientQueryChange}
              onSelect={handleSelectClient}
              onClear={handleClearClient}
              error={errors.business_id?.message}
              label="עסק *"
            />
          </div>
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

        <Controller
          name="filing_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="תאריך הגשה"
              error={errors.filing_date?.message}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">נתוני הכנסות ראשוניים (לתצוגה בלבד)</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="הכנסה ברוטו"
              type="number"
              min={0}
              endElement={currencySuffix}
              {...register("gross_income")}
            />
            <Input
              label="הוצאות"
              type="number"
              min={0}
              endElement={currencySuffix}
              {...register("expenses")}
            />
            <Input
              label="מקדמות ששולמו"
              type="number"
              min={0}
              endElement={currencySuffix}
              {...register("advances_paid")}
            />
            <div>
              <Input
                label="נקודות זיכוי"
                type="number"
                min={0}
                step={0.25}
                {...register("credit_points")}
              />
              <p className="mt-1 text-xs text-gray-500">לצורך הצגת אומדן בלבד — לא נשמר בדוח</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
          <p className="mb-1.5 font-medium text-blue-800">תצוגה מקדימה (אומדן)</p>
          <div className="grid grid-cols-3 gap-2 text-blue-700">
            <div>
              <span className="block text-xs text-blue-500">רווח נקי</span>
              <span className="font-mono">₪{fmt(preview.netProfit)}</span>
            </div>
            <div>
              <span className="block text-xs text-blue-500">מס משוער</span>
              <span className="font-mono">₪{fmt(preview.estimatedTax)}</span>
            </div>
            <div>
              <span className="block text-xs text-blue-500">יתרה לתשלום</span>
              <span className={`font-mono ${preview.balance < 0 ? "text-green-600" : "text-red-600"}`}>
                ₪{fmt(Math.abs(preview.balance))}{preview.balance < 0 ? " (החזר)" : ""}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">נספחים נדרשים</p>
          <div className="space-y-2 rounded-lg border border-gray-200 p-3">
            {FLAG_FIELDS.map(({ name, label }) => (
              <label key={name} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600"
                  {...register(name)}
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Textarea label="הערות" rows={2} {...register("notes")} />
      </form>
    </Modal>
  );
};
