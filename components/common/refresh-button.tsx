// components/refresh-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"
import { sileo } from "sileo"
import { showSuccess, showError } from "@/lib/toast-utils"

export function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // sileo might allow promises or we just show a message.
    // The previous code used toast.loading with an id.
    // Sileo promise API:
    // const promise = new Promise(...)
    // sileo.promise(promise, { loading: '...', success: '...', error: '...' })

    // Or just manual dismissal if supported. 
    // Sileo docs: "The promise method returns the original promise...".
    // Let's use sileo.promise if possible, but here `refresh` is instantaneous in router, but we have a timeout.

    // Let's try to mimic the loading state.
    // sileo doesn't seem to have a dismiss by ID in the simple docs I saw, except maybe via object reference? "fire a toast".
    // If we want simple replacement:

    sileo.promise(
      new Promise((resolve) => {
        router.refresh()
        setTimeout(() => {
          resolve(true)
          setIsRefreshing(false)
        }, 500)
      }),
      {
        loading: { title: "Actualizando datos..." },
        success: { title: "Datos actualizados" },
        error: { title: "Error al actualizar" }
      }
    )

    // Original logic had separate try/catch. router.refresh() is void/sync usually in Next.js app router (it triggers revalidation but returns void).
    // So the previous code was wrapping it in a timeout essentially.

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