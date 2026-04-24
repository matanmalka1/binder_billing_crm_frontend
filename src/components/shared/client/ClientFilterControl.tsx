import { ClientSearchInput, SelectedClientDisplay } from "@/components/shared/client";

interface ClientFilterControlProps {
  selectedClient: { id: number; name: string } | null;
  clientQuery: string;
  onQueryChange: (query: string) => void;
  onSelect: (client: { id: number; name: string }) => void;
  onClear: () => void;
  label?: string;
  placeholder?: string;
}

export const ClientFilterControl: React.FC<ClientFilterControlProps> = ({
  selectedClient,
  clientQuery,
  onQueryChange,
  onSelect,
  onClear,
  label = "לקוח",
  placeholder = "שם, ת.ז. / ח.פ...",
}) => (
  <div>
    {selectedClient ? (
      <SelectedClientDisplay
        name={selectedClient.name}
        id={selectedClient.id}
        onClear={onClear}
        label={label}
      />
    ) : (
      <ClientSearchInput
        label={label}
        value={clientQuery}
        onChange={onQueryChange}
        onSelect={onSelect}
        placeholder={placeholder}
      />
    )}
  </div>
);

ClientFilterControl.displayName = "ClientFilterControl";
