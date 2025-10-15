export type UserRole = "student" | "supervisor"
export type StudentType = "servicio_social" | "practicas"
export type ShiftType = "matutino" | "vespertino"

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

export interface Student {
  id: string
  student_type: StudentType
  required_hours: number
  assigned_room: string
  accumulated_hours: number
  created_at: string
}

export interface AttendanceRecord {
  id: string
  student_id: string
  check_in: string
  check_out: string | null
  shift: ShiftType
  room: string
  hours_worked: number | null
  created_at: string
}

export interface StudentWithProfile extends Student {
  profile: Profile
}
