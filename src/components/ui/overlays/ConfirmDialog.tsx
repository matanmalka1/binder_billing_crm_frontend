import { useState, useEffect } from 'react'
import { Button } from '../primitives/Button'
import { Input } from '../inputs/Input'
import { Modal } from './Modal'
import type { ActionInputField } from '../../../lib/actions/types'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  isLoading?: boolean
  confirmDisabled?: boolean
  inputs?: ActionInputField[]
  onConfirm: (inputValues?: Record<string, string>) => void
  onCancel: () => void
  children?: React.ReactNode
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  confirmDisabled = false,
  inputs,
  onConfirm,
  onCancel,
  children,
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) setInputValues({})
  }, [open])

  const isConfirmDisabled =
    isLoading ||
    confirmDisabled ||
    (inputs ?? []).some((f) => f.required && !inputValues[f.name]?.trim())

  const handleConfirm = () => {
    onConfirm(inputs?.length ? inputValues : undefined)
  }

  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" disabled={isLoading} onClick={onCancel}>
            {cancelLabel || '—'}
          </Button>
          <Button
            type="button"
            isLoading={isLoading}
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            {confirmLabel || '—'}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-700">{message}</p>
      {inputs && inputs.length > 0 && (
        <div className="mt-3 space-y-3">
          {inputs.map((field) => (
            <Input
              key={field.name}
              label={field.required ? `${field.label} *` : field.label}
              type={field.type}
              value={inputValues[field.name] ?? ''}
              onChange={(e) =>
                setInputValues((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
            />
          ))}
        </div>
      )}
      {children}
    </Modal>
  )
}
