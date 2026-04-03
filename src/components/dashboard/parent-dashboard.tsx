"use client";

import { useState, useEffect, useCallback } from "react";
import { getStudents, getEvents, getInvoices, getExamMarks } from "@/lib/supabase/queries";
import type { Student, SchoolEvent, Invoice, ExamMarkEntry } from "@/lib/types";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ClipboardCheck, Wallet, Calendar, BookOpen, Bell } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

function markToGrade(mark: number): string {
  if (mark >= 90) return "A*";
  if (mark >= 80) return "A";
  if (mark >= 70) return "B+";
  if (mark >= 60) return "B";
  if (mark >= 50) return "C";
  if (mark >= 40) return "D";
  return "F";
}

export function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<{ name: string; grade: string; attendance: number; feeBalance: number; avgMark: number }[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [grades, setGrades] = useState<{ child: string; subject: string; mark: number; grade: string; date: string }[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [students, evts, invoices, marks] = await Promise.all([
        getStudents(), getEvents(), getInvoices(), getExamMarks("e1"),
      ]);
      // Pick first 2 students as "children" for parent view
      const active = students.filter(s => s.status === "active").slice(0, 2);
      const childData = active.map(s => {
        const inv = invoices.filter(i => i.student_id === s.id);
        const balance = inv.reduce((sum, i) => sum + Number(i.balance), 0);
        const stuMarks = marks.filter(m => m.student_id === s.id);
        const avg = stuMarks.length > 0 ? Math.round(stuMarks.reduce((sum, m) => sum + Number(m.mark), 0) / stuMarks.length) : 0;
        return { name: `${s.first_name} ${s.last_name}`, grade: s.stream_name || s.grade_name || "—", attendance: 94, feeBalance: balance, avgMark: avg };
      });
      setChildren(childData);
      setEvents(evts);
      const gradeData = marks.slice(0, 6).map(m => ({
        child: (m.student_name || "").split(" ")[0],
        subject: m.subject,
        mark: Number(m.mark),
        grade: markToGrade(Number(m.mark)),
        date: m.created_at ? new Date(m.created_at).toLocaleDateString("en-GB", { month: "short", day: "numeric" }) : "—",
      }));
      setGrades(gradeData);
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const totalBalance = children.reduce((s, c) => s + c.feeBalance, 0);
  const avgPerformance = children.length > 0 ? Math.round(children.reduce((s, c) => s + c.avgMark, 0) / children.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Portal</h1>
        <p className="text-muted-foreground mt-1">Welcome, {user?.first_name}. Track your children&apos;s progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Children Enrolled" value={children.length} change="Harare High School" changeType="neutral" icon={GraduationCap} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Avg Attendance" value="94%" change="Good standing" changeType="positive" icon={ClipboardCheck} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Fee Balance" value={`$${totalBalance}`} change={`${children.filter(c => c.feeBalance > 0).length} with balance`} changeType={totalBalance > 0 ? "negative" : "positive"} icon={Wallet} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Avg Performance" value={`${avgPerformance}%`} change={avgPerformance >= 60 ? "Good progress" : "Needs attention"} changeType={avgPerformance >= 60 ? "positive" : "negative"} icon={BookOpen} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {children.map((child) => (
          <Card key={child.name} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{child.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">{child.grade}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-lg font-bold text-emerald-700">{child.attendance}%</p>
                  <p className="text-[11px] text-emerald-600 font-medium">Attendance</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-lg font-bold text-blue-700">{child.avgMark}%</p>
                  <p className="text-[11px] text-blue-600 font-medium">Avg Mark</p>
                </div>
                <div className={`text-center p-3 rounded-xl border ${child.feeBalance > 0 ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                  <p className={`text-lg font-bold ${child.feeBalance > 0 ? "text-red-600" : "text-emerald-700"}`}>${child.feeBalance}</p>
                  <p className={`text-[11px] font-medium ${child.feeBalance > 0 ? "text-red-500" : "text-emerald-600"}`}>Balance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {grades.map((g, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div>
                  <p className="text-sm font-medium">{g.subject}</p>
                  <p className="text-xs text-muted-foreground">{g.child} · {g.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{g.mark}%</span>
                  <Badge variant="secondary" className="font-bold text-xs">{g.grade}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events.slice(0, 4).map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                <div className="w-14 text-center shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">{new Date(e.event_date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                </div>
                {e.event_type === "urgent" && <Bell className="w-4 h-4 text-red-500" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
