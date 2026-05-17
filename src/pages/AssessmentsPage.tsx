import { Award, Clock, FileText } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const assessments = [
  {
    title: 'IQ Assessment',
    status: 'completed' as const,
    score: 85,
    description:
      'Test your logical reasoning and problem-solving abilities.',
    duration: '45 minutes',
    questions: 40,
  },
  {
    title: 'English Proficiency',
    status: 'completed' as const,
    score: 92,
    description:
      'Evaluate your English grammar, vocabulary, and comprehension skills.',
    duration: '30 minutes',
    questions: 35,
  },
  {
    title: 'Technical Skills',
    status: 'available' as const,
    description:
      'Demonstrate your frontend development knowledge and coding skills.',
    duration: '60 minutes',
    questions: 50,
  },
]

export default function AssessmentsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Assessments</h1>

      <div className="mb-6 flex items-start gap-4 rounded-xl bg-primary-light p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Award size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">Complete All Assessments</h2>
          <p className="mt-1 text-sm text-gray-600">
            Assessments help companies understand your skills. Complete all three
            to increase your chances of getting hired.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {assessments.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                {item.status === 'completed' ? (
                  <Badge variant="success">
                    Completed - {item.score}%
                  </Badge>
                ) : (
                  <Badge variant="warning">Available</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {item.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FileText size={14} />
                  {item.questions} questions
                </span>
              </div>
            </div>
            {item.status === 'completed' ? (
              <Button variant="outline">View Results</Button>
            ) : (
              <Button>Start Assessment</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
