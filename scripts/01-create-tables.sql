-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'supervisor');

-- Create enum for student types
CREATE TYPE student_type AS ENUM ('servicio_social', 'practicas');

-- Create enum for shift types
CREATE TYPE shift_type AS ENUM ('matutino', 'vespertino', 'completo');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  student_type student_type NOT NULL,
  required_hours INTEGER NOT NULL,
  assigned_room TEXT NOT NULL,
  accumulated_hours DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  shift shift_type NOT NULL,
  room TEXT NOT NULL,
  hours_worked DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_date ON attendance_records(check_in);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Supervisors can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- RLS Policies for students
CREATE POLICY "Students can view their own data"
  ON students FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Supervisors can view all students"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

-- RLS Policies for attendance_records
CREATE POLICY "Students can view their own attendance"
  ON attendance_records FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own attendance"
  ON attendance_records FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own attendance"
  ON attendance_records FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Supervisors can view all attendance"
  ON attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );

CREATE POLICY "Supervisors can update all attendance"
  ON attendance_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'supervisor'
    )
  );
