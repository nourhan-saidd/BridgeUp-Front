import { AppSidebar } from "@/Components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Outlet } from "react-router-dom";

import {
  Building2,
  Users,
  Bell,
  Send,
  Bookmark,
} from "lucide-react";

const linksCompany = [
  {
    title: "Company Profile",
    icon: Building2,
    path: "/dashboardCompany/companyprofile",
    section: "OVERVIEW",
  },
  {
    title: "Browse Graduates",
    icon: Users,
    path: "/dashboardCompany/browsegraduate",
    section: "MANAGEMENT",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/dashboardCompany/notifications",
    section: "MANAGEMENT",
  },
  {
    title: "Send Requests",
    icon: Send,
    path: "/dashboardCompany/sendrequests",
    section: "MANAGEMENT",
  },
  {
    title: "shortlisted",
    icon: Bookmark,
    path: "/dashboardCompany/shortlisted",
    section: "MANAGEMENT",
  },
];

const sections = ["OVERVIEW", "MANAGEMENT"];

export default function DashboardCompany() {
  return (
    <SidebarProvider>
      <AppSidebar linksAdmin={linksCompany} sections={sections} />

      <main   className="flex-1 min-h-screen w-full overflow-y-auto bg-gray-50">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}