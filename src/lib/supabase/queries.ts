import { supabase } from "./client";
import type {
  UserProfile, Student, Stream, AttendanceRecord,
  Invoice, Payment, Announcement, DisciplineRecord, AuditLog, DashboardStats,
  StaffMember, Asset, ExamEntry, ExamMarkEntry, WelfareRecord, TimetableSlot, SchoolEvent,
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

// ── Staff ──
export async function getStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase.from("staff").select("*").order("name");
  if (error) throw error;
  return data || [];
}

// ── Assets ──
export async function getAssets(): Promise<Asset[]> {
  const { data, error } = await supabase.from("assets").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Exams ──
export async function getExams(): Promise<ExamEntry[]> {
  const { data, error } = await supabase.from("exams").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Exam Marks ──
export async function getExamMarks(examId?: string): Promise<ExamMarkEntry[]> {
  let query = supabase.from("exam_marks").select("*");
  if (examId) query = query.eq("exam_id", examId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Welfare Records ──
export async function getWelfareRecords(): Promise<WelfareRecord[]> {
  const { data, error } = await supabase.from("welfare_records").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ── Timetable Slots ──
export async function getTimetableSlots(streamName?: string): Promise<TimetableSlot[]> {
  let query = supabase.from("timetable_slots").select("*");
  if (streamName) query = query.eq("stream_name", streamName);
  const { data, error } = await query.order("time_slot");
  if (error) throw error;
  return data || [];
}

// ── Events ──
export async function getEvents(): Promise<SchoolEvent[]> {
  const { data, error } = await supabase.from("events").select("*").order("event_date");
  if (error) throw error;
  return data || [];
}

// ── Dashboard Stats (computed from live data) ──
export async function getDashboardStats(): Promise<DashboardStats> {
  const [studentsRes, staffRes, attendanceRes, invoicesRes, paymentsRes] = await Promise.all([
    supabase.from("students").select("id, gender, grade_name, status"),
    supabase.from("staff").select("id, status"),
    supabase.from("attendance_records").select("id, date, status"),
    supabase.from("invoices").select("id, total_amount, paid_amount, balance, status"),
    supabase.from("payments").select("id, amount, payment_date"),
  ]);

  const students = studentsRes.data || [];
  const staffMembers = staffRes.data || [];
  const attendance = attendanceRes.data || [];
  const invoices = invoicesRes.data || [];
  const payments = paymentsRes.data || [];

  const activeStudents = students.filter((s) => s.status === "active");
  const activeStaff = staffMembers.filter((s) => s.status === "active").length;
  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.filter((a) => a.date === today);
  const presentToday = todayAtt.filter((a) => a.status === "present" || a.status === "late").length;
  const attRate = todayAtt.length > 0 ? Math.round((presentToday / todayAtt.length) * 100) : 0;
  const feesCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const feesOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.balance), 0);

  // Compute fee collection by month from real payment data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const collectionByMonth: Record<string, number> = {};
  const outstandingByMonth: Record<string, number> = {};
  for (const p of payments) {
    if (p.payment_date) {
      const m = new Date(p.payment_date).getMonth();
      const key = monthNames[m];
      collectionByMonth[key] = (collectionByMonth[key] || 0) + Number(p.amount);
    }
  }
  for (const inv of invoices) {
    const m = inv.status !== "paid" ? new Date().getMonth() : 0;
    const key = monthNames[m];
    outstandingByMonth[key] = (outstandingByMonth[key] || 0) + Number(inv.balance);
  }
  const feeCollection = Object.keys(collectionByMonth).map(month => ({
    month,
    collected: collectionByMonth[month] || 0,
    outstanding: outstandingByMonth[month] || 0,
  }));
  if (feeCollection.length === 0) {
    feeCollection.push({ month: "Jan", collected: 0, outstanding: 0 });
  }

  // Compute attendance trend by weekday from real data
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayRates: Record<string, { present: number; total: number }> = {};
  for (const a of attendance) {
    const d = dayNames[new Date(a.date).getDay()];
    if (!dayRates[d]) dayRates[d] = { present: 0, total: 0 };
    dayRates[d].total++;
    if (a.status === "present" || a.status === "late") dayRates[d].present++;
  }
  const attendanceTrend = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    .filter(d => dayRates[d])
    .map(d => ({ date: d, rate: dayRates[d].total > 0 ? Math.round((dayRates[d].present / dayRates[d].total) * 100) : 0 }));
  if (attendanceTrend.length === 0) {
    attendanceTrend.push({ date: "Mon", rate: 0 });
  }

  return {
    totalStudents: activeStudents.length,
    totalStaff: activeStaff,
    attendanceRate: attRate,
    feesCollected,
    feesOutstanding,
    totalSchools: 1,
    enrollmentTrend: [
      { month: "Jan", count: activeStudents.length },
      { month: "Feb", count: activeStudents.length },
    ],
    attendanceTrend,
    feeCollection,
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
