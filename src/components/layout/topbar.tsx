"use client";

import { useAuth } from "@/providers/auth-provider";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "./mobile-nav";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  ministry_admin: "Ministry Admin",
  provincial_admin: "Provincial Admin",
  district_admin: "District Admin",
  school_admin: "School Admin",
  bursar: "Bursar",
  teacher: "Teacher",
  parent: "Parent",
};

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`
    : "?";

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-16 px-4 lg:px-6 bg-card/80 backdrop-blur-xl border-b border-border/60">
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
          <Menu className="w-5 h-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <MobileNav />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              placeholder="Search students, staff, records..."
              className="pl-9 h-9 bg-muted/40 border-0 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:bg-muted/60 transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 md:hidden" />

        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">Harare High School</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="flex items-center gap-2 px-2" />}>
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5 font-normal">
                  {user ? ROLE_LABELS[user.role] : ""}
                </Badge>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.first_name} {user?.last_name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
