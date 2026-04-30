import type { ComponentProps } from 'react'
import AnnualReportSidebarNav from './AnnualReportSidebarNav'
import { AnnualReportSidebarStatus } from './AnnualReportSidebarStatus'

type AnnualReportSidebarNavProps = ComponentProps<typeof AnnualReportSidebarNav>
type AnnualReportSidebarStatusProps = ComponentProps<typeof AnnualReportSidebarStatus>

type AnnualReportSidebarProps = AnnualReportSidebarNavProps & AnnualReportSidebarStatusProps

const AnnualReportSidebar = ({
  activeSection,
  onSectionChange,
  report,
  detail,
  availableActions,
  onTransition,
}: AnnualReportSidebarProps) => (
  <div className="flex flex-col justify-between lg:w-[220px] md:w-[48px] border-l h-full overflow-y-auto">
    <AnnualReportSidebarNav activeSection={activeSection} onSectionChange={onSectionChange} />
    <AnnualReportSidebarStatus
      report={report}
      detail={detail}
      availableActions={availableActions}
      onTransition={onTransition}
    />
  </div>
)

AnnualReportSidebar.displayName = 'AnnualReportSidebar'

export default AnnualReportSidebar
