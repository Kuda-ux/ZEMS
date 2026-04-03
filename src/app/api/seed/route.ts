import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const errors: string[] = [];

  try {
    // 1. Seed Users
    const users = [
      { id: "u1", email: "admin@zems.gov.zw", first_name: "Tendai", last_name: "Moyo", phone: "+263 77 123 4567", school_id: "sch1", role: "school_admin", is_active: true },
      { id: "u2", email: "ministry@zems.gov.zw", first_name: "Chipo", last_name: "Nyamande", phone: null, school_id: null, role: "ministry_admin", is_active: true },
      { id: "u3", email: "bursar@school.co.zw", first_name: "Farai", last_name: "Chirwa", phone: "+263 71 234 5678", school_id: "sch1", role: "bursar", is_active: true },
      { id: "u4", email: "teacher@school.co.zw", first_name: "Blessing", last_name: "Ncube", phone: "+263 73 345 6789", school_id: "sch1", role: "teacher", is_active: true },
      { id: "u5", email: "parent@gmail.com", first_name: "Rumbidzai", last_name: "Mutasa", phone: "+263 77 456 7890", school_id: "sch1", role: "parent", is_active: true },
    ];
    const { error: uErr } = await supabase.from("users").upsert(users, { onConflict: "id" });
    if (uErr) errors.push(`users: ${uErr.message}`);

    // 2. Seed Streams
    const grades = [
      { id: "g8", name: "Form 1" }, { id: "g9", name: "Form 2" },
      { id: "g10", name: "Form 3" }, { id: "g11", name: "Form 4" },
    ];
    const streamNames = ["A", "B", "C"];
    const streams: { id: string; school_id: string; grade_id: string; academic_year_id: string; name: string; capacity: number; grade_name: string; student_count: number }[] = [];
    let sIdx = 1;
    for (const g of grades) {
      for (const s of streamNames) {
        streams.push({ id: `str${sIdx}`, school_id: "sch1", grade_id: g.id, academic_year_id: "ay1", name: `${g.name} ${s}`, capacity: 45, grade_name: g.name, student_count: 8 + Math.floor(Math.random() * 5) });
        sIdx++;
      }
    }
    const { error: sErr } = await supabase.from("streams").upsert(streams, { onConflict: "id" });
    if (sErr) errors.push(`streams: ${sErr.message}`);

    // 3. Seed Students
    const firstNames = ["Tatenda","Tinashe","Nyasha","Kudzai","Takudzwa","Rutendo","Fadzai","Makanaka","Ruvimbo","Tapiwanashe","Simbarashe","Nokutenda","Tafadzwa","Munyaradzi","Chiedza","Tinotenda","Panashe","Anesu","Yeukai","Tadiwanashe","Shamiso","Tanaka","Munashe","Ropafadzo","Kudakwashe","Rumbidzai","Blessing","Praise","Faith","Gift","Hope","Grace","Mercy","Fortune","Talent","Pride","Innocent","Privilege","Prosper","Devine"];
    const lastNames = ["Moyo","Ncube","Dube","Ndlovu","Sibanda","Mpofu","Nkomo","Chirwa","Mutasa","Chigumba","Maposa","Nyoni","Banda","Phiri","Chikwanha","Marufu","Gonese","Zimuto","Gumbo","Mhaka","Chivasa","Nhamo","Zvobgo","Muchapondwa","Magadzire"];
    const streets = ["Samora Machel Ave","Herbert Chitepo St","Julius Nyerere Way","Josiah Tongogara Ave","Jason Moyo Ave"];
    const students: Record<string, unknown>[] = [];

    for (let i = 0; i < 120; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const g = grades[i % grades.length];
      const s = streamNames[i % streamNames.length];
      const yr = 2008 + Math.floor(Math.random() * 6);
      const mo = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const dy = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");

      students.push({
        id: `stu${i + 1}`,
        zems_id: `ZEMS-2026-${String(i + 1).padStart(6, "0")}`,
        school_id: "sch1",
        first_name: fn, last_name: ln,
        date_of_birth: `${yr}-${mo}-${dy}`,
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
        guardian_phone: `+263 7${Math.floor(Math.random() * 4) + 1} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} ${streets[i % 5]}, Harare`,
      });
    }
    // Insert in batches of 50
    for (let b = 0; b < students.length; b += 50) {
      const { error } = await supabase.from("students").upsert(students.slice(b, b + 50), { onConflict: "id" });
      if (error) errors.push(`students batch ${b}: ${error.message}`);
    }

    // 4. Seed Attendance
    const attRecords: Record<string, unknown>[] = [];
    const attStatuses = ["present","present","present","present","present","present","present","absent","late","excused"];
    const today = new Date();
    for (let d = 0; d < 5; d++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - d);
      const dateStr = dt.toISOString().split("T")[0];
      for (let si = 0; si < 40; si++) {
        const stu = students[si];
        const st = attStatuses[Math.floor(Math.random() * attStatuses.length)];
        attRecords.push({
          id: `att-${d}-stu${si + 1}`,
          school_id: "sch1",
          student_id: `stu${si + 1}`,
          stream_id: "str1",
          date: dateStr,
          status: st,
          reason: st === "absent" ? "Illness" : st === "excused" ? "Family emergency" : null,
          marked_by: "u4",
          student_name: `${stu.first_name} ${stu.last_name}`,
        });
      }
    }
    for (let b = 0; b < attRecords.length; b += 50) {
      const { error } = await supabase.from("attendance_records").upsert(attRecords.slice(b, b + 50), { onConflict: "id" });
      if (error) errors.push(`attendance batch ${b}: ${error.message}`);
    }

    // 5. Seed Invoices
    const invoices: Record<string, unknown>[] = [];
    for (let i = 0; i < 60; i++) {
      const stu = students[i];
      const total = 450;
      const paid = [0, 150, 250, 350, 450][i % 5];
      const balance = total - paid;
      const status = paid === 0 ? "pending" : paid >= total ? "paid" : "partial";
      invoices.push({
        id: `inv${i + 1}`,
        invoice_number: `INV-2026-${String(i + 1).padStart(5, "0")}`,
        school_id: "sch1",
        student_id: `stu${i + 1}`,
        term_id: "t1",
        total_amount: total,
        paid_amount: paid,
        balance, status,
        due_date: "2026-02-28",
        student_name: `${stu.first_name} ${stu.last_name}`,
        grade_name: stu.grade_name as string,
      });
    }
    for (let b = 0; b < invoices.length; b += 50) {
      const { error } = await supabase.from("invoices").upsert(invoices.slice(b, b + 50), { onConflict: "id" });
      if (error) errors.push(`invoices batch ${b}: ${error.message}`);
    }

    // 6. Seed Payments
    const methods = ["cash","ecocash","bank_transfer","innbucks","beam"];
    const payments: Record<string, unknown>[] = [];
    let pIdx = 1;
    for (const inv of invoices) {
      if ((inv.paid_amount as number) > 0) {
        payments.push({
          id: `pay${pIdx}`,
          receipt_number: `RCT-2026-${String(pIdx).padStart(5, "0")}`,
          school_id: "sch1",
          invoice_id: inv.id,
          student_id: inv.student_id,
          amount: inv.paid_amount,
          payment_method: methods[pIdx % methods.length],
          reference_number: pIdx % 2 === 0 ? `REF${Math.floor(Math.random() * 99999)}` : null,
          payment_date: "2026-02-01",
          received_by: "u3",
          status: "confirmed",
          student_name: inv.student_name,
        });
        pIdx++;
      }
    }
    const { error: payErr } = await supabase.from("payments").upsert(payments, { onConflict: "id" });
    if (payErr) errors.push(`payments: ${payErr.message}`);

    // 7. Seed Announcements
    const announcements = [
      { id: "ann1", school_id: "sch1", title: "Term 1 Fees Due Date", content: "All term 1 fees must be paid by 28 February 2026.", target_audience: "parents", priority: "high", published_by: "u1", published_at: "2026-01-20T08:00:00Z" },
      { id: "ann2", school_id: "sch1", title: "Sports Day - 15 March 2026", content: "Annual sports day will be held on 15 March. All students must participate.", target_audience: "all", priority: "normal", published_by: "u1", published_at: "2026-02-01T08:00:00Z" },
      { id: "ann3", school_id: "sch1", title: "ZIMSEC Registration Deadline", content: "Form 4 students: ZIMSEC registration closes on 10 March 2026.", target_audience: "students", priority: "urgent", published_by: "u1", published_at: "2026-02-15T08:00:00Z" },
      { id: "ann4", school_id: "sch1", title: "Staff Meeting - Friday", content: "All teaching staff are required to attend the staff meeting this Friday at 2:00 PM.", target_audience: "teachers", priority: "normal", published_by: "u1", published_at: "2026-02-20T08:00:00Z" },
    ];
    const { error: annErr } = await supabase.from("announcements").upsert(announcements, { onConflict: "id" });
    if (annErr) errors.push(`announcements: ${annErr.message}`);

    // 8. Seed Discipline Records
    const discipline = [
      { id: "disc1", school_id: "sch1", student_id: "stu5", date: "2026-02-10", incident_type: "Late Coming", severity: "minor", description: "Arrived 30 minutes late without valid reason", action_taken: "Verbal warning", reported_by: "u4", parent_notified: false, status: "resolved", student_name: "Takudzwa Sibanda" },
      { id: "disc2", school_id: "sch1", student_id: "stu12", date: "2026-02-15", incident_type: "Fighting", severity: "major", description: "Physical altercation with another student during break", action_taken: "3-day suspension", reported_by: "u4", parent_notified: true, status: "resolved", student_name: "Nokutenda Nyoni" },
      { id: "disc3", school_id: "sch1", student_id: "stu8", date: "2026-02-20", incident_type: "Uniform Violation", severity: "minor", description: "Not wearing proper school uniform", action_taken: "Warning letter", reported_by: "u4", parent_notified: true, status: "open", student_name: "Makanaka Chirwa" },
    ];
    const { error: discErr } = await supabase.from("discipline_records").upsert(discipline, { onConflict: "id" });
    if (discErr) errors.push(`discipline: ${discErr.message}`);

    // 9. Seed Audit Logs
    const auditLogs = [
      { id: "al1", user_id: "u1", school_id: "sch1", action: "create", entity_type: "student", entity_id: "stu1", user_name: "Tendai Moyo" },
      { id: "al2", user_id: "u3", school_id: "sch1", action: "create", entity_type: "payment", entity_id: "pay1", user_name: "Farai Chirwa" },
      { id: "al3", user_id: "u4", school_id: "sch1", action: "create", entity_type: "attendance", entity_id: "att-0-stu1", user_name: "Blessing Ncube" },
      { id: "al4", user_id: "u1", school_id: "sch1", action: "update", entity_type: "student", entity_id: "stu5", user_name: "Tendai Moyo" },
      { id: "al5", user_id: "u1", school_id: "sch1", action: "login", entity_type: "session", user_name: "Tendai Moyo" },
    ];
    const { error: alErr } = await supabase.from("audit_logs").upsert(auditLogs, { onConflict: "id" });
    if (alErr) errors.push(`audit_logs: ${alErr.message}`);

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      counts: { users: users.length, students: students.length, streams: streams.length, attendance: attRecords.length, invoices: invoices.length, payments: payments.length, announcements: announcements.length, discipline: discipline.length, auditLogs: auditLogs.length },
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
