import {
  LogOut,
  Shield,
  Gift,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "./sidebar";

import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "@/Context/AuthContext/AuthContextProvider";

type LinkItem = {
  title: string;
  icon: any;
  path: string;
  section: string;
};

type AppSidebarProps = {
  linksAdmin: LinkItem[];
  sections: string[];
};

const getLinkStyle = (isActive: boolean) => {
  if (isActive) {
    return "bg-[#5B4BDB] text-white";
  }
  return "text-gray-700 hover:bg-[#ECE9FF] hover:text-[#5B4BDB]";
};

export function AppSidebar({ linksAdmin, sections }: AppSidebarProps) {
  const { getRemoveLogin } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    getRemoveLogin();
    navigate("/login");
  };

  return (
    <Sidebar className="border-r bg-white">
      {/* HEADER */}
      <SidebarHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5B4BDB]">
            <Gift className="text-white" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-[#5B4BDB]">BridgeUp</h1>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-[15px] font-medium">
          <Shield size={18} />
          Admin Panel
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-4 py-6">
        {sections.map((section) => (
          <SidebarGroup key={section} className="mt-8 first:mt-0">
            <p className="mb-4 px-2 text-xs tracking-[2px] text-gray-500">
              {section}
            </p>

            <div className="flex flex-col gap-2">
              {linksAdmin
                .filter((item) => item.section === section)
                .map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${getLinkStyle(isActive)}`
                    }
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.title}</span>
                  </NavLink>
                ))}
            </div>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-700 hover:bg-[#ECE9FF] hover:text-[#5B4BDB]"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}