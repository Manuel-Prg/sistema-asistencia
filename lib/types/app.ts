// lib/types/app.ts
// Tipos relacionados con páginas de la aplicación

export interface ActiveStudent {
    id: string
    studentName: string
    checkIn: string
    shift: string
    room: string
}


export interface AdjustmentRecord {
    id: string
    created_at: string
    hours_worked: number | null
    early_departure_reason: string | null
    student: {
        profile: {
            full_name: string
        }
    }
}
