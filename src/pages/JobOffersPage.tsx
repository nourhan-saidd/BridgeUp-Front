import { Briefcase } from 'lucide-react'
import Button from '../components/ui/Button'

const offers = [
  {
    company: 'TechCorp',
    initial: 'T',
    role: 'Frontend Developer',
    message:
      'We were impressed by your assessment scores and would love to invite you for an interview.',
    time: '2 days ago',
  },
  {
    company: 'Digital Solutions',
    initial: 'D',
    role: 'Junior React Developer',
    message:
      'Your profile matches our requirements. We would like to discuss a potential opportunity with you.',
    time: '5 days ago',
  },
]

export default function JobOffersPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Job Offers</h1>

      <div className="mb-6 flex items-start gap-4 rounded-xl bg-primary-light p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Briefcase size={20} className="text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">You have 2 job offers!</h2>
          <p className="mt-1 text-sm text-gray-600">
            Review the offers and respond to companies
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <div
            key={offer.company}
            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-light text-lg font-bold text-primary">
                {offer.initial}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{offer.company}</p>
                <p className="text-sm text-gray-500">{offer.role}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{offer.message}</p>
            <p className="mt-2 text-xs text-gray-400">{offer.time}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button>Accept & Schedule Interview</Button>
              <Button variant="outline">View Details</Button>
              <Button variant="ghost">Decline</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
