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

  // Get student data
  const { data: student } = await supabase.from("students").select("*, profile:profiles(*)").eq("id", user.id).single()

  if (!student) {
    redirect("/login")
  }

  // Get active check-in
  const { data: activeRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  // Get recent attendance records
  const { data: recentRecords } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .order("check_in", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ProgressCard
          accumulatedHours={student.accumulated_hours}
          requiredHours={student.required_hours}
          studentType={student.student_type}
        />
        <CheckInOutCard activeRecord={activeRecord} />
      </div>
      <AttendanceHistory records={recentRecords || []} />
    </div>
  )
}
