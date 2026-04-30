import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from '../../../../components/ui/overlays/Modal'
import { Button } from '../../../../components/ui/primitives/Button'
import { Input } from '../../../../components/ui/inputs/Input'

interface Props {
  open: boolean
  clientName: string
  isDeleting: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export const DeleteClientModal: React.FC<Props> = ({
  open,
  clientName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const [confirmation, setConfirmation] = useState('')

  const handleClose = () => {
    setConfirmation('')
    onCancel()
  }

  const handleConfirm = async () => {
    await onConfirm()
    setConfirmation('')
  }

  return (
    <Modal
      open={open}
      title="מחיקת לקוח"
      onClose={handleClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isDeleting}>
            ביטול
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={isDeleting}
            disabled={isDeleting || confirmation !== clientName}
            onClick={handleConfirm}
            className="bg-negative-600 hover:bg-negative-700 focus:ring-negative-500"
          >
            מחק לקוח
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3 rounded-lg border border-negative-200 bg-negative-50 p-4 text-negative-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">מחיקת הלקוח {clientName} היא פעולה בלתי הפיכה.</p>
            <p>
              המחיקה תסיר את רשומת הלקוח מהעבודה השוטפת ועלולה להשפיע על תצוגת מסמכים, מועדים,
              חיובים, קלסרים והיסטוריית פעילות המקושרים ללקוח.
            </p>
          </div>
        </div>
        <Input
          label="כדי למחוק, יש להקליד את שם הלקוח במדויק"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          disabled={isDeleting}
        />
      </div>
    </Modal>
  )
}
