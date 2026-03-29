import { BulkSelectionActionButton, BulkSelectionToolbar } from "@/components/ui/BulkSelectionToolbar";

interface ClientBulkToolbarProps {
  selectedCount: number;
  loading: boolean;
  onAction: (action: "freeze" | "close" | "activate") => Promise<void>;
  onClear: () => void;
}

export const ClientBulkToolbar: React.FC<ClientBulkToolbarProps> = ({
  selectedCount,
  loading,
  onAction,
  onClear,
}) => (
  <BulkSelectionToolbar selectedCount={selectedCount} loading={loading} onClear={onClear}>
    <BulkSelectionActionButton
      label="הקפא"
      disabled={loading}
      loading={loading}
      onClick={() => void onAction("freeze")}
    />
    <BulkSelectionActionButton
      label="סגור"
      disabled={loading}
      loading={loading}
      variant="danger"
      onClick={() => void onAction("close")}
    />
    <BulkSelectionActionButton
      label="הפעל"
      disabled={loading}
      loading={loading}
      onClick={() => void onAction("activate")}
    />
  </BulkSelectionToolbar>
);
