import { NavLink } from 'react-router-dom'
import { cn } from '../../../utils/utils'
import type { NavItem } from './sidebar.constants'

interface SidebarItemProps {
  item: NavItem
  isSidebarOpen: boolean
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isSidebarOpen }) => {
  return (
    <NavLink
      to={item.to}
      end={item.end ?? item.to === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex flex-row-reverse items-center justify-start gap-3 rounded-xl px-4 py-2.5 text-right transition-colors',
          isActive
            ? 'bg-[#4f7dff] text-white shadow-[0_12px_28px_rgba(79,125,255,0.25)]'
            : 'text-gray-400 hover:bg-white/5 hover:text-white',
        )
      }
    >
      <item.icon className="h-5 w-5 shrink-0 stroke-[1.6]" />
      {isSidebarOpen ? (
        <span className="flex-1 text-right text-sm font-medium tracking-tight">{item.label}</span>
      ) : (
        <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-left text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </div>
      )}
    </NavLink>
  )
}
