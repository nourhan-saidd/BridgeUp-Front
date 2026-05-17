import { useRef, useState, type ChangeEvent } from 'react'
import {
  TrendingUp,
  CheckCircle2,
  Briefcase,
  Upload,
  FileText,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const stats = [
  {
    label: 'Profile Completion',
    value: '75%',
    icon: TrendingUp,
    progress: 75,
  },
  {
    label: 'Exams Done',
    value: '2/3',
    sub: 'Technical remaining',
    icon: CheckCircle2,
  },
  {
    label: 'Job Offers',
    value: '2',
    sub: 'Awaiting your reply',
    icon: Briefcase,
  },
]

const fields = [
  { label: 'Name', value: 'Ahmed Hassan' },
  { label: 'Email', value: 'ahmed@gmail.com' },
  { label: 'Age', value: '23 years' },
  { label: 'Graduation Year', value: '2024' },
  { label: 'Track', value: 'Frontend Track', tag: true },
  { label: 'Phone', value: '+20 100 000 0000' },
  { label: 'University', value: 'Cairo University' },
]

function formatUploadedAt(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Uploaded today'
  if (diffDays === 1) return 'Uploaded yesterday'
  return `Uploaded ${diffDays} days ago`
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [cvFileName, setCvFileName] = useState('CV_Ahmed_Hassan.pdf')
  const [cvUploadedAt, setCvUploadedAt] = useState(
    () => new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  )
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(null), 3000)
  }

  function handleCvUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file only.')
      e.target.value = ''
      return
    }

    setCvFileName(file.name)
    setCvUploadedAt(new Date())
    showToast(`CV updated: ${file.name}`)
    e.target.value = ''
  }

  return (
    <div>
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Profile</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <stat.icon
              size={18}
              className="absolute right-5 top-5 text-primary"
            />
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
            {stat.progress !== undefined && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
            {stat.sub && (
              <p className="mt-1 text-xs text-gray-500">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <Button variant="outline">Edit Password</Button>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-white">
            AH
          </div>
          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <p className="text-xs text-gray-500">{field.label}</p>
                {field.tag ? (
                  <Badge variant="primary">{field.value}</Badge>
                ) : (
                  <p className="mt-0.5 text-sm font-medium text-gray-900">
                    {field.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Documents</h2>

        <div className="flex flex-col gap-3 rounded-lg bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{cvFileName}</p>
              <p className="text-xs text-gray-500">
                {formatUploadedAt(cvUploadedAt)}
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleCvUpload}
          />
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Update CV
          </Button>
        </div>
      </div>
    </div>
  )
}
