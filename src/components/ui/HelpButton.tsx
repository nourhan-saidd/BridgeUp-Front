import { HelpCircle } from 'lucide-react'

export default function HelpButton() {
  return (
    <button
      type="button"
      aria-label="Help"
      className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
    >
      <HelpCircle size={22} />
    </button>
  )
}
