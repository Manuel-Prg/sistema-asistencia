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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-5"></div>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Historial de Asistencias
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Registro completo de todas las asistencias
              </p>
            </div>
            <ExportButton />
          </div>
        </div>

        <AttendanceTable records={records || []} />
      </div>
    </div>
  )
}