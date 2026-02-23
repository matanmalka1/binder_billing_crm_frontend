import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

interface Props {
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
    tax_deadline_id?: number | null;
  }) => Promise<void>;
  isCreating: boolean;
}

export const CreateAdvancePaymentModal: React.FC<Props> = ({
  open,
  clientId,
  year,
  onClose,
  onCreate,
  isCreating,
}) => {
  const [month, setMonth] = useState<number | "">("");
  const [dueDate, setDueDate] = useState("");
  const [expectedAmount, setExpectedAmount] = useState<number | "">("");
  const [paidAmount, setPaidAmount] = useState<number | "">("");

  const reset = () => {
    setMonth("");
    setDueDate("");
    setExpectedAmount("");
    setPaidAmount("");
  };

  const handleCreate = async () => {
    if (!month || month < 1 || month > 12) return;
    if (!dueDate) return;
    await onCreate({
      client_id: clientId,
      year,
      month: Number(month),
      due_date: dueDate,
      expected_amount: expectedAmount === "" ? null : Number(expectedAmount),
      paid_amount: paidAmount === "" ? null : Number(paidAmount),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      title="מקדמה חדשה"
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ביטול</Button>
          <Button variant="primary" isLoading={isCreating} onClick={handleCreate}>
            יצירה
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="חודש (1-12)"
          type="number"
          min={1}
          max={12}
          value={month}
          onChange={(e) => setMonth(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Input
          label="תאריך יעד"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Input
          label="סכום צפוי"
          type="number"
          min={0}
          value={expectedAmount}
          onChange={(e) => setExpectedAmount(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <Input
          label="סכום ששולם (אופציונלי)"
          type="number"
          min={0}
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
    </Modal>
  );
};
