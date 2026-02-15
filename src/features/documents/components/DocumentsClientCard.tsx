import { Card } from "../../../components/ui/Card";
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
  <Card title="בחירת לקוח">
    <div className="max-w-md">
      <Select
        label="לקוח"
        value={selectedClientId ? String(selectedClientId) : ""}
        onChange={(event) => setClient(event.target.value)}
      >
        <option value="">בחר לקוח</option>
        {clientOptions.map((client) => (
          <option key={client.id} value={client.id}>
            {client.full_name} (#{client.id})
          </option>
        ))}
      </Select>
    </div>
  </Card>
);
