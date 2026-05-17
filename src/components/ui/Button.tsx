import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark border border-primary',
  outline:
    'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-600 hover:text-gray-900 border-transparent',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
