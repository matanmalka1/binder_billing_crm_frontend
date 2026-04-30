import { Link } from 'react-router-dom'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { DashboardPanel } from './DashboardPrimitives'

export const DashboardOnboardingEmptyState = () => {
  return (
    <DashboardPanel className="border-dashed">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <UserPlus className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-950">עדיין אין נתונים במערכת</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              כדי להתחיל: צור לקוח ראשון. המערכת תפתח קלסר ותייצר מועדים רלוונטיים אוטומטית.
            </p>
          </div>
        </div>
        <Link
          to="/clients?create=1"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          צור לקוח ראשון
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </DashboardPanel>
  )
}

DashboardOnboardingEmptyState.displayName = 'DashboardOnboardingEmptyState'
