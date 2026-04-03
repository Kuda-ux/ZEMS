import type { Student, UserProfile, Payment, Invoice, AttendanceRecord, DashboardStats, Announcement, DisciplineRecord, AuditLog, Stream } from "./types";

const currentUser: UserProfile = {
  id: "u1",
  email: "admin@zems.gov.zw",
  first_name: "Tendai",
  last_name: "Moyo",
  phone: "+263 77 123 4567",
  school_id: "sch1",
  role: "school_admin",
  is_active: true,
};

const demoUsers: UserProfile[] = [
  currentUser,
  { id: "u2", email: "ministry@zems.gov.zw", first_name: "Chipo", last_name: "Nyamande", role: "ministry_admin", is_active: true },
  { id: "u3", email: "bursar@school.co.zw", first_name: "Farai", last_name: "Chirwa", phone: "+263 71 234 5678", school_id: "sch1", role: "bursar", is_active: true },
  { id: "u4", email: "teacher@school.co.zw", first_name: "Blessing", last_name: "Ncube", phone: "+263 73 345 6789", school_id: "sch1", role: "teacher", is_active: true },
  { id: "u5", email: "parent@gmail.com", first_name: "Rumbidzai", last_name: "Mutasa", phone: "+263 77 456 7890", school_id: "sch1", role: "parent", is_active: true },
];

