import { BinderActionButtons } from "./BinderActionButtons";

interface BinderActionsPanelProps {
  status: string;
  disabled?: boolean;
  onMarkReady: React.MouseEventHandler<HTMLButtonElement>;
}

export const BinderActionsPanel: React.FC<BinderActionsPanelProps> = ({
  status,
  disabled = false,
  onMarkReady,
}) => {
  if (status !== "in_office") {
    return null;
  }

  return (
    <div className="pt-2 flex items-center gap-2">
      <BinderActionButtons
        status={status}
        disabled={disabled}
        onMarkReady={onMarkReady}
        size="sm"
      />
    </div>
  );
};

BinderActionsPanel.displayName = "BinderActionsPanel";
