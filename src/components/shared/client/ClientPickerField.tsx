import { ClientSearchInput, SelectedClientDisplay } from './ClientSearchInput'

interface ClientPickerFieldProps {
  selectedClient: { id: number; name: string } | null
  clientQuery: string
  onQueryChange: (query: string) => void
  onSelect: (client: {
    id: number
    name: string
    id_number: string
    client_status?: string | null
  }) => void
  onClear: () => void
  error?: string
  label?: string
  placeholder?: string
}

export const ClientPickerField: React.FC<ClientPickerFieldProps> = ({
  selectedClient,
  clientQuery,
  onQueryChange,
  onSelect,
  onClear,
  error,
  label = 'לקוח',
  placeholder = 'חפש לפי שם, ת"ז / ח.פ...',
}) =>
  selectedClient ? (
    <SelectedClientDisplay
      name={selectedClient.name}
      id={selectedClient.id}
      onClear={onClear}
      label={label}
    />
  ) : (
    <ClientSearchInput
      label={label}
      placeholder={placeholder}
      value={clientQuery}
      onChange={onQueryChange}
      onSelect={onSelect}
      error={error}
    />
  )

ClientPickerField.displayName = 'ClientPickerField'
