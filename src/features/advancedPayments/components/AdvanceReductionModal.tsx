import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";

interface AdvanceReductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  advanceRate: number | null;
  isUpdating: boolean;
  onSubmit: (rate: number) => void;
}

export const AdvanceReductionModal: React.FC<AdvanceReductionModalProps> = ({
  isOpen,
  onClose,
  advanceRate,
  isUpdating,
  onSubmit,
}) => {
  const [reductionRate, setReductionRate] = useState("");

  const handleSubmit = () => {
    const parsed = Number(reductionRate);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) return;
    onSubmit(parsed);
    setReductionRate("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title="בקשת הפחתת מקדמה"
      onClose={onClose}
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ביטול</Button>
          <Button variant="primary" isLoading={isUpdating} onClick={handleSubmit}>אשר הפחתה</Button>
        </div>
      )}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          שיעור נוכחי: <strong>{advanceRate != null ? `${advanceRate}%` : "לא הוגדר"}</strong>
        </p>
        <Input
          label="שיעור מקדמה חדש (%)"
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={reductionRate}
          onChange={(e) => setReductionRate(e.target.value)}
          placeholder="לדוגמה: 2.5"
        />
      </div>
    </Modal>
  );
};

AdvanceReductionModal.displayName = "AdvanceReductionModal";
