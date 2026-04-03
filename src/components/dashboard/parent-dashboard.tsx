"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ClipboardCheck, Wallet, Calendar, BookOpen, Bell } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

const myChildren = [
  { name: "Tatenda Mutasa", grade: "Form 2 A", attendance: 94, feeBalance: 150, avgMark: 72 },
  { name: "Ruvimbo Mutasa", grade: "Form 4 B", attendance: 97, feeBalance: 0, avgMark: 81 },
];

const upcomingEvents = [
  { date: "Mar 10", title: "ZIMSEC Registration Deadline", type: "urgent" },
  { date: "Mar 15", title: "Sports Day", type: "event" },
  { date: "Mar 28", title: "End of Term 1", type: "info" },
  { date: "Apr 2", title: "Report Card Collection", type: "info" },
];

const recentGrades = [
  { child: "Tatenda", subject: "Mathematics", mark: 68, grade: "B", date: "Feb 20" },
  { child: "Tatenda", subject: "English", mark: 75, grade: "B+", date: "Feb 18" },
  { child: "Ruvimbo", subject: "Biology", mark: 85, grade: "A", date: "Feb 20" },
  { child: "Ruvimbo", subject: "Chemistry", mark: 78, grade: "B+", date: "Feb 19" },
];

export function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Parent Portal</h1>
        <p className="text-muted-foreground mt-1">Welcome, {user?.first_name}. Track your children&apos;s progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Children Enrolled" value={2} change="Harare High School" changeType="neutral" icon={GraduationCap} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Avg Attendance" value="95.5%" change="Excellent standing" changeType="positive" icon={ClipboardCheck} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Fee Balance" value="$150" change="1 child with balance" changeType="negative" icon={Wallet} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Avg Performance" value="76.5%" change="+3% from last term" changeType="positive" icon={BookOpen} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      {/* Children Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {myChildren.map((child) => (
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
            {recentGrades.map((g, i) => (
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
            {upcomingEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                <div className="w-14 text-center shrink-0">
                  <span className="text-xs font-semibold text-muted-foreground">{e.date}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                </div>
                {e.type === "urgent" && <Bell className="w-4 h-4 text-red-500" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
