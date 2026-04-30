import { useCallback, useState } from 'react'

export const useConfirmableAction = <T>(
  executeAction: (action: T) => Promise<void>,
  shouldConfirm: (action: T) => boolean = () => false,
) => {
  const [pendingAction, setPendingAction] = useState<T | null>(null)

  const handleAction = useCallback(
    (action: T) => {
      if (shouldConfirm(action)) {
        setPendingAction(action)
        return
      }
      void executeAction(action)
    },
    [executeAction, shouldConfirm],
  )

  const confirmPendingAction = useCallback(
    async (inputValues?: Record<string, string>) => {
      if (!pendingAction) return
      const action =
        inputValues && Object.keys(inputValues).length > 0
          ? {
              ...pendingAction,
              payload: {
                ...((pendingAction as Record<string, unknown>).payload as Record<string, unknown>),
                ...inputValues,
              },
            }
          : pendingAction
      await executeAction(action as T)
      setPendingAction(null)
    },
    [executeAction, pendingAction],
  )

  const cancelPendingAction = () => setPendingAction(null)

  return {
    cancelPendingAction,
    confirmPendingAction,
    handleAction,
    pendingAction,
  }
}
