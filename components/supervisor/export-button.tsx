// components/supervisor/export-button.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      // Tu lógica de exportación aquí
      toast.success("Exportación completada")
    } catch (error) {
      toast.error("Error al exportar datos")
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