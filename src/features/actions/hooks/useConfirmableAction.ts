import { useCallback, useState } from "react";

export const useConfirmableAction = <T,>(
  executeAction: (action: T) => Promise<void>,
  shouldConfirm: (action: T) => boolean = () => false,
) => {
  const [pendingAction, setPendingAction] = useState<T | null>(null);

  const handleAction = useCallback(
    (action: T) => {
      if (shouldConfirm(action)) {
        setPendingAction(action);
        return;
      }
      void executeAction(action);
    },
    [executeAction, shouldConfirm],
  );

  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    await executeAction(pendingAction);
    setPendingAction(null);
  }, [executeAction, pendingAction]);

  const cancelPendingAction = () => setPendingAction(null);

  return {
    cancelPendingAction,
    confirmPendingAction,
    handleAction,
    pendingAction,
  };
};
