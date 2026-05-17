import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'locked' | 'primary' | 'neutral'

const variants: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  locked: 'bg-locked-bg text-locked-text',
  primary: 'bg-primary-light text-primary',
  neutral: 'bg-gray-100 text-gray-500',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

export default function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
