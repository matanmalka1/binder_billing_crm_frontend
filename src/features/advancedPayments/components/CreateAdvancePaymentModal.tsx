import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Select } from "../../../components/ui/Select";
import {
  createAdvancePaymentSchema,
  type CreateAdvancePaymentFormValues,
} from "../schemas";

interface CreateAdvancePaymentModalProps {
  open: boolean;
  clientId: number;
  year: number;
  onClose: () => void;
  onCreate: (payload: {
    client_id: number;
    year: number;
    month: number;
    due_date: string;
    expected_amount?: number | null;
    paid_amount?: number | null;
  }) => Promise<unknown>;
  isCreating: boolean;
}

const MONTH_OPTIONS = [
  { value: "1", label: "ינואר" },
  { value: "2", label: "פברואר" },
  { value: "3", label: "מרץ" },
  { value: "4", label: "אפריל" },
  { value: "5", label: "מאי" },
  { value: "6", label: "יוני" },
  { value: "7", label: "יולי" },
  { value: "8", label: "אוגוסט" },
  { value: "9", label: "ספטמבר" },
  { value: "10", label: "אוקטובר" },
  { value: "11", label: "נובמבר" },
  { value: "12", label: "דצמבר" },
];

const DEFAULT_VALUES: CreateAdvancePaymentFormValues = {
  month: 1,
  due_date: "",
  expected_amount: null,
  paid_amount: null,
};

export const CreateAdvancePaymentModal: React.FC<CreateAdvancePaymentModalProps> = ({
  open,
  clientId,
  year,
  onClose,
  onCreate,
  isCreating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateAdvancePaymentFormValues>({
    resolver: zodResolver(createAdvancePaymentSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleClose = () => {
    reset(DEFAULT_VALUES);
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    await onCreate({
      client_id: clientId,
      year,
      month: data.month,
      due_date: data.due_date,
      expected_amount: data.expected_amount,
      paid_amount: data.paid_amount,
    });
    reset(DEFAULT_VALUES);
    onClose();
  });

  return (
    <Modal
      open={open}
      title="מקדמה חדשה"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            ביטול
          </Button>
          <Button variant="primary" isLoading={isCreating} onClick={onSubmit}>
            יצירה
          </Button>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <Select
              label="חודש"
              value={String(field.value)}
              onChange={(e) => field.onChange(Number(e.target.value))}
              options={MONTH_OPTIONS}
              error={errors.month?.message}
            />
          )}
        />
        <Input
          label="תאריך יעד"
          type="date"
          {...register("due_date")}
          error={errors.due_date?.message}
        />
        <Controller
          name="expected_amount"
          control={control}
          render={({ field }) => (
            <Input
              label="סכום צפוי"
              type="number"
              min={0}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : Number(e.target.value))
              }
              error={errors.expected_amount?.message}
            />
          )}
        />
        <Controller
          name="paid_amount"
          control={control}
          render={({ field }) => (
            <Input
              label="סכום ששולם (אופציונלי)"
              type="number"
              min={0}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(e.target.value === "" ? null : Number(e.target.value))
              }
              error={errors.paid_amount?.message}
            />
          )}
        />
      </form>
    </Modal>
  );
};