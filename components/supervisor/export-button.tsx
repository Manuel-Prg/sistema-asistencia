// components/supervisor/export-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToExcel } from "@/app/supervisor/actions"
import { useState } from "react"

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const { students, records } = await exportToExcel()

      // Create CSV content
      let csv = "Reporte de Asistencias\n\n"

      // Students summary
      csv += "RESUMEN DE ESTUDIANTES\n"
      csv += "Nombre,Email,Tipo,Horas Requeridas,Horas Acumuladas,Progreso,Sala\n"
      students?.forEach((student: any) => {
        const progress = ((student.accumulated_hours / student.required_hours) * 100).toFixed(1)
        csv += `${student.profile.full_name},${student.profile.email},${student.student_type === "servicio_social" ? "Servicio Social" : "Prácticas"},${student.required_hours},${student.accumulated_hours.toFixed(1)},${progress}%,${student.assigned_room}\n`
      })

      csv += "\n\nHISTORIAL DE ASISTENCIAS\n"
      csv += "Estudiante,Email,Fecha,Entrada,Salida,Turno,Sala,Horas Trabajadas\n"
      records?.forEach((record: any) => {
        const checkIn = new Date(record.check_in)
        const checkOut = record.check_out ? new Date(record.check_out) : null
        csv += `${record.student.profile.full_name},${record.student.profile.email},${checkIn.toLocaleDateString()},${checkIn.toLocaleTimeString()},${checkOut ? checkOut.toLocaleTimeString() : "En curso"},${record.shift === "matutino" ? "Matutino" : "Vespertino"},${record.room},${record.hours_worked ? record.hours_worked.toFixed(2) : "-"}\n`
      })

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `reporte-asistencias-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error exporting:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={loading} className="gap-2">
      <Download className="h-4 w-4" />
      {loading ? "Exportando..." : "Exportar a Excel"}
    </Button>
  )
}
