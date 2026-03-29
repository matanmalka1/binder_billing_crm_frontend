import { useState } from "react";
import { Link2 } from "lucide-react";
import { Modal } from "../../../components/ui/overlays/Modal";
import { Button } from "../../../components/ui/primitives/Button";
import { Input } from "../../../components/ui/inputs/Input";
import { Select } from "../../../components/ui/inputs/Select";
import { Textarea } from "../../../components/ui/inputs/Textarea";
import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";
import type { CreateSignatureRequestPayload, SignatureRequestType } from "../api";
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
  clientId?: number;
  signerName?: string;
  signerEmail?: string;
  signerPhone?: string;
  isLoading: boolean;
  onClose: () => void;
  onCreate: (payload: CreateSignatureRequestPayload) => Promise<unknown>;
}

export const CreateSignatureRequestModal: React.FC<Props> = ({
  open,
  clientId: initialClientId,
  signerName: initialSignerName = "",
  signerEmail,
  isLoading,
  onClose,
  onCreate,
}) => {
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(
    initialClientId != null ? { id: initialClientId, name: initialSignerName } : null,
  );
  const [clientQuery, setClientQuery] = useState("");
  const [requestType, setRequestType] = useState<SignatureRequestType>("engagement_agreement");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overrideName, setOverrideName] = useState(initialSignerName);
  const [overrideEmail, setOverrideEmail] = useState(signerEmail ?? "");

  const resolvedClientId = initialClientId ?? selectedClient?.id;
  const resolvedSignerName = initialSignerName || selectedClient?.name || "";

  const handleClose = () => {
    onClose();
    setTitle("");
    setDescription("");
    setOverrideName(initialSignerName);
    setOverrideEmail(signerEmail ?? "");
    if (initialClientId == null) {
      setSelectedClient(null);
      setClientQuery("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedSignerNameFinal = overrideName.trim() || resolvedSignerName;
    if (!title.trim() || !resolvedClientId || !resolvedSignerNameFinal) return;
    await onCreate({
      business_id: resolvedClientId,
      request_type: requestType,
      title: title.trim(),
      description: description.trim() || undefined,
      signer_name: resolvedSignerNameFinal,
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
          <Button size="sm" isLoading={isLoading} onClick={handleSubmit} type="submit" disabled={!resolvedClientId || !(overrideName.trim() || resolvedSignerName)}>
            יצירה
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
          <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>לאחר יצירה, לחץ <strong>שלח</strong> כדי לקבל קישור חתימה שניתן לשלוח ללקוח (וואטסאפ, אימייל, SMS וכד׳).</span>
        </div>
        {initialClientId == null && (
          selectedClient ? (
            <SelectedClientDisplay
              name={selectedClient.name}
              id={selectedClient.id}
              onClear={() => { setSelectedClient(null); setClientQuery(""); setOverrideName(""); }}
            />
          ) : (
            <ClientSearchInput
              value={clientQuery}
              onChange={setClientQuery}
              onSelect={(c) => { setSelectedClient({ id: c.id, name: c.name }); setOverrideName(c.name); setClientQuery(c.name); }}
            />
          )
        )}
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
              placeholder={resolvedSignerName}
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
