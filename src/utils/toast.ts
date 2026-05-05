import { toast as sonnerToast } from 'sonner'

const RTL_STYLE: React.CSSProperties = { direction: 'rtl' }

interface ToastOptions {
  duration?: number
  description?: string
  action?: { label: string; onClick: () => void }
}

/**
 * App-level toast wrapper around Sonner.
 * Import this module from feature code instead of importing `sonner` directly.
 *
 * Use `toast.error(message)` when the caller already has a display-ready message.
 * Use `showErrorToast(error, fallback)` from `utils.ts` when starting from an
 * unknown error object and a fallback message.
 */
const notify = (type: 'success' | 'error' | 'info' | 'warning', message: string, options?: ToastOptions) => {
  const base = { style: RTL_STYLE }
  const durationDefaults: Record<typeof type, number> = {
    success: 4000,
    error: 6000,
    info: 4000,
    warning: 5000,
  }

  sonnerToast[type](message, {
    ...base,
    description: options?.description,
    duration: options?.duration ?? durationDefaults[type],
    action: options?.action,
  })
}

export const toast = {
  success: (message: string, options?: ToastOptions) => notify('success', message, options),
  error: (message: string, options?: ToastOptions) => notify('error', message, options),
  info: (message: string, options?: ToastOptions) => notify('info', message, options),
  warning: (message: string, options?: ToastOptions) => notify('warning', message, options),
}
