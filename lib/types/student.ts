// lib/types/student.ts
// Tipos relacionados con componentes de estudiantes

export interface StudentNavProps {
    userName: string
}

export interface ProgressCardProps {
    accumulatedHours: number
    requiredHours: number
    studentType: "servicio_social" | "practicas"
}

export interface EarlyDepartureDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    hoursWorked: number
    onConfirm: (reason: string) => void
}

export interface CheckInOutCardProps {
    activeRecord: any
}

export interface AttendanceHistoryProps {
    records: import("@/lib/supabase/types").AttendanceRecord[]
}
