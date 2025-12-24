import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  Megaphone,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Students", path: "/students" },
  { icon: GraduationCap, label: "Teachers", path: "/teachers" },
  { icon: DollarSign, label: "Fees", path: "/fees" },
  { icon: Megaphone, label: "Announcements", path: "/announcements" },
  { icon: FileText, label: "Requests", path: "/requests" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 hidden lg:flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <School className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-display font-bold text-sidebar-foreground">
              EduAdmin
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="p-4 rounded-xl bg-sidebar-accent">
            <p className="text-sm font-medium text-sidebar-foreground">
              Need Help?
            </p>
            <p className="text-xs text-sidebar-foreground/70 mt-1">
              Check our documentation
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
