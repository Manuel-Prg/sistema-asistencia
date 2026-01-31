import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ManageHoursTable } from "@/components/supervisor/manage-hours-table"
import { Button } from "@/components/ui/button"
import { Clock, History } from "lucide-react"
import Link from "next/link"

export default async function ManageHoursPage() {
  const supabase = await getSupabaseServerClient()

  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles!inner(*)")
    .order("profile(full_name)")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestionar Horas</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Ajusta las horas acumuladas de los estudiantes manualmente
        </p>
      </div>
      <ManageHoursTable students={students || []} />
    </div>
  )
}
