import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdjustmentsHistoryPage() {
  const supabase = await getSupabaseServerClient()

  // Obtener registros que son ajustes manuales
  const { data: adjustments } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .eq("room", "Ajuste Manual")
    .order("created_at", { ascending: false })

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <History className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Historial de Ajustes
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Registro de todos los ajustes manuales realizados
          </p>
        </div>
        <Link href="/supervisor/manage-hours">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Ajustes Realizados ({adjustments?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!adjustments || adjustments.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No hay ajustes registrados
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Los ajustes manuales aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {adjustments.map((adjustment) => (
                <div
                  key={adjustment.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {adjustment.student.profile.full_name}
                        </h3>
                        <Badge variant="secondary" className="dark:bg-gray-700">
                          +{adjustment.hours_worked?.toFixed(1)}h
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {adjustment.early_departure_reason?.replace(
                          "AJUSTE MANUAL: ",
                          ""
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Registrado el {formatDateTime(adjustment.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}