import { Select } from "../../../components/ui/Select";

interface DocumentsClientCardProps {
  clientOptions: Array<{ id: number; full_name: string }>;
  selectedClientId: number;
  setClient: (clientId: string) => void;
}

export const DocumentsClientCard: React.FC<DocumentsClientCardProps> = ({
  clientOptions,
  selectedClientId,
  setClient,
}) => (
  <div className="max-w-sm">
    <Select
      label="בחירת לקוח"
      value={selectedClientId ? String(selectedClientId) : ""}
      onChange={(e) => setClient(e.target.value)}
    >
      <option value="">כל הלקוחות</option>
      {clientOptions.map((client) => (
        <option key={client.id} value={client.id}>
          {client.full_name} (#{client.id})
        </option>
      ))}
    </Select>
  </div>
);
