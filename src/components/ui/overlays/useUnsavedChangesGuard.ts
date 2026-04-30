import { useCallback, useState } from 'react'

interface UseUnsavedChangesGuardOptions {
  isDirty: boolean
  onClose: () => void
}

export const useUnsavedChangesGuard = ({ isDirty, onClose }: UseUnsavedChangesGuardOptions) => {
  const [showGuard, setShowGuard] = useState(false)

  const handleClose = useCallback(() => {
    if (isDirty) {
      setShowGuard(true)
      return
    }
    onClose()
  }, [isDirty, onClose])

  const handleContinue = useCallback(() => {
    setShowGuard(false)
  }, [])

  const handleDiscard = useCallback(() => {
    setShowGuard(false)
    onClose()
  }, [onClose])

  return {
    showGuard,
    handleClose,
    handleContinue,
    handleDiscard,
  }
}
