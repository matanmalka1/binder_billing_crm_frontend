import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

/**
 * Manages a local draft value for a search input with debounced commit.
 * Syncs back when the external value resets (e.g. URL-driven reset).
 */
export const useSearchDebounce = (
  externalValue: string,
  onCommit: (value: string) => void,
  delay = 350,
) => {
  const [draft, setDraft] = useState(externalValue)
  const [debounced] = useDebounce(draft, delay)

  // Sync draft when external value changes (e.g. reset from parent)
  useEffect(() => {
    setDraft(externalValue)
  }, [externalValue])

  // Commit debounced value when it diverges from external
  useEffect(() => {
    if (debounced !== externalValue) {
      onCommit(debounced)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return [draft, setDraft] as const
}
