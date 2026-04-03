"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard, GraduationCap, ClipboardCheck, Wallet, BookOpen,
  FileText, Users, ShieldAlert, MessageSquare, Calendar, Heart,
  Package, BarChart3, ScrollText, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, GraduationCap, ClipboardCheck, Wallet, BookOpen,
  FileText, Users, ShieldAlert, MessageSquare, Calendar, Heart,
  Package, BarChart3, ScrollText, Settings,
};

const NAV_SECTIONS = [
  { label: "Overview", items: ["Dashboard"] },
  { label: "Core", items: ["Students", "Attendance", "Fees & Finance", "Academics", "Exams & Results"] },
  { label: "Operations", items: ["Staff", "Discipline", "Communications", "Timetable"] },
  { label: "Support", items: ["Welfare", "Inventory", "Reports"] },
  { label: "System", items: ["Audit Logs", "Settings"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/20 font-extrabold text-emerald-950 text-sm">
          Z
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight">{APP_NAME}</span>
            <span className="text-[10px] text-sidebar-foreground/60 leading-none">
              Education Management
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_SECTIONS.map((section) => {
          const sectionItems = filteredNav.filter((item) => section.items.includes(item.title));
          if (sectionItems.length === 0) return null;
          return (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-foreground/40">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {sectionItems.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                      )}
                      title={collapsed ? item.title : undefined}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
                      )}
                      {Icon && <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-sidebar-primary")} />}
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/60"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
