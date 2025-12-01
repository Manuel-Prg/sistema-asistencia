/**
 * Tipos para la base de datos de Supabase
 * Define las estructuras de datos principales del sistema
 */

/**
 * Enum para los roles de usuario
 */
export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  STUDENT = 'student',
}

/**
 * Enum para los turnos de trabajo
 */
export enum Shift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
}

/**
 * Enum para los tipos de estudiante
 */
export enum StudentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  VOLUNTEER = 'volunteer',
}

/**
 * Tipo para el perfil de usuario
 */
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

/**
 * Tipo para datos del estudiante
 */
export interface Student {
  id: string;
  student_type: StudentType;
  required_hours: number;
  assigned_room: string | null;
  accumulated_hours: number;
  created_at: string;
}

/**
 * Tipo para registro de asistencia
 */
export interface AttendanceRecord {
  id: string;
  student_id: string;
  check_in: string;
  check_out: string | null;
  shift: Shift;
  room: string;
  hours_worked: number | null;
  created_at: string;
  early_departure_reason: string | null;
}

/**
 * Tipo extendido para estudiante con perfil
 */
export interface StudentWithProfile extends Student {
  profile: Profile;
}

/**
 * Tipo extendido para registro de asistencia con datos del estudiante
 */
export interface AttendanceWithStudent extends AttendanceRecord {
  student: StudentWithProfile;
}
