import { NavLink, Outlet } from "react-router-dom";

export default function CompaniesAdmin() {
  return (
    <div className="min-h-screen bg-[#f3f0ff] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Manage Companies
        </h1>

        <div className="flex gap-3 mb-8">
          <NavLink
            to="allcompanies"
            className={({ isActive }) =>
              isActive
                ? "px-6 py-3 rounded-2xl bg-[#5b4b8a] text-white font-semibold"
                : "px-6 py-3 rounded-2xl bg-white border"
            }
          >
            All Companies
          </NavLink>

          <NavLink
            to="pendingcompanies"
            className={({ isActive }) =>
              isActive
                ? "px-6 py-3 rounded-2xl bg-[#5b4b8a] text-white font-semibold"
                : "px-6 py-3 rounded-2xl bg-white border"
            }
          >
            Pending Companies
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}