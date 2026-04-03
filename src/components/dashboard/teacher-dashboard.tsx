"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, BookOpen, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const todaySchedule = [
  { time: "07:30", subject: "Mathematics", cls: "Form 2 A", room: "Room 12", status: "completed" },
  { time: "08:30", subject: "Mathematics", cls: "Form 3 B", room: "Room 12", status: "completed" },
  { time: "10:00", subject: "Mathematics", cls: "Form 1 C", room: "Room 8", status: "current" },
  { time: "11:00", subject: "Free Period", cls: "—", room: "—", status: "upcoming" },
  { time: "13:00", subject: "Mathematics", cls: "Form 4 A", room: "Room 12", status: "upcoming" },
];

const tasks = [
  { task: "Mark Form 3B mid-term papers", due: "Tomorrow", priority: "high" },
  { task: "Submit Form 4A coursework marks", due: "Friday", priority: "high" },
  { task: "Update attendance for Form 2A", due: "Today", priority: "urgent" },
  { task: "Prepare lesson plan — Week 8", due: "Monday", priority: "medium" },
];

export function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Good morning, {user?.first_name} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your teaching overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={160} change="Across 4 classes" changeType="neutral" icon={Users} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Today's Attendance" value="91%" change="36 of 40 present" changeType="positive" icon={ClipboardCheck} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Classes Today" value={5} change="1 free period" changeType="neutral" icon={BookOpen} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Pending Marks" value={2} change="Form 3B, Form 4A" changeType="negative" icon={AlertCircle} iconColor="text-red-600" iconBg="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todaySchedule.map((slot, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${slot.status === "current" ? "bg-primary/5 border-primary/20" : slot.status === "completed" ? "bg-muted/40 border-border/40" : "border-border/50"}`}>
                <span className="w-14 text-sm font-semibold text-center shrink-0">{slot.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{slot.subject}</p>
                  <p className="text-xs text-muted-foreground">{slot.cls} · {slot.room}</p>
                </div>
                {slot.status === "completed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {slot.status === "current" && <Badge className="bg-primary/10 text-primary border-0 text-[11px]">Now</Badge>}
                {slot.status === "upcoming" && <Clock className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.task}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Due: {t.due}</p>
                </div>
                <Badge variant={t.priority === "urgent" ? "destructive" : t.priority === "high" ? "default" : "secondary"} className="text-[10px] shrink-0">{t.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
