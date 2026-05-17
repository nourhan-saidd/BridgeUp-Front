import type { ElementType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  User,
  Map,
  ClipboardList,
  Medal,
  Briefcase,
  Bell,
  LogOut,
  Landmark,
} from 'lucide-react'

const mainNav = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/scores', label: 'My Scores', icon: Medal },
]

const opportunityNav = [
  { to: '/job-offers', label: 'Job Offers', icon: Briefcase, badge: 2 },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: 5 },
]

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Landmark size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-primary">BridgeUp</span>
      </div>

      <div className="flex items-center gap-3 px-5 pb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          AH
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Ahmed Hassan</p>
          <p className="text-xs text-gray-500">Frontend Track</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-3">
        <NavSection title="MAIN" items={mainNav} />
        <NavSection title="OPPORTUNITIES" items={opportunityNav} className="mt-4" />
      </nav>

      <div className="border-t border-gray-100 px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}

function NavSection({
  title,
  items,
  className = '',
}: {
  title: string
  items: { to: string; label: string; icon: ElementType; badge?: number }[]
  className?: string
}) {
  return (
    <div className={className}>
      <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-gray-400">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map(({ to, label, icon: Icon, badge }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-light font-medium text-primary'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge !== undefined && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white">
                  {badge}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
