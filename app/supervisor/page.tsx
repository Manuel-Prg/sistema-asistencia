import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/supervisor/stats-cards"
import { ActiveStudents } from "@/components/supervisor/active-students"
import { RecentActivity } from "@/components/supervisor/recent-activity"

export default async function SupervisorDashboard() {
  const supabase = await getSupabaseServerClient()

  // Get all students with their profiles
  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .order("profile(full_name)")

  // Get active check-ins (no check-out)
  const { data: activeRecords } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .is("check_out", null)
    .order("check_in", { ascending: false })

  // Get recent completed records
  const { data: recentRecords } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .not("check_out", "is", null)
    .order("check_out", { ascending: false })
    .limit(10)

  // Calculate stats
  const totalStudents = students?.length || 0
  const activeNow = activeRecords?.length || 0
  const totalHoursToday =
    recentRecords?.reduce((sum, record) => {
      const today = new Date().toDateString()
      const recordDate = new Date(record.check_in).toDateString()
      if (recordDate === today && record.hours_worked) {
        return sum + record.hours_worked
      }
      return sum
    }, 0) || 0

  const avgProgress =
    students?.reduce((sum, student) => {
      const progress = (student.accumulated_hours / student.required_hours) * 100
      return sum + progress
    }, 0) / (totalStudents || 1) || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Vista general del sistema de asistencia</p>
      </div>

      <StatsCards
        totalStudents={totalStudents}
        activeNow={activeNow}
        totalHoursToday={totalHoursToday}
        avgProgress={avgProgress}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveStudents records={activeRecords || []} />
        <RecentActivity records={recentRecords || []} />
      </div>
    </div>
  )
}
