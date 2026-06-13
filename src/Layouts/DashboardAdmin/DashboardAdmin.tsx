import { AppSidebar } from "@/Components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Outlet } from "react-router-dom";

import {
  LayoutGrid,
  Users,
  Building2,
  ClipboardList,
  Map,
  BarChart3,
} from "lucide-react";

const links = [
  {
    title: "Overview",
    icon: LayoutGrid,
    path: "/dashboardadmin/overview",
    section: "OVERVIEW",
  },
  {
    title: "Graduates",
    icon: Users,
    path: "/dashboardadmin/graduates",
    section: "MANAGEMENT",
  },
  {
    title: "Companies",
    icon: Building2,
    path: "/dashboardadmin/companies",
    section: "MANAGEMENT",
  },
  {
    title: "Assessments",
    icon: ClipboardList,
    path: "/dashboardadmin/assessments",
    section: "MANAGEMENT",
  },
  {
    title: "Roadmaps",
    icon: Map,
    path: "/dashboardadmin/roadmap",
    section: "MANAGEMENT",
  },
  {
    title: "Reports",
    icon: BarChart3,
    path: "/dashboardadmin/reports",
    section: "ANALYTICS",
  },
  {
    title: "Star Companies",
    icon: BarChart3,
    path: "/dashboardadmin/starcompanies",
    section: "MANAGEMENT",
  },
  {
    title: "Star Graduates",
    icon: BarChart3,
    path: "/dashboardadmin/stargraduates",
    section: "MANAGEMENT",
  },
  {
    title: "Support Message",
    icon: BarChart3,
    path: "/dashboardadmin/supportmessage",
    section: "MANAGEMENT",
  },
];

const sections = ["OVERVIEW", "MANAGEMENT", "ANALYTICS"];

export default function DashboardAdmin() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen overflow-x-hidden">

        {/* Sidebar */}
        <AppSidebar linksAdmin={links} sections={sections} />

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0">
          <SidebarTrigger />

          <div className="p-4">
            <Outlet />
          </div>
        </main>

      </div>
    </SidebarProvider>
  );
}