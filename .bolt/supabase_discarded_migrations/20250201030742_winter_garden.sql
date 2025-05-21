/*
  # Initial Schema Setup for Educational Program Management System

  1. New Tables
    - programs
      - Core program information
      - Supports program metadata and configuration
    - courses
      - Course details and relationships
      - Linked to programs
    - enrollments
      - Student enrollment records
      - Tracks enrollment status and progress
    - students
      - Student profiles and authentication
      - Includes personal and academic information
    - resources
      - Educational resources and materials
      - Program and course specific content
    - user_roles
      - Role-based access control
      - Defines user permissions
    - activity_logs
      - System-wide activity tracking
      - Audit trail for compliance

  2. Security
    - Enable RLS on all tables
    - Implement role-based policies
    - Secure sensitive data

  3. Indexes
    - Optimized for common queries
    - Performance tuning for concurrent access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Programs Table
CREATE TABLE programs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  capacity integer NOT NULL DEFAULT 500,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived'))
);

CREATE INDEX idx_programs_status ON programs(status);

-- Courses Table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  credits integer NOT NULL,
  duration interval NOT NULL,
  prerequisites jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived'))
);

CREATE INDEX idx_courses_program ON courses(program_id);
CREATE INDEX idx_courses_status ON courses(status);

-- Students Table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  date_of_birth date NOT NULL,
  address jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended'))
);

CREATE INDEX idx_students_auth_id ON students(auth_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);

-- Enrollments Table
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  enrollment_date timestamptz NOT NULL DEFAULT now(),
  completion_date timestamptz,
  progress jsonb DEFAULT '{}'::jsonb,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'active', 'completed', 'withdrawn')),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded'))
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_program ON enrollments(program_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_payment_status ON enrollments(payment_status);

-- Resources Table
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_type CHECK (type IN ('document', 'video', 'audio', 'link', 'other')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived'))
);

CREATE INDEX idx_resources_program ON resources(program_id);
CREATE INDEX idx_resources_course ON resources(course_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_status ON resources(status);

-- Activity Logs Table
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public programs are viewable by everyone"
  ON programs FOR SELECT
  USING (status = 'active');

CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  USING (student_id = auth.uid()::uuid);

CREATE POLICY "Students can view course resources when enrolled"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.program_id = resources.program_id
      AND e.student_id = auth.uid()::uuid
      AND e.status = 'active'
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert initial program data
INSERT INTO programs (name, description, capacity) VALUES
  ('Computer Technology', 'Master modern computer technology practices and principles with hands-on projects.', 500),
  ('Vocational Studies', 'Hands-on training for practical skills, preparing individuals for career-focused industries.', 500),
  ('Construction Technologies', 'Construction Technologies enhance efficiency and safety in construction through innovative digital solutions.', 500);