export type UserRole = 
  | "super_admin"
  | "ministry_admin"
  | "provincial_admin"
  | "district_admin"
  | "school_admin"
  | "bursar"
  | "teacher"
  | "parent";

export type SchoolType = "government" | "private" | "mission" | "community";
export type SchoolLevel = "primary" | "secondary" | "combined";
export type StudentStatus = "active" | "inactive" | "transferred" | "graduated" | "expelled" | "deceased";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type PaymentMethod = "cash" | "bank_transfer" | "ecocash" | "innbucks" | "onemoney" | "check" | "beam" | "sponsorship";
export type InvoiceStatus = "pending" | "partial" | "paid" | "overdue" | "waived";
export type Gender = "male" | "female";

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  province_id: string;
  name: string;
  code: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  type: SchoolType;
  level: SchoolLevel;
  district_id: string;
  address?: string;
  phone?: string;
  email?: string;
  head_teacher_name?: string;
  is_boarding: boolean;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  school_id?: string;
  role: UserRole;
  is_active: boolean;
}

export interface Student {
  id: string;
  zems_id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth: string;
  gender: Gender;
  national_id?: string;
  nationality: string;
  home_language?: string;
  medical_conditions?: string;
  has_special_needs: boolean;
  photo_url?: string;
  address?: string;
  province_of_origin?: string;
  enrollment_date: string;
  enrollment_type: "new" | "transfer" | "re_enroll";
  previous_school?: string;
  status: StudentStatus;
  is_orphan: boolean;
  is_beam_beneficiary: boolean;
  sponsorship_details?: string;
  grade_name?: string;
  stream_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  phone: string;
  alt_phone?: string;
  email?: string;
  national_id?: string;
  occupation?: string;
  address?: string;
}

export interface AcademicYear {
  id: string;
  year: number;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Term {
  id: string;
  academic_year_id: string;
  name: string;
  term_number: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface Grade {
  id: string;
  name: string;
  level_order: number;
  school_level: "primary" | "secondary";
}

export interface Stream {
  id: string;
  school_id: string;
  grade_id: string;
  academic_year_id: string;
  name: string;
  capacity: number;
  class_teacher_id?: string;
  grade_name?: string;
  student_count?: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  school_level: "primary" | "secondary" | "both";
  is_compulsory: boolean;
}

export interface AttendanceRecord {
  id: string;
  school_id: string;
  student_id: string;
  stream_id: string;
  date: string;
  status: AttendanceStatus;
  reason?: string;
  marked_by: string;
  student_name?: string;
}

export interface FeeStructure {
  id: string;
  school_id: string;
  academic_year_id: string;
  term_id: string;
  grade_id: string;
  name: string;
  amount: number;
  is_compulsory: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  school_id: string;
  student_id: string;
  term_id: string;
  total_amount: number;
  paid_amount: number;
  balance: number;
  status: InvoiceStatus;
  due_date?: string;
  student_name?: string;
  grade_name?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  receipt_number: string;
  school_id: string;
  invoice_id: string;
  student_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string;
  payment_date: string;
  received_by: string;
  notes?: string;
  status: "confirmed" | "pending" | "reversed";
  student_name?: string;
}

export interface Exam {
  id: string;
  school_id: string;
  academic_year_id: string;
  term_id: string;
  name: string;
  exam_type: "test" | "midterm" | "endterm" | "mock" | "assignment";
  max_mark: number;
  weight: number;
  start_date?: string;
  end_date?: string;
  status: "draft" | "active" | "completed" | "published";
}

export interface ExamMark {
  id: string;
  exam_id: string;
  student_id: string;
  subject_id: string;
  stream_id: string;
  mark: number;
  grade?: string;
  teacher_id: string;
  comments?: string;
  student_name?: string;
  subject_name?: string;
}

export interface DisciplineRecord {
  id: string;
  school_id: string;
  student_id: string;
  date: string;
  incident_type: string;
  severity: "minor" | "moderate" | "major" | "critical";
  description: string;
  action_taken?: string;
  reported_by: string;
  parent_notified: boolean;
  status: "open" | "resolved" | "escalated";
  student_name?: string;
}

export interface Announcement {
  id: string;
  school_id: string;
  title: string;
  content: string;
  target_audience: "all" | "parents" | "teachers" | "students" | "staff";
  priority: "normal" | "high" | "urgent";
  published_by: string;
  published_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  school_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  created_at: string;
  user_name?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  attendanceRate: number;
  feesCollected: number;
  feesOutstanding: number;
  totalSchools?: number;
  enrollmentTrend: { month: string; count: number }[];
  attendanceTrend: { date: string; rate: number }[];
  feeCollection: { month: string; collected: number; outstanding: number }[];
  genderDistribution: { gender: string; count: number }[];
  gradeDistribution: { grade: string; count: number }[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: UserRole[];
  children?: NavItem[];
}
