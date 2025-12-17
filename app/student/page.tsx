// app/student/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckInOutCard } from "@/components/student/check-in-out-card"
import { ProgressCard } from "@/components/student/progress-card"
import { AttendanceHistory } from "@/components/student/attendance-history"
import { RefreshButton } from "@/components/refresh-button"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function StudentDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: student } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .eq("id", user.id)
    .single()

  if (!student) {
    const { SignOutButton } = await import("@/components/sign-out-button")

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Perfil Incompleto</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Tu cuenta ha sido creada pero no se encontró tu registro de estudiante.
              Por favor contacta al administrador.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-400 mb-4">ID de Usuario: {user.id}</p>
            <SignOutButton />
          </div>
        </div>
      </div>
    )
  }

  const { data: activeRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  const { data: recentRecords } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .order("check_in", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                Panel de Control
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Gestiona tu asistencia y visualiza tu progreso
              </p>
            </div>
            <RefreshButton />
          </div>

          {/* Cards Grid - Responsive */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <ProgressCard
              accumulatedHours={student.accumulated_hours}
              requiredHours={student.required_hours}
              studentType={student.student_type}
            />
            <CheckInOutCard activeRecord={activeRecord} />
          </div>

          {/* Attendance History */}
          <AttendanceHistory records={recentRecords || []} />
        </div>
      </div>
    </div>
  )
}