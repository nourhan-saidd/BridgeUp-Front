import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import HelpButton from '../ui/HelpButton'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
      <HelpButton />
    </div>
  )
}
