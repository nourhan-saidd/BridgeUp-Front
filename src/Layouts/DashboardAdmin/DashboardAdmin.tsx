import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar/Sidebar";

export default function DashboardAdmin() {
  return (
    <>
    <Sidebar/>
    <Outlet/>
    </>
  )
}
