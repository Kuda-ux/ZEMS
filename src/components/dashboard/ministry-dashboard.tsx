"use client";

import { useState, useEffect, useCallback } from "react";
import { getStudents, getStaff } from "@/lib/supabase/queries";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, Users, TrendingUp, MapPin, BarChart3 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MinistryDashboard() {
  const { user } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [gradeEnrollment, setGradeEnrollment] = useState<{ name: string; value: number }[]>([]);
  const [gradeTable, setGradeTable] = useState<{ grade: string; students: number; teachers: number }[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [students, staffData] = await Promise.all([getStudents(), getStaff()]);
      const active = students.filter(s => s.status === "active");
      const teachers = staffData.filter(s => s.staff_type === "teaching" && s.status === "active");
      setTotalStudents(active.length);
      setTotalTeachers(teachers.length);
      const grades = ["Form 1", "Form 2", "Form 3", "Form 4"];
      setGradeEnrollment(grades.map(g => ({ name: g, value: active.filter(s => s.grade_name === g).length })));
      setGradeTable(grades.map(g => ({
        grade: g,
        students: active.filter(s => s.grade_name === g).length,
        teachers: Math.ceil(teachers.length / grades.length),
      })));
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const teacherRatio = totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ministry Dashboard</h1>
        <p className="text-muted-foreground mt-1">National education overview — Welcome, {user?.first_name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Schools" value={1} change="Registered on ZEMS" changeType="positive" icon={Building2} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Total Students" value={totalStudents} change="Active enrollment" changeType="positive" icon={GraduationCap} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Total Teachers" value={totalTeachers} change={`1:${teacherRatio} ratio`} changeType="neutral" icon={Users} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Staff Total" value={totalTeachers} change="Teaching staff" changeType="positive" icon={TrendingUp} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Enrollment by Grade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeEnrollment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => typeof v === "number" ? v.toLocaleString() : v} />
                <Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Grade Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Grade</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Students</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Teachers</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {gradeTable.map((p) => (
                  <tr key={p.grade} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{p.grade}</td>
                    <td className="py-3 px-4 text-right">{p.students.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{p.teachers.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="secondary" className="text-xs">{p.teachers > 0 ? `1:${Math.round(p.students / p.teachers)}` : '—'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
