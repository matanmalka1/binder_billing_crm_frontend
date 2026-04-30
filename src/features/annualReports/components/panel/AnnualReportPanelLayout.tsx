import { Download, X } from 'lucide-react'
import { Button } from '../../../../components/ui/primitives/Button'
import { UnsavedChangesGuard } from '@/components/ui/feedback/UnsavedChangesGuard'
import { useEscapeToClose } from '@/components/ui/overlays/useEscapeToClose'
import { useUnsavedChangesGuard } from '@/components/ui/overlays/useUnsavedChangesGuard'

interface AnnualReportPanelLayoutProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  onDelete: () => void
  onSave: () => void
  isDirty: boolean
  isSaving: boolean
  children: React.ReactNode
  onExportPdf?: () => void
  isExportingPdf?: boolean
}

export const AnnualReportPanelLayout = ({
  open,
  title,
  subtitle,
  onClose,
  onDelete,
  onSave,
  isDirty,
  isSaving,
  children,
  onExportPdf,
  isExportingPdf = false,
}: AnnualReportPanelLayoutProps) => {
  const { showGuard, handleClose, handleContinue, handleDiscard } = useUnsavedChangesGuard({
    isDirty,
    onClose,
  })

  useEscapeToClose({ open, onClose: handleClose })

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[95vw] h-[95vh] max-w-7xl bg-white rounded-xl flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4"
            dir="rtl"
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
              {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {onExportPdf && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onExportPdf}
                  isLoading={isExportingPdf}
                >
                  <Download className="h-4 w-4" />
                  הורד טיוטה
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="border-negative-300 text-negative-600 hover:bg-negative-50"
              >
                מחק דוח
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onSave}
                disabled={!isDirty || isSaving}
                className="bg-info-600 hover:bg-info-700"
              >
                {isSaving ? 'שומר...' : 'שמור'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label="סגירה"
                className="p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </div>
      </div>

      {/* Unsaved changes guard */}
      {showGuard && <UnsavedChangesGuard onContinue={handleContinue} onDiscard={handleDiscard} />}
    </>
  )
}

AnnualReportPanelLayout.displayName = 'AnnualReportPanelLayout'
