import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/supervisor/stats-cards"
import { ActiveStudents } from "@/components/supervisor/active-students"
import { RecentActivity } from "@/components/supervisor/recent-activity"

export default async function SupervisorDashboard() {
  const supabase = await getSupabaseServerClient()

  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .order("profile(full_name)")

  const { data: activeRecords } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .is("check_out", null)
    .order("check_in", { ascending: false })

  const { data: recentRecords } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .not("check_out", "is", null)
    .order("check_out", { ascending: false })
    .limit(10)

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-5"></div>
          <div className="relative p-6 sm:p-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
              Vista general del sistema de asistencia
            </p>
          </div>
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
    </div>
  )
}