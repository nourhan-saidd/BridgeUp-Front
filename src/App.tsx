import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import ProfilePage from './pages/ProfilePage'
import RoadmapPage from './pages/RoadmapPage'
import AssessmentsPage from './pages/AssessmentsPage'
import ScoresPage from './pages/ScoresPage'
import JobOffersPage from './pages/JobOffersPage'
import NotificationsPage from './pages/NotificationsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="scores" element={<ScoresPage />} />
        <Route path="job-offers" element={<JobOffersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  )
}
