import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Textarea } from "../../../components/ui/Textarea";
import type { CreateSignatureRequestPayload, SignatureRequestType } from "../../../api/signatureRequests.api";
import { getSignatureRequestTypeLabel } from "../../../utils/enums";

const REQUEST_TYPES: SignatureRequestType[] = [
  "engagement_agreement",
  "annual_report_approval",
  "power_of_attorney",
  "vat_return_approval",
  "custom",
];

interface Props {
  open: boolean;
  clientId: number;
  signerName: string;
  signerEmail?: string;
  signerPhone?: string;
  isLoading: boolean;
  onClose: () => void;
  onCreate: (payload: CreateSignatureRequestPayload) => Promise<unknown>;
}

export const CreateSignatureRequestModal: React.FC<Props> = ({
  open,
  clientId,
  signerName,
  signerEmail,
  isLoading,
  onClose,
  onCreate,
}) => {
  const [requestType, setRequestType] = useState<SignatureRequestType>("engagement_agreement");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Pre-fill with client defaults so advisor can see/edit them immediately
  const [overrideName, setOverrideName] = useState(signerName);
  const [overrideEmail, setOverrideEmail] = useState(signerEmail ?? "");

  const handleClose = () => {
    onClose();
    setTitle("");
    setDescription("");
    setOverrideName(signerName);
    setOverrideEmail(signerEmail ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onCreate({
      client_id: clientId,
      request_type: requestType,
      title: title.trim(),
      description: description.trim() || undefined,
      signer_name: overrideName.trim() || signerName,
      signer_email: overrideEmail.trim() || undefined,
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      title="בקשת חתימה חדשה"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
            ביטול
          </Button>
          <Button size="sm" isLoading={isLoading} onClick={handleSubmit} type="submit">
            יצירה
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="סוג מסמך"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value as SignatureRequestType)}
          options={REQUEST_TYPES.map((t) => ({
            value: t,
            label: getSignatureRequestTypeLabel(t),
          }))}
        />
        <Input
          label="כותרת"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוג': הסכם התקשרות 2025"
          required
        />
        <Textarea
          label="תיאור (אופציונלי)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="פרטים נוספים עבור החותם..."
          rows={3}
        />
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500 mb-3">פרטי חותם</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="שם חותם"
              value={overrideName}
              onChange={(e) => setOverrideName(e.target.value)}
              placeholder={signerName}
            />
            <Input
              label='דוא"ל חותם'
              value={overrideEmail}
              onChange={(e) => setOverrideEmail(e.target.value)}
              placeholder={signerEmail ?? ""}
              type="email"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

CreateSignatureRequestModal.displayName = "CreateSignatureRequestModal";