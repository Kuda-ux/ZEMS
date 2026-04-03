import type { NavItem, Province, District, Grade, Subject } from "./types";

export const APP_NAME = "ZEMS";
export const APP_FULL_NAME = "Zimbabwe Education Management System";
export const APP_DESCRIPTION = "National School Management Platform";

export const PROVINCES: Province[] = [
  { id: "p1", name: "Bulawayo", code: "BUL" },
  { id: "p2", name: "Harare", code: "HAR" },
  { id: "p3", name: "Manicaland", code: "MAN" },
  { id: "p4", name: "Mashonaland Central", code: "MSC" },
  { id: "p5", name: "Mashonaland East", code: "MSE" },
  { id: "p6", name: "Mashonaland West", code: "MSW" },
  { id: "p7", name: "Masvingo", code: "MSV" },
  { id: "p8", name: "Matabeleland North", code: "MTN" },
  { id: "p9", name: "Matabeleland South", code: "MTS" },
  { id: "p10", name: "Midlands", code: "MID" },
];

export const DISTRICTS: District[] = [
  { id: "d1", province_id: "p2", name: "Harare Central", code: "HARC" },
  { id: "d2", province_id: "p2", name: "Harare South", code: "HARS" },
  { id: "d3", province_id: "p2", name: "Chitungwiza", code: "CHIT" },
  { id: "d4", province_id: "p1", name: "Bulawayo Central", code: "BULC" },
  { id: "d5", province_id: "p3", name: "Mutare", code: "MUTA" },
  { id: "d6", province_id: "p7", name: "Masvingo Urban", code: "MSVU" },
  { id: "d7", province_id: "p10", name: "Gweru", code: "GWER" },
  { id: "d8", province_id: "p6", name: "Chinhoyi", code: "CHIN" },
  { id: "d9", province_id: "p4", name: "Bindura", code: "BIND" },
  { id: "d10", province_id: "p5", name: "Marondera", code: "MARO" },
];

export const GRADES: Grade[] = [
  { id: "g1", name: "Grade 1", level_order: 1, school_level: "primary" },
  { id: "g2", name: "Grade 2", level_order: 2, school_level: "primary" },
  { id: "g3", name: "Grade 3", level_order: 3, school_level: "primary" },
  { id: "g4", name: "Grade 4", level_order: 4, school_level: "primary" },
  { id: "g5", name: "Grade 5", level_order: 5, school_level: "primary" },
  { id: "g6", name: "Grade 6", level_order: 6, school_level: "primary" },
  { id: "g7", name: "Grade 7", level_order: 7, school_level: "primary" },
  { id: "g8", name: "Form 1", level_order: 8, school_level: "secondary" },
  { id: "g9", name: "Form 2", level_order: 9, school_level: "secondary" },
  { id: "g10", name: "Form 3", level_order: 10, school_level: "secondary" },
  { id: "g11", name: "Form 4", level_order: 11, school_level: "secondary" },
  { id: "g12", name: "Form 5 (Lower 6)", level_order: 12, school_level: "secondary" },
  { id: "g13", name: "Form 6 (Upper 6)", level_order: 13, school_level: "secondary" },
];

