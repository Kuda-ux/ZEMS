"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard, GraduationCap, ClipboardCheck, Wallet, BookOpen,
  FileText, Users, ShieldAlert, MessageSquare, Calendar, Heart,
  Package, BarChart3, ScrollText, Settings,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, GraduationCap, ClipboardCheck, Wallet, BookOpen,
  FileText, Users, ShieldAlert, MessageSquare, Calendar, Heart,
  Package, BarChart3, ScrollText, Settings,
};

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNav = NAV_ITEMS.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
          Z
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight">{APP_NAME}</span>
          <span className="text-[10px] text-sidebar-foreground/60 leading-none">
            Education Management
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredNav.map((item) => {
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {Icon && <Icon className="w-5 h-5 shrink-0" />}
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
