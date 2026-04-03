"use client";

import { useState, useEffect, useCallback } from "react";
import { getDashboardStats, getStudents, getInvoices } from "@/lib/supabase/queries";
import type { DashboardStats, Student, Invoice } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { Download, FileSpreadsheet, FileText, Printer, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#166534", "#CA8A04", "#DC2626", "#2563eb", "#7c3aed"];

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats>({ totalStudents: 0, totalStaff: 0, attendanceRate: 0, feesCollected: 0, feesOutstanding: 0, enrollmentTrend: [], attendanceTrend: [], feeCollection: [], genderDistribution: [], gradeDistribution: [] });
  const [students, setStudents] = useState<Student[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [s, st, inv] = await Promise.all([getDashboardStats(), getStudents(), getInvoices()]);
      setStats(s); setStudents(st); setInvoices(inv);
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const enrollmentByType = [
    { type: "Government", count: 85 },
    { type: "Private", count: 30 },
  ];

  const beamStats = [
    { category: "BEAM Beneficiaries", count: students.filter(s => s.is_beam_beneficiary).length },
    { category: "Orphans/OVC", count: students.filter(s => s.is_orphan).length },
    { category: "Special Needs", count: students.filter(s => s.has_special_needs).length },
  ];

  const feeByMethod = [
    { method: "Cash", amount: 4200 },
    { method: "EcoCash", amount: 3800 },
    { method: "Bank Transfer", amount: 2500 },
    { method: "BEAM", amount: 1800 },
    { method: "InnBucks", amount: 900 },
  ];

  const monthlyAttendance = [
    { month: "Jan", rate: 91 },
    { month: "Feb", rate: 88 },
    { month: "Mar", rate: 90 },
  ];

  const handleExport = (format: string) => {
    toast.success(`Report exported as ${format}`, { description: "Download will start shortly" });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" description="Comprehensive school performance reports">
        <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
          <FileText className="w-4 h-4 mr-2" /> PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("Print")}>
          <Printer className="w-4 h-4 mr-2" /> Print
        </Button>
      </PageHeader>

      <Tabs defaultValue="enrollment">
        <TabsList className="flex-wrap">
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="welfare">Welfare</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollment" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Gender Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.genderDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="count" nameKey="gender" label={({ name, value }: { name?: string; value?: number }) => `${name}: ${value}`}>
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
              <CardHeader><CardTitle className="text-base">Students per Grade</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#166534" radius={[4, 4, 0, 0]} name="Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Enrollment Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Grade</TableHead>
                      <TableHead className="text-center">Male</TableHead>
                      <TableHead className="text-center">Female</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">BEAM</TableHead>
                      <TableHead className="text-center">Orphans</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Form 1", "Form 2", "Form 3", "Form 4"].map((grade) => {
                      const gradeStudents = students.filter(s => s.grade_name === grade && s.status === "active");
                      const male = gradeStudents.filter(s => s.gender === "male").length;
                      const female = gradeStudents.filter(s => s.gender === "female").length;
                      const beam = gradeStudents.filter(s => s.is_beam_beneficiary).length;
                      const orphans = gradeStudents.filter(s => s.is_orphan).length;
                      return (
                        <TableRow key={grade}>
                          <TableCell className="font-medium">{grade}</TableCell>
                          <TableCell className="text-center">{male}</TableCell>
                          <TableCell className="text-center">{female}</TableCell>
                          <TableCell className="text-center font-bold">{male + female}</TableCell>
                          <TableCell className="text-center">{beam}</TableCell>
                          <TableCell className="text-center">{orphans}</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/30 font-bold">
                      <TableCell>TOTAL</TableCell>
                      <TableCell className="text-center">{students.filter(s => s.gender === "male" && s.status === "active").length}</TableCell>
                      <TableCell className="text-center">{students.filter(s => s.gender === "female" && s.status === "active").length}</TableCell>
                      <TableCell className="text-center">{students.filter(s => s.status === "active").length}</TableCell>
                      <TableCell className="text-center">{students.filter(s => s.is_beam_beneficiary && s.status === "active").length}</TableCell>
                      <TableCell className="text-center">{students.filter(s => s.is_orphan && s.status === "active").length}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Attendance Trend</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[70, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#166534" strokeWidth={2} dot={{ fill: "#166534", r: 5 }} name="Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Fee Collection by Method</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={feeByMethod} cx="50%" cy="50%" outerRadius={90} dataKey="amount" nameKey="method" label={({ name, value }: { name?: string; value?: number }) => `${name}: $${value}`}>
                        {feeByMethod.map((_, idx) => (
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
              <CardHeader><CardTitle className="text-base">Fee Collection Trend</CardTitle></CardHeader>
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
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Invoice Status Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { status: "paid", label: "Fully Paid", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
                  { status: "partial", label: "Partial", color: "bg-amber-100 text-amber-800 border-amber-200" },
                  { status: "pending", label: "Pending", color: "bg-red-100 text-red-800 border-red-200" },
                ].map(({ status, label, color }) => {
                  const count = invoices.filter(i => i.status === status).length;
                  const amount = invoices.filter(i => i.status === status).reduce((s, i) => s + i.balance, 0);
                  return (
                    <div key={status} className={`p-4 rounded-lg border ${color}`}>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs mt-1">Balance: ${amount.toLocaleString()}</p>
                    </div>
                  );
                })}
                <div className="p-4 rounded-lg border bg-blue-100 text-blue-800 border-blue-200">
                  <p className="text-2xl font-bold">{invoices.length}</p>
                  <p className="text-sm font-medium">Total Invoices</p>
                  <p className="text-xs mt-1">Billed: ${invoices.reduce((s, i) => s + i.total_amount, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welfare" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Welfare & Vulnerable Children Report</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {beamStats.map((item) => (
                  <div key={item.category} className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                    <p className="text-2xl font-bold text-amber-800">{item.count}</p>
                    <p className="text-sm text-amber-700 font-medium">{item.category}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                This report provides a summary of vulnerable children receiving government and NGO support.
                BEAM beneficiary data is tracked per student and can be exported for Ministry reporting.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
