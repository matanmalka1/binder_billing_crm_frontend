import { User, FileText } from 'lucide-react'
import { getResultTypeLabel } from '../../../constants/filterOptions.constants'

export const getResultIcon = (resultType: string) => {
  if (resultType === 'binder') return <FileText className="h-4 w-4" />
  if (resultType === 'client') return <User className="h-4 w-4" />
  return null
}

export const getResultColor = (resultType: string) => {
  if (resultType === 'binder') return 'text-primary-600 bg-primary-50'
  if (resultType === 'client') return 'text-positive-700 bg-positive-50'
  return 'text-gray-600 bg-gray-50'
}

export const getResultLabel = (resultType: string) => getResultTypeLabel(resultType)
