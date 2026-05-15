// App — defines all routes for the BridgeUp company dashboard.
// Drop this <App /> into your existing main.tsx (already wrapped in BrowserRouter).
//
// If your main.tsx doesn't have <BrowserRouter> yet, wrap it like:
//   <BrowserRouter><App /></BrowserRouter>
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./Layouts/DashboardLayout/DashboardLayout";
import CompanyProfile from "./Pages/CompanyProfile/CompanyProfile";
import BrowseGraduates from "./Pages/BrowseGraduates/BrowseGraduates";
import Shortlisted from "./Pages/Shortlisted/Shortlisted";
import SentRequests from "./Pages/SentRequests/SentRequests";
import Notifications from "./Pages/Notifications/Notifications";

export default function App() {
  return (
    <Routes>
      {/* Every dashboard route renders inside DashboardLayout (sidebar + content). */}
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/company-profile" replace />} />
        <Route path="/company-profile"  element={<CompanyProfile />} />
        <Route path="/browse-graduates" element={<BrowseGraduates />} />
        <Route path="/shortlisted"      element={<Shortlisted />} />
        <Route path="/sent-requests"    element={<SentRequests />} />
        <Route path="/notifications"    element={<Notifications />} />
      </Route>
    </Routes>
  );
}
