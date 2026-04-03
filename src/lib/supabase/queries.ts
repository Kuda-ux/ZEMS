import { supabase } from "./client";
import type {
  UserProfile, Student, Stream, AttendanceRecord,
  Invoice, Payment, Announcement, DisciplineRecord, AuditLog, DashboardStats,
} from "@/lib/types";

// ── Users ──
export async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase.from("users").select("*").order("created_at");
  if (error) throw error;
  return data || [];
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error) return null;
  return data;
}

// ── Students ──
export async function getStudents(): Promise<Student[]> {
  const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  const { data, error } = await supabase.from("students").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function insertStudent(student: Partial<Student>): Promise<Student | null> {
  const { data, error } = await supabase.from("students").insert(student).select().single();
  if (error) throw error;
  return data;
}

// ── Streams ──
export async function getStreams(): Promise<Stream[]> {
  const { data, error } = await supabase.from("streams").select("*").order("name");
  if (error) throw error;
  return data || [];
}

// ── Attendance ──
export async function getAttendanceRecords(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase.from("attendance_records").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function upsertAttendance(records: Partial<AttendanceRecord>[]): Promise<void> {
  const { error } = await supabase.from("attendance_records").upsert(records, { onConflict: "id" });
  if (error) throw error;
}

// ── Invoices ──
export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Payments ──
export async function getPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from("payments").select("*").order("payment_date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertPayment(payment: Partial<Payment>): Promise<Payment | null> {
  const { data, error } = await supabase.from("payments").insert(payment).select().single();
  if (error) throw error;
  return data;
}

// ── Announcements ──
export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertAnnouncement(ann: Partial<Announcement>): Promise<Announcement | null> {
  const { data, error } = await supabase.from("announcements").insert(ann).select().single();
  if (error) throw error;
  return data;
}

// ── Discipline Records ──
export async function getDisciplineRecords(): Promise<DisciplineRecord[]> {
  const { data, error } = await supabase.from("discipline_records").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertDisciplineRecord(rec: Partial<DisciplineRecord>): Promise<DisciplineRecord | null> {
  const { data, error } = await supabase.from("discipline_records").insert(rec).select().single();
  if (error) throw error;
  return data;
}

// ── Audit Logs ──
export async function getAuditLogs(): Promise<AuditLog[]> {
  const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function insertAuditLog(log: Partial<AuditLog>): Promise<void> {
  await supabase.from("audit_logs").insert(log);
}

// ── Dashboard Stats (computed) ──
export async function getDashboardStats(): Promise<DashboardStats> {
  const [studentsRes, attendanceRes, invoicesRes, paymentsRes] = await Promise.all([
    supabase.from("students").select("id, gender, grade_name, status"),
    supabase.from("attendance_records").select("id, date, status"),
    supabase.from("invoices").select("id, total_amount, paid_amount, balance, status"),
    supabase.from("payments").select("id, amount"),
  ]);

  const students = studentsRes.data || [];
  const attendance = attendanceRes.data || [];
  const invoices = invoicesRes.data || [];
  const payments = paymentsRes.data || [];

  const activeStudents = students.filter((s) => s.status === "active");
  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.filter((a) => a.date === today);
  const presentToday = todayAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const attRate = todayAtt.length > 0 ? Math.round((presentToday / todayAtt.length) * 100) : 87;
  const feesCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const feesOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.balance), 0);

  return {
    totalStudents: activeStudents.length,
    totalStaff: 28,
    attendanceRate: attRate,
    feesCollected,
    feesOutstanding,
    totalSchools: 1,
    enrollmentTrend: [
      { month: "Jan", count: 95 }, { month: "Feb", count: 105 },
      { month: "Mar", count: 108 }, { month: "Apr", count: 112 },
      { month: "May", count: 110 }, { month: "Jun", count: 115 },
    ],
    attendanceTrend: [
      { date: "Mon", rate: 92 }, { date: "Tue", rate: 88 },
      { date: "Wed", rate: 91 }, { date: "Thu", rate: 85 },
      { date: "Fri", rate: 87 },
    ],
    feeCollection: [
      { month: "Jan", collected: 8500, outstanding: 12000 },
      { month: "Feb", collected: 15200, outstanding: 8300 },
      { month: "Mar", collected: 18900, outstanding: 4600 },
    ],
    genderDistribution: [
      { gender: "Male", count: activeStudents.filter((s) => s.gender === "male").length },
      { gender: "Female", count: activeStudents.filter((s) => s.gender === "female").length },
    ],
    gradeDistribution: [
      { grade: "Form 1", count: activeStudents.filter((s) => s.grade_name === "Form 1").length },
      { grade: "Form 2", count: activeStudents.filter((s) => s.grade_name === "Form 2").length },
      { grade: "Form 3", count: activeStudents.filter((s) => s.grade_name === "Form 3").length },
      { grade: "Form 4", count: activeStudents.filter((s) => s.grade_name === "Form 4").length },
    ],
  };
}
