import { BinderActionButtons } from "./BinderActionButtons";

interface BinderActionsPanelProps {
  status: string;
  disabled?: boolean;
  onMarkReady: React.MouseEventHandler<HTMLButtonElement>;
  onRevertReady?: React.MouseEventHandler<HTMLButtonElement>;
  onReturn?: React.MouseEventHandler<HTMLButtonElement>;
}

export const BinderActionsPanel: React.FC<BinderActionsPanelProps> = ({
  status,
  disabled = false,
  onMarkReady,
  onRevertReady,
  onReturn,
}) => {
  if (status !== "in_office" && status !== "ready_for_pickup") {
    return null;
  }

  return (
    <div className="pt-2 flex items-center gap-2">
      <BinderActionButtons
        status={status}
        disabled={disabled}
        onMarkReady={onMarkReady}
        onRevertReady={onRevertReady}
        onReturn={onReturn}
        size="sm"
      />
    </div>
  );
};

BinderActionsPanel.displayName = "BinderActionsPanel";
