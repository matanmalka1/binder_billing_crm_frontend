import { cn } from '../../../../utils/utils'
import type { SectionKey } from '../../types'
import { PANEL_NAV_ITEMS, SIDEBAR_NAV_VARIANTS } from './constants'

interface AnnualReportSidebarNavProps {
  activeSection: SectionKey
  onSectionChange: (section: SectionKey) => void
}

const AnnualReportSidebarNav = ({
  activeSection,
  onSectionChange,
}: AnnualReportSidebarNavProps) => {
  return (
    <nav className="flex flex-col gap-1 py-2" dir="rtl">
      {PANEL_NAV_ITEMS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSectionChange(key)}
          className={cn(
            'flex items-center gap-2 pr-3 py-2 rounded-lg text-sm transition-colors w-full text-right',
            SIDEBAR_NAV_VARIANTS[activeSection === key ? 'active' : 'inactive'],
          )}
        >
          <Icon size={15} />
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </nav>
  )
}

AnnualReportSidebarNav.displayName = 'AnnualReportSidebarNav'

export default AnnualReportSidebarNav
