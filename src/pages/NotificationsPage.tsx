import type { ElementType } from 'react'
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Mail,
} from 'lucide-react'

interface Notification {
  id: number
  title: string
  description: string
  time: string
  unread: boolean
  icon: ElementType
  iconBg: string
  iconColor: string
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'New Job Offer',
    description: 'TechCorp has sent you a job offer for Frontend Developer.',
    time: '2 hours ago',
    unread: true,
    icon: Briefcase,
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    title: 'Assessment Reminder',
    description: 'You still have the Technical Skills assessment pending.',
    time: '1 day ago',
    unread: true,
    icon: Clock,
    iconBg: 'bg-warning-bg',
    iconColor: 'text-warning-text',
  },
  {
    id: 3,
    title: 'Roadmap Progress',
    description: 'Great job! You completed Phase 1 of your learning roadmap.',
    time: '3 days ago',
    unread: false,
    icon: CheckCircle2,
    iconBg: 'bg-success-bg',
    iconColor: 'text-success-text',
  },
  {
    id: 4,
    title: 'Profile Viewed',
    description: 'A recruiter from Digital Solutions viewed your profile.',
    time: '5 days ago',
    unread: false,
    icon: Mail,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 5,
    title: 'New Job Offer',
    description: 'Digital Solutions has sent you a job offer.',
    time: '5 days ago',
    unread: false,
    icon: Briefcase,
    iconBg: 'bg-primary-light',
    iconColor: 'text-primary',
  },
]

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`relative flex items-start gap-4 rounded-xl border p-5 transition-colors ${
              n.unread
                ? 'border-primary/20 bg-primary-light/40'
                : 'border-gray-100 bg-white'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.iconBg}`}
            >
              <n.icon size={18} className={n.iconColor} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{n.title}</h3>
              <p className="mt-0.5 text-sm text-gray-600">{n.description}</p>
              <p className="mt-2 text-xs text-gray-400">{n.time}</p>
            </div>
            {n.unread && (
              <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
