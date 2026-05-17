import { Video, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

type PhaseStatus = 'completed' | 'in-progress' | 'locked'

interface Phase {
  title: string
  status: PhaseStatus
  videos: number
  documents: number
  progress: number
  action?: { label: string; variant: 'primary' | 'outline' }
}

const phases: Phase[] = [
  {
    title: 'Phase 1: HTML & CSS Basics',
    status: 'completed',
    videos: 12,
    documents: 8,
    progress: 100,
    action: { label: 'Review', variant: 'outline' },
  },
  {
    title: 'Phase 2: JavaScript Fundamentals',
    status: 'in-progress',
    videos: 20,
    documents: 15,
    progress: 70,
    action: { label: 'Continue', variant: 'primary' },
  },
  {
    title: 'Phase 3: React Framework',
    status: 'locked',
    videos: 25,
    documents: 20,
    progress: 0,
  },
  {
    title: 'Phase 4: State Management',
    status: 'locked',
    videos: 18,
    documents: 12,
    progress: 0,
  },
]

const statusBadge: Record<PhaseStatus, { label: string; variant: 'success' | 'warning' | 'locked' }> = {
  completed: { label: 'Completed', variant: 'success' },
  'in-progress': { label: 'In Progress', variant: 'warning' },
  locked: { label: 'Locked', variant: 'locked' },
}

export default function RoadmapPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Learning Roadmap</h1>

      <div className="mb-6 rounded-xl bg-primary p-6 text-white">
        <h2 className="text-xl font-bold">Frontend Development Track</h2>
        <p className="mt-1 text-sm text-white/80">
          Complete all phases to become job-ready
        </p>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">60%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/30">
            <div className="h-full w-[60%] rounded-full bg-white" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => {
          const badge = statusBadge[phase.status]
          const isLocked = phase.status === 'locked'
          return (
            <div
              key={phase.title}
              className={`relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm ${
                isLocked ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}
                    >
                      {phase.title}
                    </h3>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Video size={14} />
                      {phase.videos} Videos
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={14} />
                      {phase.documents} Documents
                    </span>
                  </div>
                </div>
                {phase.action && (
                  <Button variant={phase.action.variant}>
                    {phase.action.label}
                  </Button>
                )}
              </div>
              <div className="h-1 bg-gray-100">
                <div
                  className={`h-full ${isLocked ? 'bg-gray-200' : 'bg-primary'}`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
