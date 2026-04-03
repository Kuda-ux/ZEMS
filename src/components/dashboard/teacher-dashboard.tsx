"use client";

import { useState, useEffect, useCallback } from "react";
import { getTimetableSlots, getStudents, getExams } from "@/lib/supabase/queries";
import type { TimetableSlot, ExamEntry } from "@/lib/types";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, BookOpen, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

function getScheduleStatus(time: string): string {
  const now = new Date();
  const [start] = time.split(" - ");
  const [h, m] = start.split(":").map(Number);
  const slotTime = new Date(); slotTime.setHours(h, m, 0, 0);
  const diff = (slotTime.getTime() - now.getTime()) / 60000;
  if (diff < -40) return "completed";
  if (diff < 0) return "current";
  return "upcoming";
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [examCount, setExamCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [slots, students, exams] = await Promise.all([
        getTimetableSlots("Form 1 A"),
        getStudents(),
        getExams(),
      ]);
      const today = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
      setSchedule(slots.filter(s => s.day_of_week.toLowerCase() === today));
      setStudentCount(students.filter(s => s.status === "active").length);
      setExamCount(exams.filter(e => e.status === "draft" || e.status === "active").length);
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const todaySchedule = schedule.map(s => ({
    time: s.time_slot.split(" - ")[0],
    subject: s.subject,
    cls: s.stream_name,
    room: s.room || "—",
    status: getScheduleStatus(s.time_slot),
  }));

  const tasks = [
    { task: "Review pending exam marks", due: "Today", priority: examCount > 0 ? "urgent" : "medium" },
    { task: "Update attendance records", due: "Today", priority: "high" },
    { task: "Prepare lesson plans", due: "This week", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Good morning, {user?.first_name} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your teaching overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Students" value={studentCount} change="Active students" changeType="neutral" icon={Users} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Today's Classes" value={todaySchedule.length} change={`${todaySchedule.filter(s => s.status === "completed").length} completed`} changeType="positive" icon={ClipboardCheck} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Schedule" value={todaySchedule.length > 0 ? todaySchedule.length : "—"} change="Today's periods" changeType="neutral" icon={BookOpen} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Pending Exams" value={examCount} change={examCount > 0 ? "Need attention" : "All clear"} changeType={examCount > 0 ? "negative" : "positive"} icon={AlertCircle} iconColor="text-red-600" iconBg="bg-red-100" />
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
