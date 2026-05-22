
import { AppSidebar } from "@/Components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Outlet } from "react-router-dom";

import {
  User,
  Map,
  ClipboardList,
  BarChart3,
  Briefcase,
  Bell,
} from "lucide-react";

const linksGraduate = [
  {
    title: "Profile",
    icon: User,
    path: "/dashboardgraduate/profilepagegraduate",
    section: "OVERVIEW",
  },
  {
    title: "Roadmap",
    icon: Map,
    path: "/dashboardgraduate/roadmappagegraduate",
    section: "MANAGEMENT",
  },
  {
    title: "Assessments",
    icon: ClipboardList,
    path: "/dashboardgraduate/assessmentspagegraduate",
    section: "MANAGEMENT",
  },
  {
    title: "Score",
    icon: BarChart3,
    path: "/dashboardgraduate/scorepagegraduate",
    section: "MANAGEMENT",
  },
  {
    title: "Job Offers",
    icon: Briefcase,
    path: "/dashboardgraduate/jobofferpagegraduate",
    section: "MANAGEMENT",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/dashboardgraduate/notificationspagegraduate",
    section: "MANAGEMENT",
  },
];

const sections = ["OVERVIEW", "MANAGEMENT"];

export default function DashboardGraduate() {
  return (
    <SidebarProvider>
      <AppSidebar linksAdmin={linksGraduate} sections={sections} />

      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}