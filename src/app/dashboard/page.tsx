"use client";

import { mockData } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, ClipboardCheck, Wallet, TrendingUp, AlertTriangle, Bell } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuth } from "@/providers/auth-provider";
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard";
import { BursarDashboard } from "@/components/dashboard/bursar-dashboard";
import { ParentDashboard } from "@/components/dashboard/parent-dashboard";
import { MinistryDashboard } from "@/components/dashboard/ministry-dashboard";

const COLORS = ["#166534", "#CA8A04", "#DC2626", "#2563eb"];

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = mockData.dashboardStats;

  if (user?.role === "teacher") return <TeacherDashboard />;
  if (user?.role === "bursar") return <BursarDashboard />;
  if (user?.role === "parent") return <ParentDashboard />;
  if (user?.role === "ministry_admin" || user?.role === "provincial_admin" || user?.role === "district_admin") return <MinistryDashboard />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.first_name} 👋</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your school&apos;s performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change="+12 this term"
          changeType="positive"
          icon={GraduationCap}
          iconColor="text-emerald-700"
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          change="28 active members"
          changeType="neutral"
          icon={Users}
          iconColor="text-blue-700"
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change="-2% from last week"
          changeType="negative"
          icon={ClipboardCheck}
          iconColor="text-amber-700"
          iconBg="bg-amber-100"
        />
        <StatCard
          title="Fees Collected"
          value={`$${stats.feesCollected.toLocaleString()}`}
          change={`$${stats.feesOutstanding.toLocaleString()} outstanding`}
          changeType="neutral"
          icon={Wallet}
          iconColor="text-purple-700"
          iconBg="bg-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Fee Collection Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.feeCollection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="collected" fill="#166534" radius={[4, 4, 0, 0]} name="Collected ($)" />
                  <Bar dataKey="outstanding" fill="#CA8A04" radius={[4, 4, 0, 0]} name="Outstanding ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-primary" /> Weekly Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#166534" strokeWidth={2} dot={{ fill: "#166534", r: 4 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genderDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="gender"
                    label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}
                  >
                    {stats.genderDistribution.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.gradeDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="grade" type="category" tick={{ fontSize: 12 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#166534" radius={[0, 4, 4, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4" /> Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">ZIMSEC Deadline</p>
                <p className="text-xs text-red-600 mt-0.5">Registration closes 10 March</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Fee Arrears</p>
                <p className="text-xs text-amber-600 mt-0.5">24 students with outstanding balances</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <Bell className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Staff Meeting</p>
                <p className="text-xs text-blue-600 mt-0.5">Friday at 2:00 PM — Main Hall</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Announcements</h4>
              {mockData.announcements.slice(0, 2).map((ann) => (
                <div key={ann.id} className="flex items-center justify-between py-2">
                  <span className="text-sm truncate flex-1 mr-2">{ann.title}</span>
                  <Badge variant={ann.priority === "urgent" ? "destructive" : ann.priority === "high" ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {ann.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
