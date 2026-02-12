import { useCallback, useState } from "react";

export const useConfirmableAction = <T,>(
  executeAction: (action: T) => Promise<void>,
) => {
  const [pendingAction, setPendingAction] = useState<T | null>(null);

  const requestConfirmation = (action: T, requiresConfirm: boolean): boolean => {
    if (!requiresConfirm) return false;
    setPendingAction(action);
    return true;
  };

  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    await executeAction(pendingAction);
    setPendingAction(null);
  }, [executeAction, pendingAction]);

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  return {
    cancelPendingAction,
    confirmPendingAction,
    pendingAction,
    requestConfirmation,
  };
};
