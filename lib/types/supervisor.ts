// lib/types/supervisor.ts
// Tipos relacionados con componentes de supervisor

export interface Student {
    id: string
    student_type: string
    required_hours: number
    accumulated_hours: number
    assigned_room: string | null
    profile: {
        full_name: string
        email: string
    }
}

export interface ManageHoursStudent {
    id: string
    accumulated_hours: number
    profile: {
        full_name: string
    }
}

export interface StudentsTableProps {
    students: Student[]
}

export interface ManageHoursTableProps {
    students: ManageHoursStudent[]
}

export interface StatsCardsProps {
    totalStudents: number
    activeNow: number
    totalHoursToday: number
    avgProgress: number
}

export interface SupervisorNavProps {
    userName: string
}

export interface RecentActivityProps {
    records: any[]
}

export interface AdminCheckoutDialogProps {
    record: {
        id: string
        check_in: string
        shift: string
        room: string
        student: {
            profile: {
                full_name: string
            }
        }
    }
}

export interface AttendanceRecord {
    id: string
    check_in: string
    check_out: string | null
    room: string
    shift: string
    hours_worked: number | null
    early_departure_reason: string | null
    student: {
        profile: {
            full_name: string
        }
    }
}

export interface AttendanceTableProps {
    records: AttendanceRecord[]
}

export interface ActiveStudentsProps {
    records: any[]
}

export interface AutoCloseButtonProps {
    longSessions: number
    oldRecords: number
}
