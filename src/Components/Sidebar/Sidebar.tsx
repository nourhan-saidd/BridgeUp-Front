// Sidebar — left navigation for the entire dashboard.
// Uses NavLink from react-router-dom so the active link highlights automatically.

import { NavLink } from "react-router-dom";
import "../Styles/sidebar.css";
import {
  Briefcase,
  Building2,
  Users,
  Award,
  Send,
  Bell,
  LogOut,
} from "lucide-react";
import { company, shortlisted, sentRequests, notifications } from "../../Data/mockData/mockData";


// One nav item config — keeps the JSX below short and consistent.
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainItems: NavItem[] = [
  { to: "/company-profile",  label: "Company Profile",  icon: <Building2 size={18} /> },
  { to: "/browse-graduates", label: "Browse Graduates", icon: <Users size={18} /> },
];

export default function Sidebar() {
  // Build pipeline items inside the component so the badge counts stay in sync.
  const pipelineItems: NavItem[] = [
    { to: "/shortlisted",   label: "Shortlisted",   icon: <Award size={18} />, badge: shortlisted.length },
    { to: "/sent-requests", label: "Sent Requests", icon: <Send size={18} />,  badge: sentRequests.length },
    { to: "/notifications", label: "Notifications", icon: <Bell size={18} />,  badge: notifications.filter(n => n.unread).length },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <Briefcase size={20} />
        </div>
        <h1 className="sidebar__logo-text">
          Bridge<span>Up</span>
        </h1>
      </div>

      {/* Company card */}
      <div className="sidebar__company">
        <div className="sidebar__company-avatar">TC</div>
        <div>
          <div className="sidebar__company-name">{company.name}</div>
          <span className="sidebar__company-status">{company.status}</span>
        </div>
      </div>

      {/* MAIN section */}
      <div className="sidebar__section-title">Main</div>
      <nav className="sidebar__nav">
        {mainItems.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}
      </nav>

      {/* PIPELINE section */}
      <div className="sidebar__section-title">Pipeline</div>
      <nav className="sidebar__nav">
        {pipelineItems.map((item) => (
          <NavItemLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Logout */}
      <button className="sidebar__logout" type="button">
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

// Small helper component so the link rendering logic is written once.
function NavItemLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
      }
    >
      <span className="sidebar__link-label">
        {item.icon}
        {item.label}
      </span>
      {item.badge !== undefined && <span className="sidebar__badge">{item.badge}</span>}
    </NavLink>
  );
}
