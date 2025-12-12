// components/supervisor/export-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.access_token) {
        throw new Error("No hay sesión activa")
      }

      // 1. Obtener datos crudos de la API
      const response = await fetch('/api/export_attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({}) // Enviar fechas si es necesario
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Error al obtener datos")
      }

      const { data } = await response.json()

      if (!data || data.length === 0) {
        throw new Error("No hay datos para exportar")
      }

      // 2. Generar Excel en el cliente
      const ExcelJS = (await import('exceljs')).default
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Asistencias')

      // Definir columnas
      worksheet.columns = [
        { header: 'ID Registro', key: 'id_registro', width: 36 },
        { header: 'Nombre Completo', key: 'nombre_completo', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Rol', key: 'rol', width: 15 },
        { header: 'Tipo Estudiante', key: 'tipo_estudiante', width: 20 },
        { header: 'Horas Req.', key: 'horas_requeridas', width: 15 },
        { header: 'Hab. Asignada', key: 'hab_asignada_student', width: 20 },
        { header: 'Turno', key: 'turno', width: 15 },
        { header: 'Hab. Registro', key: 'hab_registro', width: 20 },
        { header: 'Entrada (Check-in)', key: 'check_in', width: 25 },
        { header: 'Salida (Check-out)', key: 'check_out', width: 25 },
        { header: 'Horas Trab.', key: 'horas_trabajadas', width: 15 },
        { header: 'Motivo Salida', key: 'motivo_salida_temprana', width: 30 },
        { header: 'Fecha Creación', key: 'creado_en_registro', width: 25 },
      ]

      // Estilar cabecera
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F46E5' }
      }
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
      headerRow.height = 30

      // Agregar datos
      data.forEach((r: any) => {
        const profile = r?.students?.profiles || null
        worksheet.addRow({
          id_registro: r.id,
          nombre_completo: profile?.full_name || '',
          email: profile?.email || '',
          rol: profile?.role || '',
          tipo_estudiante: r?.students?.student_type || '',
          horas_requeridas: r?.students?.required_hours ?? '',
          hab_asignada_student: r?.students?.assigned_room ?? '',
          turno: r.shift ?? '',
          hab_registro: r.room ?? '',
          check_in: r.check_in ? new Date(r.check_in).toLocaleString('es-MX') : '',
          check_out: r.check_out ? new Date(r.check_out).toLocaleString('es-MX') : '',
          horas_trabajadas: r.hours_worked ?? '',
          motivo_salida_temprana: r.early_departure_reason ?? '',
          creado_en_registro: r.created_at ? new Date(r.created_at).toLocaleString('es-MX') : '',
        })
      })

      // Bordes y alineación
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
          if (rowNumber > 1) {
            cell.alignment = { vertical: 'middle', wrapText: true }
          }
        })
      })

      // 3. Descargar archivo
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `asistencias_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Exportación completada")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Error al exportar datos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
    >
      <Download className={`h-4 w-4 ${loading ? "animate-bounce" : ""}`} />
      <span className="hidden sm:inline">
        {loading ? "Exportando..." : "Exportar"}
      </span>
      <span className="sm:hidden">
        {loading ? "..." : "Export"}
      </span>
    </Button>
  )
}