import { Award } from 'lucide-react'
import Badge from '../components/ui/Badge'

const scoreCards = [
  { title: 'IQ Assessment', score: '85', badge: 'Excellent', variant: 'success' as const },
  { title: 'English Proficiency', score: '92', badge: 'Outstanding', variant: 'success' as const },
  { title: 'Technical Skills', score: '—', badge: 'Pending', variant: 'primary' as const },
]

const performance = [
  { label: 'Logical Reasoning', value: 88 },
  { label: 'Problem Solving', value: 82 },
  { label: 'English Grammar', value: 95 },
  { label: 'Reading Comprehension', value: 89 },
]

const achievements = [
  { title: 'Top 10% IQ Score', earned: true },
  { title: 'Fast Learner', sub: 'Roadmap Progress', earned: true },
  { title: 'Technical Pro', earned: false },
  { title: 'All Complete', earned: false },
]

export default function ScoresPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Scores</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {scoreCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="mt-2 text-4xl font-bold text-primary">{card.score}</p>
            <div className="mt-3 flex justify-center">
              <Badge variant={card.variant}>{card.badge}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Performance Overview
        </h2>
        <div className="space-y-4">
          {performance.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-44 shrink-0 text-sm text-gray-600">
                {item.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.value}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-medium text-gray-700">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Achievements</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {achievements.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col items-center rounded-xl p-5 text-center ${
                item.earned ? 'bg-primary-light/50' : ''
              }`}
            >
              <Award
                size={32}
                className={item.earned ? 'text-primary' : 'text-gray-300'}
              />
              <p
                className={`mt-3 text-sm font-medium ${
                  item.earned ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {item.title}
              </p>
              {item.sub && (
                <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
              )}
              {!item.earned && (
                <p className="mt-1 text-xs text-gray-400">Locked</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
