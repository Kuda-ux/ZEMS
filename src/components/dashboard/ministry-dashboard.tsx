"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, GraduationCap, Users, TrendingUp, MapPin, BarChart3 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const provinceData = [
  { province: "Harare", schools: 245, students: 89200, teachers: 4100 },
  { province: "Bulawayo", schools: 128, students: 45600, teachers: 2200 },
  { province: "Manicaland", schools: 312, students: 72400, teachers: 3500 },
  { province: "Midlands", schools: 287, students: 64300, teachers: 3100 },
  { province: "Masvingo", schools: 256, students: 58700, teachers: 2800 },
];

const enrollmentByProvince = [
  { name: "HAR", value: 89200 },
  { name: "BUL", value: 45600 },
  { name: "MAN", value: 72400 },
  { name: "MID", value: 64300 },
  { name: "MSV", value: 58700 },
  { name: "MSC", value: 41200 },
  { name: "MSE", value: 38900 },
  { name: "MSW", value: 44100 },
  { name: "MTN", value: 29800 },
  { name: "MTS", value: 25400 },
];

export function MinistryDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ministry Dashboard</h1>
        <p className="text-muted-foreground mt-1">National education overview — Welcome, {user?.first_name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Schools" value="2,847" change="+12 this year" changeType="positive" icon={Building2} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Total Students" value="1.24M" change="+3.2% enrollment" changeType="positive" icon={GraduationCap} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Total Teachers" value="52,400" change="1:24 teacher ratio" changeType="neutral" icon={Users} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="National Pass Rate" value="67.8%" change="+2.1% from 2025" changeType="positive" icon={TrendingUp} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Enrollment by Province
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentByProvince}>
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
            <MapPin className="w-4 h-4 text-primary" /> Provincial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Province</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Schools</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Students</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Teachers</th>
                  <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {provinceData.map((p) => (
                  <tr key={p.province} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{p.province}</td>
                    <td className="py-3 px-4 text-right">{p.schools.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{p.students.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{p.teachers.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="secondary" className="text-xs">1:{Math.round(p.students / p.teachers)}</Badge>
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
