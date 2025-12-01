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
        throw new Error(errorData.error || "Error en la descarga")
      }

      const blob = await response.blob()

      if (blob.size === 0) throw new Error("Archivo vacío")

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