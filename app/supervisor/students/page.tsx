// app/supervisor/students/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StudentsTable } from "@/components/supervisor/students-table"
import { SyncHoursButton } from "@/components/supervisor/sync-hours-button"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"

// ✅ CRÍTICO: Deshabilitar caché completamente
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function StudentsPage() {
  const supabase = await getSupabaseServerClient()

  // ✅ Obtener datos frescos sin caché
  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .order("profile(full_name)")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-5"></div>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Estudiantes
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
                Lista completa de estudiantes y su progreso
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <SyncHoursButton />
              <Link href="/supervisor/users/new">
                <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Agregar Usuario</span>
                  <span className="sm:hidden">Agregar</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <StudentsTable students={students || []} />
      </div>
    </div>
  )
}