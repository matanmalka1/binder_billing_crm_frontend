import { CheckSquare } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageStateGuard } from '@/components/ui/layout/PageStateGuard'
import { StateCard } from '@/components/ui/feedback/StateCard'
import { useTasks } from '../hooks/useTasks'
import { TasksSummaryCards } from '../components/TasksSummaryCards'
import { TasksFiltersBar } from '../components/TasksFiltersBar'
import { TasksTable } from '../components/TasksTable'

export const TasksPage: React.FC = () => {
  const {
    items,
    allItems,
    isLoading,
    error,
    urgencyFilter,
    setUrgencyFilter,
    typeFilter,
    setTypeFilter,
    hasFilters,
    clearFilters,
  } = useTasks()

  const header = (
    <PageHeader
      title="משימות"
      description="כלל המשימות הפעילות: מועדי מס, מקדמות, דוחות וחיובים פתוחים"
    />
  )

  const renderBody = () => {
    if (items.length === 0) {
      if (hasFilters) {
        return (
          <StateCard
            icon={CheckSquare}
            title="לא נמצאו משימות"
            message="לא נמצאו משימות התואמות את הסינון"
            secondaryAction={{ label: 'אפס סינון', onClick: clearFilters }}
          />
        )
      }
      return (
        <StateCard
          icon={CheckSquare}
          variant="illustration"
          title="אין משימות פעילות"
          message="כל המשימות הושלמו או שאין מועדים קרובים."
        />
      )
    }

    return <TasksTable items={items} />
  }

  return (
    <PageStateGuard isLoading={isLoading} error={error} header={header} loadingMessage="טוען משימות...">
      <TasksSummaryCards
        items={allItems}
        urgencyFilter={urgencyFilter}
        onFilter={setUrgencyFilter}
      />

      <TasksFiltersBar
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        hasFilters={hasFilters}
        onClear={clearFilters}
      />

      {renderBody()}
    </PageStateGuard>
  )
}
