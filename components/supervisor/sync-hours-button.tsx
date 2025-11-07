"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SyncHoursButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const syncHours = async () => {
    try {
      setLoading(true)

      // Obtener todos los estudiantes
      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("id")

      if (studentsError) throw studentsError

      // Actualizar horas acumuladas para cada estudiante
      for (const student of students || []) {
        const { data: records, error: recordsError } = await supabase
          .from("attendance_records")
          .select("hours_worked")
          .eq("student_id", student.id)
          .not("check_out", "is", null)
          .not("hours_worked", "is", null)

        if (recordsError) throw recordsError

        const totalHours = records.reduce(
          (sum: any, record: { hours_worked: any }) => sum + (record.hours_worked || 0),
          0
        )

        const { error: updateError } = await supabase
          .from("students")
          .update({ accumulated_hours: totalHours })
          .eq("id", student.id)

        if (updateError) throw updateError
      }

      toast.success("Horas sincronizadas correctamente")
      router.refresh()
    } catch (error) {
      console.error("Error syncing hours:", error)
      toast.error("Error al sincronizar horas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={syncHours}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Sincronizando..." : "Sincronizar Horas"}
    </Button>
  )
}