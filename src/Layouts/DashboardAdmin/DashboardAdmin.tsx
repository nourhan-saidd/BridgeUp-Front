import { AppSidebar } from "@/Components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/Components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardAdmin() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