function generateStudents(): Student[] {
  const firstNames = ["Tatenda", "Tinashe", "Nyasha", "Kudzai", "Takudzwa", "Rutendo", "Fadzai", "Makanaka", "Ruvimbo", "Tapiwanashe", "Simbarashe", "Nokutenda", "Tafadzwa", "Munyaradzi", "Chiedza", "Tinotenda", "Panashe", "Anesu", "Yeukai", "Tadiwanashe", "Shamiso", "Tanaka", "Munashe", "Ropafadzo", "Kudakwashe", "Rumbidzai", "Blessing", "Praise", "Faith", "Gift", "Hope", "Grace", "Mercy", "Fortune", "Talent", "Pride", "Innocent", "Privilege", "Prosper", "Devine"];
  const lastNames = ["Moyo", "Ncube", "Dube", "Ndlovu", "Sibanda", "Mpofu", "Nkomo", "Chirwa", "Mutasa", "Chigumba", "Maposa", "Nyoni", "Banda", "Phiri", "Chikwanha", "Marufu", "Gonese", "Zimuto", "Gumbo", "Mhaka", "Chivasa", "Nhamo", "Zvobgo", "Muchapondwa", "Magadzire"];
  const grades = [
    { id: "g8", name: "Form 1" }, { id: "g9", name: "Form 2" },
    { id: "g10", name: "Form 3" }, { id: "g11", name: "Form 4" },
  ];
  const streams = ["A", "B", "C"];

  const students: Student[] = [];
  for (let i = 0; i < 120; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const g = grades[i % grades.length];
    const s = streams[i % streams.length];
    const year = 2008 + Math.floor(Math.random() * 6);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

    students.push({
      id: `stu${i + 1}`,
      zems_id: `ZEMS-2026-${String(i + 1).padStart(6, "0")}`,
      school_id: "sch1",
      first_name: fn,
      last_name: ln,
      date_of_birth: `${year}-${month}-${day}`,
      gender: i % 3 === 0 ? "female" : "male",
      nationality: "Zimbabwean",
      home_language: i % 4 === 0 ? "Ndebele" : "Shona",
      has_special_needs: i % 20 === 0,
      enrollment_date: "2026-01-15",
      enrollment_type: "new",
      status: i >= 115 ? "transferred" : "active",
      is_orphan: i % 15 === 0,
      is_beam_beneficiary: i % 8 === 0,
      grade_name: g.name,
      stream_name: `${g.name} ${s}`,
      guardian_name: `${lastNames[(i + 5) % lastNames.length]} Family`,
      guardian_phone: `+263 7${Math.floor(Math.random() * 4) + 1} ${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
      address: `${Math.floor(Math.random() * 999) + 1} ${["Samora Machel Ave", "Herbert Chitepo St", "Julius Nyerere Way", "Josiah Tongogara Ave", "Jason Moyo Ave"][i % 5]}, Harare`,
      created_at: "2026-01-15T08:00:00Z",
      updated_at: "2026-01-15T08:00:00Z",
    });
  }
  return students;
}

function generateStreams(): Stream[] {
  const grades = [
    { id: "g8", name: "Form 1" }, { id: "g9", name: "Form 2" },
    { id: "g10", name: "Form 3" }, { id: "g11", name: "Form 4" },
  ];
  const streamNames = ["A", "B", "C"];
  const streams: Stream[] = [];
  let idx = 1;
  for (const g of grades) {
    for (const s of streamNames) {
      streams.push({
        id: `str${idx}`,
        school_id: "sch1",
        grade_id: g.id,
        academic_year_id: "ay1",
        name: `${g.name} ${s}`,
        capacity: 45,
        grade_name: g.name,
        student_count: 8 + Math.floor(Math.random() * 5),
      });
      idx++;
    }
  }
  return streams;
}

function generateAttendance(students: Student[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  const statuses: ("present" | "absent" | "late" | "excused")[] = ["present", "present", "present", "present", "present", "present", "present", "absent", "late", "excused"];

  for (let d = 0; d < 5; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    for (const stu of students.filter(s => s.status === "active").slice(0, 40)) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      records.push({
        id: `att-${d}-${stu.id}`,
        school_id: "sch1",
        student_id: stu.id,
        stream_id: "str1",
        date: dateStr,
        status,
        reason: status === "absent" ? "Illness" : status === "excused" ? "Family emergency" : undefined,
        marked_by: "u4",
        student_name: `${stu.first_name} ${stu.last_name}`,
      });
    }
  }
  return records;
}

function generateInvoices(students: Student[]): Invoice[] {
  return students.filter(s => s.status === "active").slice(0, 60).map((stu, i) => {
    const total = 450;
    const paid = [0, 150, 250, 350, 450][i % 5];
    const balance = total - paid;
    const status: Invoice["status"] = paid === 0 ? "pending" : paid >= total ? "paid" : "partial";
    return {
      id: `inv${i + 1}`,
      invoice_number: `INV-2026-${String(i + 1).padStart(5, "0")}`,
      school_id: "sch1",
      student_id: stu.id,
      term_id: "t1",
      total_amount: total,
      paid_amount: paid,
      balance,
      status,
      due_date: "2026-02-28",
      student_name: `${stu.first_name} ${stu.last_name}`,
      grade_name: stu.grade_name,
      created_at: "2026-01-15T08:00:00Z",
    };
  });
}

function generatePayments(invoices: Invoice[]): Payment[] {
  const methods: Payment["payment_method"][] = ["cash", "ecocash", "bank_transfer", "innbucks", "beam"];
  return invoices.filter(inv => inv.paid_amount > 0).map((inv, i) => ({
    id: `pay${i + 1}`,
    receipt_number: `RCT-2026-${String(i + 1).padStart(5, "0")}`,
    school_id: "sch1",
    invoice_id: inv.id,
    student_id: inv.student_id,
    amount: inv.paid_amount,
    payment_method: methods[i % methods.length],
    reference_number: i % 2 === 0 ? `REF${Math.floor(Math.random() * 99999)}` : undefined,
    payment_date: "2026-02-01",
    received_by: "u3",
    status: "confirmed" as const,
    student_name: inv.student_name,
  }));
}

function generateAnnouncements(): Announcement[] {
  return [
    { id: "ann1", school_id: "sch1", title: "Term 1 Fees Due Date", content: "All term 1 fees must be paid by 28 February 2026. Students with outstanding balances will not receive report cards.", target_audience: "parents", priority: "high", published_by: "u1", published_at: "2026-01-20T08:00:00Z", created_at: "2026-01-20T08:00:00Z" },
    { id: "ann2", school_id: "sch1", title: "Sports Day - 15 March 2026", content: "Annual sports day will be held on 15 March. All students must participate. Parents are welcome to attend.", target_audience: "all", priority: "normal", published_by: "u1", published_at: "2026-02-01T08:00:00Z", created_at: "2026-02-01T08:00:00Z" },
    { id: "ann3", school_id: "sch1", title: "ZIMSEC Registration Deadline", content: "Form 4 and Form 6 students: ZIMSEC registration closes on 10 March 2026. Please submit your forms to the office immediately.", target_audience: "students", priority: "urgent", published_by: "u1", published_at: "2026-02-15T08:00:00Z", created_at: "2026-02-15T08:00:00Z" },
    { id: "ann4", school_id: "sch1", title: "Staff Meeting - Friday", content: "All teaching staff are required to attend the staff meeting this Friday at 2:00 PM in the main hall.", target_audience: "teachers", priority: "normal", published_by: "u1", published_at: "2026-02-20T08:00:00Z", created_at: "2026-02-20T08:00:00Z" },
  ];
}

function generateDisciplineRecords(students: Student[]): DisciplineRecord[] {
  return [
    { id: "disc1", school_id: "sch1", student_id: "stu5", date: "2026-02-10", incident_type: "Late Coming", severity: "minor", description: "Arrived 30 minutes late without valid reason", action_taken: "Verbal warning", reported_by: "u4", parent_notified: false, status: "resolved", student_name: `${students[4]?.first_name} ${students[4]?.last_name}` },
    { id: "disc2", school_id: "sch1", student_id: "stu12", date: "2026-02-15", incident_type: "Fighting", severity: "major", description: "Physical altercation with another student during break", action_taken: "3-day suspension, parents called", reported_by: "u4", parent_notified: true, status: "resolved", student_name: `${students[11]?.first_name} ${students[11]?.last_name}` },
    { id: "disc3", school_id: "sch1", student_id: "stu8", date: "2026-02-20", incident_type: "Uniform Violation", severity: "minor", description: "Not wearing proper school uniform - missing tie", action_taken: "Warning letter to parents", reported_by: "u4", parent_notified: true, status: "open", student_name: `${students[7]?.first_name} ${students[7]?.last_name}` },
  ];
}

function generateAuditLogs(): AuditLog[] {
  return [
    { id: "al1", user_id: "u1", school_id: "sch1", action: "create", entity_type: "student", entity_id: "stu1", created_at: "2026-01-15T08:00:00Z", user_name: "Tendai Moyo" },
    { id: "al2", user_id: "u3", school_id: "sch1", action: "create", entity_type: "payment", entity_id: "pay1", created_at: "2026-02-01T09:30:00Z", user_name: "Farai Chirwa" },
    { id: "al3", user_id: "u4", school_id: "sch1", action: "create", entity_type: "attendance", entity_id: "att-0-stu1", created_at: "2026-02-20T07:45:00Z", user_name: "Blessing Ncube" },
    { id: "al4", user_id: "u1", school_id: "sch1", action: "update", entity_type: "student", entity_id: "stu5", created_at: "2026-02-20T10:00:00Z", user_name: "Tendai Moyo" },
    { id: "al5", user_id: "u1", school_id: "sch1", action: "login", entity_type: "session", created_at: "2026-02-21T06:30:00Z", user_name: "Tendai Moyo" },
  ];
}

const students = generateStudents();
const streams = generateStreams();
const attendance = generateAttendance(students);
const invoices = generateInvoices(students);
const payments = generatePayments(invoices);
const announcements = generateAnnouncements();
const disciplineRecords = generateDisciplineRecords(students);
const auditLogs = generateAuditLogs();

const totalActive = students.filter(s => s.status === "active").length;
const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split("T")[0]);
const presentToday = todayAttendance.filter(a => a.status === "present" || a.status === "late").length;
const attendanceRate = todayAttendance.length > 0 ? Math.round((presentToday / todayAttendance.length) * 100) : 87;
const feesCollected = payments.reduce((sum, p) => sum + p.amount, 0);
const feesOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);

const dashboardStats: DashboardStats = {
  totalStudents: totalActive,
  totalStaff: 28,
  attendanceRate,
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
    { gender: "Male", count: students.filter(s => s.gender === "male" && s.status === "active").length },
    { gender: "Female", count: students.filter(s => s.gender === "female" && s.status === "active").length },
  ],
  gradeDistribution: [
    { grade: "Form 1", count: students.filter(s => s.grade_name === "Form 1" && s.status === "active").length },
    { grade: "Form 2", count: students.filter(s => s.grade_name === "Form 2" && s.status === "active").length },
    { grade: "Form 3", count: students.filter(s => s.grade_name === "Form 3" && s.status === "active").length },
    { grade: "Form 4", count: students.filter(s => s.grade_name === "Form 4" && s.status === "active").length },
  ],
};

export const mockData = {
  currentUser,
  users: demoUsers,
  students,
  streams,
  attendance,
  invoices,
  payments,
  announcements,
  disciplineRecords,
  auditLogs,
  dashboardStats,
};