export const SUBJECTS: Subject[] = [
  { id: "s1", name: "English", code: "ENG", school_level: "both", is_compulsory: true },
  { id: "s2", name: "Mathematics", code: "MATH", school_level: "both", is_compulsory: true },
  { id: "s3", name: "Shona", code: "SHO", school_level: "both", is_compulsory: false },
  { id: "s4", name: "Ndebele", code: "NDE", school_level: "both", is_compulsory: false },
  { id: "s5", name: "Science", code: "SCI", school_level: "primary", is_compulsory: true },
  { id: "s6", name: "Social Studies", code: "SOC", school_level: "primary", is_compulsory: true },
  { id: "s7", name: "Physical Education", code: "PE", school_level: "both", is_compulsory: false },
  { id: "s8", name: "Agriculture", code: "AGR", school_level: "both", is_compulsory: false },
  { id: "s9", name: "Biology", code: "BIO", school_level: "secondary", is_compulsory: false },
  { id: "s10", name: "Chemistry", code: "CHE", school_level: "secondary", is_compulsory: false },
  { id: "s11", name: "Physics", code: "PHY", school_level: "secondary", is_compulsory: false },
  { id: "s12", name: "Geography", code: "GEO", school_level: "secondary", is_compulsory: false },
  { id: "s13", name: "History", code: "HIS", school_level: "secondary", is_compulsory: false },
  { id: "s14", name: "Commerce", code: "COM", school_level: "secondary", is_compulsory: false },
  { id: "s15", name: "Accounts", code: "ACC", school_level: "secondary", is_compulsory: false },
  { id: "s16", name: "Computer Science", code: "CS", school_level: "secondary", is_compulsory: false },
];

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["super_admin", "ministry_admin", "provincial_admin", "district_admin", "school_admin", "bursar", "teacher", "parent"],
  },
  {
    title: "Students",
    href: "/dashboard/students",
    icon: "GraduationCap",
    roles: ["super_admin", "ministry_admin", "provincial_admin", "district_admin", "school_admin", "teacher", "parent"],
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: "ClipboardCheck",
    roles: ["super_admin", "school_admin", "teacher", "parent"],
  },
  {
    title: "Fees & Finance",
    href: "/dashboard/fees",
    icon: "Wallet",
    roles: ["super_admin", "ministry_admin", "school_admin", "bursar", "parent"],
  },
  {
    title: "Academics",
    href: "/dashboard/academics",
    icon: "BookOpen",
    roles: ["super_admin", "school_admin", "teacher"],
  },
  {
    title: "Exams & Results",
    href: "/dashboard/exams",
    icon: "FileText",
    roles: ["super_admin", "school_admin", "teacher", "parent"],
  },
  {
    title: "Staff",
    href: "/dashboard/staff",
    icon: "Users",
    roles: ["super_admin", "ministry_admin", "school_admin"],
  },
  {
    title: "Discipline",
    href: "/dashboard/discipline",
    icon: "ShieldAlert",
    roles: ["super_admin", "school_admin", "teacher"],
  },
  {
    title: "Communications",
    href: "/dashboard/communications",
    icon: "MessageSquare",
    roles: ["super_admin", "school_admin", "teacher", "parent"],
  },
  {
    title: "Timetable",
    href: "/dashboard/timetable",
    icon: "Calendar",
    roles: ["super_admin", "school_admin", "teacher", "parent"],
  },
  {
    title: "Welfare",
    href: "/dashboard/welfare",
    icon: "Heart",
    roles: ["super_admin", "ministry_admin", "school_admin", "teacher"],
  },
  {
    title: "Inventory",
    href: "/dashboard/inventory",
    icon: "Package",
    roles: ["super_admin", "school_admin", "bursar"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "BarChart3",
    roles: ["super_admin", "ministry_admin", "provincial_admin", "district_admin", "school_admin", "bursar"],
  },
  {
    title: "Audit Logs",
    href: "/dashboard/audit-logs",
    icon: "ScrollText",
    roles: ["super_admin", "ministry_admin", "school_admin"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    roles: ["super_admin", "ministry_admin", "school_admin"],
  },
];

export const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "ecocash", label: "EcoCash" },
  { value: "innbucks", label: "InnBucks" },
  { value: "onemoney", label: "OneMoney" },
  { value: "check", label: "Cheque" },
  { value: "beam", label: "BEAM (Government)" },
  { value: "sponsorship", label: "Sponsorship" },
];

export const INCIDENT_TYPES = [
  "Late Coming",
  "Truancy",
  "Fighting",
  "Bullying",
  "Vandalism",
  "Theft",
  "Drug/Substance Abuse",
  "Uniform Violation",
  "Disrespect to Staff",
  "Academic Dishonesty",
  "Cell Phone Violation",
  "Other",
];
