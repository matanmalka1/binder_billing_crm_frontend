import type { Column } from "../../../components/ui/table/DataTable";
import { buildSelectionColumn } from "../../../components/ui/table/tableSelection";
import type { ClientResponse } from "../api";
import { formatClientOfficeId, formatDate } from "@/utils/utils";
import { ClientRowActions } from "./ClientRowActions";
import { getEntityTypeLabel, getClientStatusLabel, getVatTypeLabel } from "../constants";

const STATUS_BADGE: Record<string, { className: string }> = {
  active: { className: "bg-positive-100 text-positive-800" },
  frozen: { className: "bg-warning-100 text-warning-800" },
  closed: { className: "bg-gray-100 text-gray-600" },
};

interface BuildClientColumnsParams {
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  onToggleAll?: (ids: number[]) => void;
  allIds?: number[];
  onEditClient?: (client: ClientResponse) => void;
}

export const buildClientColumns = ({
  selectedIds,
  onToggleSelect,
  onToggleAll,
  allIds = [],
  onEditClient,
}: BuildClientColumnsParams = {}): Column<ClientResponse>[] => {
  const dataColumns: Column<ClientResponse>[] = [
    {
      key: "office_client_number",
      header: "מס' לקוח",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">
          {formatClientOfficeId(client.office_client_number)}
        </span>
      ),
    },
    {
      key: "full_name",
      header: "שם",
      render: (client) => (
        <span className="text-sm font-semibold text-gray-900">
          {client.full_name}
        </span>
      ),
    },
    {
      key: "id_number",
      header: "ת.ז / ח.פ",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">
          {client.id_number}
        </span>
      ),
    },
    {
      key: "entity_type",
      header: "סוג ישות",
      render: (client) => (
        <span className="text-sm text-gray-500">
          {client.entity_type
            ? getEntityTypeLabel(client.entity_type)
            : "—"}
        </span>
      ),
    },
    {
      key: "active_binder_number",
      header: "קלסר פעיל",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">
          {client.active_binder_number ?? "—"}
        </span>
      ),
    },
    {
      key: "vat_reporting_frequency",
      header: "סוג דיווח",
      render: (client) => (
        <span className="text-sm text-gray-500">
          {client.vat_reporting_frequency ? getVatTypeLabel(client.vat_reporting_frequency) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "סטטוס",
      render: (client) => {
        const badge = STATUS_BADGE[client.status];
        return (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>
            {getClientStatusLabel(client.status)}
          </span>
        );
      },
    },
    {
      key: "phone",
      header: "טלפון",
      render: (client) => (
        <span className="font-mono text-sm text-gray-500 tabular-nums">
          {client.phone || "—"}
        </span>
      ),
    },
    {
      key: "email",
      header: "אימייל",
      render: (client) => (
        <span className="text-sm text-gray-500">{client.email || "—"}</span>
      ),
    },
    {
      key: "created_at",
      header: "נוצר בתאריך",
      render: (client) => (
        <span className="text-sm text-gray-500 tabular-nums">
          {formatDate(client.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-10",
      className: "w-10",
      render: (client) => (
        <ClientRowActions
          clientId={client.id}
          onEditClient={onEditClient ? () => onEditClient(client) : undefined}
        />
      ),
    },
  ];

  if (!onToggleSelect) {
    return dataColumns;
  }

  return [
    buildSelectionColumn<ClientResponse>({
      allIds,
      selectedIds,
      onToggleSelect,
      onToggleAll,
      getId: (client) => client.id,
      getItemAriaLabel: (client) => `בחר לקוח ${formatClientOfficeId(client.id)}`,
    }),
    ...dataColumns,
  ];
};
