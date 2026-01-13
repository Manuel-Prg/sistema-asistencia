// components/refresh-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { showSuccess, showError } from "@/lib/toast-utils"

export function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    toast.loading("Actualizando datos...", { id: "refresh" })

    try {
      router.refresh()

      // Pequeño delay para dar feedback visual
      setTimeout(() => {
        setIsRefreshing(false)
        toast.dismiss("refresh")
        showSuccess("Datos actualizados")
      }, 500)
    } catch (error) {
      setIsRefreshing(false)
      toast.dismiss("refresh")
      showError("Error al actualizar")
    }
  }

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="default"
      className="gap-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span className="hidden sm:inline">Actualizar</span>
    </Button>
  )
}