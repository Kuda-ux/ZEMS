-- ZEMS — Zimbabwe Education Management System
-- Initial Database Schema Migration
-- PostgreSQL (Supabase)

-- ============================================
-- PROVINCES & DISTRICTS (Zimbabwe Administrative)
-- ============================================
CREATE TABLE provinces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id UUID REFERENCES provinces(id),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCHOOLS
-- ============================================
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('government', 'private', 'mission', 'community')),
  level VARCHAR(20) NOT NULL CHECK (level IN ('primary', 'secondary', 'combined')),
  district_id UUID REFERENCES districts(id),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  head_teacher_name VARCHAR(200),
  registration_number VARCHAR(50),
  is_boarding BOOLEAN DEFAULT FALSE,
  established_year INTEGER,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USERS & AUTH
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  national_id VARCHAR(30),
  school_id UUID REFERENCES schools(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('national', 'provincial', 'district', 'school')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id),
  school_id UUID REFERENCES schools(id),
  province_id UUID REFERENCES provinces(id),
  district_id UUID REFERENCES districts(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id, school_id)
);

-- ============================================
-- ACADEMIC STRUCTURE
-- ============================================
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID REFERENCES academic_years(id),
  name VARCHAR(50) NOT NULL,
  term_number INTEGER NOT NULL CHECK (term_number IN (1, 2, 3)),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  level_order INTEGER NOT NULL,
  school_level VARCHAR(20) NOT NULL CHECK (school_level IN ('primary', 'secondary')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  grade_id UUID REFERENCES grades(id),
  academic_year_id UUID REFERENCES academic_years(id),
  name VARCHAR(50) NOT NULL,
  capacity INTEGER DEFAULT 45,
  class_teacher_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  school_level VARCHAR(20) CHECK (school_level IN ('primary', 'secondary', 'both')),
  is_compulsory BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE stream_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES streams(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(stream_id, subject_id)
);

-- ============================================
-- STUDENTS
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zems_id VARCHAR(20) UNIQUE,
  school_id UUID REFERENCES schools(id) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  national_id VARCHAR(30),
  birth_entry_number VARCHAR(50),
  nationality VARCHAR(50) DEFAULT 'Zimbabwean',
  home_language VARCHAR(50),
  medical_conditions TEXT,
  disability_type VARCHAR(100),
  has_special_needs BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  address TEXT,
  province_of_origin UUID REFERENCES provinces(id),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  enrollment_type VARCHAR(20) DEFAULT 'new' CHECK (enrollment_type IN ('new', 'transfer', 're_enroll')),
  previous_school VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred', 'graduated', 'expelled', 'deceased')),
  is_orphan BOOLEAN DEFAULT FALSE,
  is_beam_beneficiary BOOLEAN DEFAULT FALSE,
  sponsorship_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  alt_phone VARCHAR(20),
  email VARCHAR(100),
  national_id VARCHAR(30),
  occupation VARCHAR(100),
  address TEXT,
  is_emergency_contact BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID REFERENCES guardians(id),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, guardian_id)
);

CREATE TABLE student_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  stream_id UUID REFERENCES streams(id),
  academic_year_id UUID REFERENCES academic_years(id),
  enrolled_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

-- ============================================
-- STAFF
-- ============================================
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  school_id UUID REFERENCES schools(id) NOT NULL,
  employee_number VARCHAR(30) UNIQUE,
  title VARCHAR(20),
  staff_type VARCHAR(30) NOT NULL CHECK (staff_type IN ('teaching', 'non_teaching', 'administrative')),
  position VARCHAR(100),
  department VARCHAR(100),
  qualification VARCHAR(200),
  specialization VARCHAR(200),
  date_joined DATE,
  contract_type VARCHAR(30) CHECK (contract_type IN ('permanent', 'contract', 'temporary', 'volunteer')),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ATTENDANCE
-- ============================================
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id),
  stream_id UUID REFERENCES streams(id),
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  reason TEXT,
  marked_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- ============================================
-- FEES & FINANCE
-- ============================================
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  term_id UUID REFERENCES terms(id),
  grade_id UUID REFERENCES grades(id),
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  is_compulsory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(30) NOT NULL UNIQUE,
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id),
  term_id UUID REFERENCES terms(id),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'waived')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id),
  description VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(30) NOT NULL UNIQUE,
  school_id UUID REFERENCES schools(id) NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  student_id UUID REFERENCES students(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'ecocash', 'innbucks', 'onemoney', 'check', 'beam', 'sponsorship')),
  reference_number VARCHAR(100),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  received_by UUID REFERENCES user_profiles(id),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'reversed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXAMS & RESULTS
-- ============================================
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  term_id UUID REFERENCES terms(id),
  name VARCHAR(100) NOT NULL,
  exam_type VARCHAR(30) CHECK (exam_type IN ('test', 'midterm', 'endterm', 'mock', 'assignment')),
  max_mark DECIMAL(5,2) DEFAULT 100,
  weight DECIMAL(5,2) DEFAULT 100,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES exams(id),
  student_id UUID REFERENCES students(id),
  subject_id UUID REFERENCES subjects(id),
  stream_id UUID REFERENCES streams(id),
  mark DECIMAL(5,2),
  grade VARCHAR(5),
  teacher_id UUID REFERENCES user_profiles(id),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, subject_id)
);

CREATE TABLE grading_scales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  name VARCHAR(50) NOT NULL,
  min_mark DECIMAL(5,2) NOT NULL,
  max_mark DECIMAL(5,2) NOT NULL,
  grade VARCHAR(5) NOT NULL,
  points DECIMAL(3,1),
  remark VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORT CARDS
