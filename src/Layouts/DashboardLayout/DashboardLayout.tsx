// DashboardLayout — wraps every dashboard page with the sidebar.
// React Router renders the matched child route inside <Outlet />.

import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
