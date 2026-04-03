"use client";

import { use } from "react";
import { mockData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Printer, User, BookOpen, ClipboardCheck, Wallet, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = mockData.students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    );
  }

  const studentAttendance = mockData.attendance.filter((a) => a.student_id === id);
  const presentCount = studentAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const attendanceRate = studentAttendance.length > 0 ? Math.round((presentCount / studentAttendance.length) * 100) : 0;

  const studentInvoices = mockData.invoices.filter((inv) => inv.student_id === id);
  const totalFees = studentInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPaid = studentInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0);

  const studentDiscipline = mockData.disciplineRecords.filter((d) => d.student_id === id);

  return (
    <div className="space-y-6">
      <PageHeader title={`${student.first_name} ${student.last_name}`} description={student.zems_id}>
        <Link href="/dashboard/students">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <Button variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-2" /> Print
        </Button>
        <Button size="sm">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-lg font-bold">{student.first_name} {student.last_name}</h2>
              <p className="text-sm text-muted-foreground font-mono">{student.zems_id}</p>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-emerald-100 text-emerald-800">{student.status}</Badge>
                {student.is_beam_beneficiary && <Badge className="bg-amber-100 text-amber-800">BEAM</Badge>}
                {student.has_special_needs && <Badge className="bg-blue-100 text-blue-800">Special Needs</Badge>}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoRow label="Grade / Class" value={student.stream_name || student.grade_name || "—"} />
              <InfoRow label="Gender" value={student.gender === "male" ? "Male" : "Female"} />
              <InfoRow label="Date of Birth" value={student.date_of_birth} />
              <InfoRow label="Nationality" value={student.nationality} />
              <InfoRow label="Language" value={student.home_language || "—"} />
              <InfoRow label="Enrollment Date" value={student.enrollment_date} />
              <InfoRow label="Address" value={student.address || "—"} />
            </div>

            <div className="mt-6 pt-4 border-t space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Guardian</h4>
              <InfoRow label="Name" value={student.guardian_name || "—"} />
              <InfoRow label="Phone" value={student.guardian_phone || "—"} />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStat icon={ClipboardCheck} label="Attendance" value={`${attendanceRate}%`} color="text-emerald-700" bg="bg-emerald-50" />
            <MiniStat icon={Wallet} label="Fees Paid" value={`$${totalPaid}`} color="text-blue-700" bg="bg-blue-50" />
            <MiniStat icon={Wallet} label="Balance" value={`$${totalFees - totalPaid}`} color="text-amber-700" bg="bg-amber-50" />
            <MiniStat icon={ShieldAlert} label="Incidents" value={String(studentDiscipline.length)} color="text-red-700" bg="bg-red-50" />
          </div>

          <Tabs defaultValue="attendance">
            <TabsList>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
              <TabsTrigger value="academics">Academics</TabsTrigger>
              <TabsTrigger value="discipline">Discipline</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Recent Attendance</CardTitle></CardHeader>
                <CardContent>
                  {studentAttendance.length > 0 ? (
                    <div className="space-y-2">
                      {studentAttendance.slice(0, 10).map((a) => (
                        <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <span className="text-sm">{a.date}</span>
                          <Badge className={
                            a.status === "present" ? "bg-emerald-100 text-emerald-800" :
                            a.status === "absent" ? "bg-red-100 text-red-800" :
                            a.status === "late" ? "bg-amber-100 text-amber-800" :
                            "bg-blue-100 text-blue-800"
                          }>{a.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No attendance records found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fees" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Fee History</CardTitle></CardHeader>
                <CardContent>
                  {studentInvoices.length > 0 ? (
                    <div className="space-y-3">
                      {studentInvoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="text-sm font-medium">{inv.invoice_number}</p>
                            <p className="text-xs text-muted-foreground">Total: ${inv.total_amount} | Paid: ${inv.paid_amount}</p>
                          </div>
                          <Badge className={
                            inv.status === "paid" ? "bg-emerald-100 text-emerald-800" :
                            inv.status === "partial" ? "bg-amber-100 text-amber-800" :
                            "bg-red-100 text-red-800"
                          }>{inv.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No fee records found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academics" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Academic Records</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Academic records will appear here once marks are entered</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discipline" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Discipline Records</CardTitle></CardHeader>
                <CardContent>
                  {studentDiscipline.length > 0 ? (
                    <div className="space-y-3">
                      {studentDiscipline.map((d) => (
                        <div key={d.id} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{d.incident_type}</span>
                            <Badge className={
                              d.severity === "minor" ? "bg-amber-100 text-amber-800" :
                              d.severity === "major" ? "bg-red-100 text-red-800" :
                              "bg-orange-100 text-orange-800"
                            }>{d.severity}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{d.date} — {d.description}</p>
                          {d.action_taken && <p className="text-xs mt-1"><strong>Action:</strong> {d.action_taken}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4">No discipline records</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color, bg }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`p-3 rounded-xl ${bg}`}>
      <Icon className={`w-5 h-5 ${color} mb-1`} />
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
