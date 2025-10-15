import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AttendanceTable } from "@/components/supervisor/attendance-table"
import { ExportButton } from "@/components/supervisor/export-button"

export default async function AttendancePage() {
  const supabase = await getSupabaseServerClient()

  const { data: records } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .order("check_in", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Historial de Asistencias</h2>
          <p className="text-gray-600">Registro completo de todas las asistencias</p>
        </div>
        <ExportButton />
      </div>

      <AttendanceTable records={records || []} />
    </div>
  )
}
