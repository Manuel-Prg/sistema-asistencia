// app/student/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckInOutCard } from "@/components/student/check-in-out-card"
import { ProgressCard } from "@/components/student/progress-card"
import { AttendanceHistory } from "@/components/student/attendance-history"

export default async function StudentDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  
  const { data: student } = await supabase.from("students").select("*, profile:profiles(*)").eq("id", user.id).single()

  if (!student) {
    redirect("/login")
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header Section - Mobile Optimized */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Panel de Control
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Gestiona tu asistencia y visualiza tu progreso
            </p>
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