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

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
              ¿Cuándo usar esta función?
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <ul className="list-disc list-inside space-y-1">
                <li>Para registrar horas trabajadas antes de implementar el sistema</li>
                <li>Para corregir errores en registros anteriores</li>
                <li>Para ajustes especiales autorizados por la coordinación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ManageHoursTable students={students || []} />
    </div>
  )
}