-- ============================================
CREATE TABLE report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  stream_id UUID REFERENCES streams(id),
  term_id UUID REFERENCES terms(id),
  academic_year_id UUID REFERENCES academic_years(id),
  class_teacher_comment TEXT,
  head_teacher_comment TEXT,
  attendance_days_present INTEGER,
  attendance_days_absent INTEGER,
  total_school_days INTEGER,
  overall_position INTEGER,
  class_size INTEGER,
  overall_average DECIMAL(5,2),
  conduct VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DISCIPLINE
-- ============================================
CREATE TABLE discipline_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  incident_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'major', 'critical')),
  description TEXT NOT NULL,
  action_taken TEXT,
  reported_by UUID REFERENCES user_profiles(id),
  parent_notified BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'escalated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNICATIONS
-- ============================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(30) CHECK (target_audience IN ('all', 'parents', 'teachers', 'students', 'staff')),
  priority VARCHAR(20) DEFAULT 'normal',
  published_by UUID REFERENCES user_profiles(id),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES user_profiles(id),
  recipient_id UUID REFERENCES user_profiles(id),
  school_id UUID REFERENCES schools(id),
  subject VARCHAR(200),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TIMETABLE
-- ============================================
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  stream_id UUID REFERENCES streams(id),
  subject_id UUID REFERENCES subjects(id),
  teacher_id UUID REFERENCES user_profiles(id),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 5),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(100),
  academic_year_id UUID REFERENCES academic_years(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WELFARE
-- ============================================
CREATE TABLE welfare_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  school_id UUID REFERENCES schools(id) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('ovc', 'beam', 'feeding', 'counseling', 'health', 'disability')),
  description TEXT,
  support_type VARCHAR(100),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  recorded_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INVENTORY
-- ============================================
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) NOT NULL,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  asset_number VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  condition VARCHAR(20) CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged', 'disposed')),
  location VARCHAR(100),
  purchase_date DATE,
  purchase_cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  school_id UUID REFERENCES schools(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_zems_id ON students(zems_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_exam_marks_exam ON exam_marks(exam_id);
CREATE INDEX idx_exam_marks_student ON exam_marks(student_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_discipline_student ON discipline_records(student_id);
CREATE INDEX idx_welfare_student ON welfare_records(student_id);

-- ============================================
-- SEED DATA: Zimbabwe Provinces
-- ============================================
INSERT INTO provinces (name, code) VALUES
  ('Bulawayo', 'BUL'),
  ('Harare', 'HAR'),
  ('Manicaland', 'MAN'),
  ('Mashonaland Central', 'MSC'),
  ('Mashonaland East', 'MSE'),
  ('Mashonaland West', 'MSW'),
  ('Masvingo', 'MSV'),
  ('Matabeleland North', 'MTN'),
  ('Matabeleland South', 'MTS'),
  ('Midlands', 'MID');

-- SEED DATA: Roles
INSERT INTO roles (name, display_name, level, description) VALUES
  ('super_admin', 'Super Admin', 'national', 'Full system access'),
  ('ministry_admin', 'Ministry Admin', 'national', 'National oversight and reporting'),
  ('provincial_admin', 'Provincial Admin', 'provincial', 'Provincial education oversight'),
  ('district_admin', 'District Admin', 'district', 'District education management'),
  ('school_admin', 'School Admin', 'school', 'School-level management (Head Teacher)'),
  ('bursar', 'Bursar', 'school', 'School finance management'),
  ('teacher', 'Teacher', 'school', 'Class and subject management'),
  ('parent', 'Parent', 'school', 'View own children data');

-- SEED DATA: Grades
INSERT INTO grades (name, level_order, school_level) VALUES
  ('Grade 1', 1, 'primary'),
  ('Grade 2', 2, 'primary'),
  ('Grade 3', 3, 'primary'),
  ('Grade 4', 4, 'primary'),
  ('Grade 5', 5, 'primary'),
  ('Grade 6', 6, 'primary'),
  ('Grade 7', 7, 'primary'),
  ('Form 1', 8, 'secondary'),
  ('Form 2', 9, 'secondary'),
  ('Form 3', 10, 'secondary'),
  ('Form 4', 11, 'secondary'),
  ('Form 5 (Lower 6)', 12, 'secondary'),
  ('Form 6 (Upper 6)', 13, 'secondary');

-- SEED DATA: Subjects
INSERT INTO subjects (name, code, school_level, is_compulsory) VALUES
  ('English', 'ENG', 'both', TRUE),
  ('Mathematics', 'MATH', 'both', TRUE),
  ('Shona', 'SHO', 'both', FALSE),
  ('Ndebele', 'NDE', 'both', FALSE),
  ('Science', 'SCI', 'primary', TRUE),
  ('Social Studies', 'SOC', 'primary', TRUE),
  ('Physical Education', 'PE', 'both', FALSE),
  ('Agriculture', 'AGR', 'both', FALSE),
  ('Biology', 'BIO', 'secondary', FALSE),
  ('Chemistry', 'CHE', 'secondary', FALSE),
  ('Physics', 'PHY', 'secondary', FALSE),
  ('Geography', 'GEO', 'secondary', FALSE),
  ('History', 'HIS', 'secondary', FALSE),
  ('Commerce', 'COM', 'secondary', FALSE),
  ('Accounts', 'ACC', 'secondary', FALSE),
  ('Computer Science', 'CS', 'secondary', FALSE);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- School-scoped access: users can only see data from their own school
CREATE POLICY school_students ON students
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY school_attendance ON attendance_records
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY school_payments ON payments
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY school_invoices ON invoices
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM user_profiles WHERE id = auth.uid()
    )
  );
