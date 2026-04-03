-- ZEMS Database Schema - Run in Supabase SQL Editor
-- Drop existing tables
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS timetable_slots CASCADE;
DROP TABLE IF EXISTS welfare_records CASCADE;
DROP TABLE IF EXISTS exam_marks CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS discipline_records CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS streams CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  school_id TEXT,
  role TEXT NOT NULL DEFAULT 'teacher',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  zems_id TEXT UNIQUE NOT NULL,
  school_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  nationality TEXT DEFAULT 'Zimbabwean',
  home_language TEXT,
  has_special_needs BOOLEAN DEFAULT false,
  enrollment_date TEXT,
  enrollment_type TEXT DEFAULT 'new',
  status TEXT DEFAULT 'active',
  is_orphan BOOLEAN DEFAULT false,
  is_beam_beneficiary BOOLEAN DEFAULT false,
  grade_name TEXT,
  stream_name TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE streams (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  grade_id TEXT,
  academic_year_id TEXT,
  name TEXT NOT NULL,
  capacity INTEGER DEFAULT 45,
  class_teacher_id TEXT,
  grade_name TEXT,
  student_count INTEGER DEFAULT 0
);

CREATE TABLE attendance_records (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  student_id TEXT REFERENCES students(id),
  stream_id TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  reason TEXT,
  marked_by TEXT,
  student_name TEXT
);

CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  school_id TEXT NOT NULL,
  student_id TEXT REFERENCES students(id),
  term_id TEXT,
  total_amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  balance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  due_date TEXT,
  student_name TEXT,
  grade_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  school_id TEXT NOT NULL,
  invoice_id TEXT REFERENCES invoices(id),
  student_id TEXT,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  payment_date TEXT NOT NULL,
  received_by TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  student_name TEXT
);

CREATE TABLE announcements (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  target_audience TEXT DEFAULT 'all',
  priority TEXT DEFAULT 'normal',
  published_by TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE discipline_records (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  student_id TEXT REFERENCES students(id),
  date TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT DEFAULT 'minor',
  description TEXT,
  action_taken TEXT,
  reported_by TEXT,
  parent_notified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open',
  student_name TEXT
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  school_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_name TEXT
);

CREATE TABLE staff (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT NOT NULL,
  department TEXT,
  staff_type TEXT NOT NULL DEFAULT 'teaching',
  qualification TEXT,
  date_joined TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assets (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  asset_number TEXT UNIQUE,
  quantity INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'good',
  location TEXT,
  purchase_date TEXT,
  value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  name TEXT NOT NULL,
  exam_type TEXT NOT NULL,
  term TEXT DEFAULT 'Term 1',
  max_mark INTEGER DEFAULT 100,
  status TEXT DEFAULT 'draft',
  exam_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE exam_marks (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES exams(id),
  student_id TEXT REFERENCES students(id),
  subject TEXT NOT NULL,
  mark NUMERIC NOT NULL,
  student_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE welfare_records (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  student_id TEXT REFERENCES students(id),
  student_name TEXT NOT NULL,
  category TEXT NOT NULL,
  support TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  since TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE timetable_slots (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  stream_name TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT,
  room TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_type TEXT DEFAULT 'info',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS for development (enable + add policies for production)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE streams DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks DISABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Grant access to anon role
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
