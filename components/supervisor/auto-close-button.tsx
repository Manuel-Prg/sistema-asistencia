// components/supervisor/auto-close-button.tsx
"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { autoCloseOldRecords, capLongSessions } from "@/app/supervisor/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AutoCloseButtonProps {
  longSessions: number
  oldRecords: number
}

export function AutoCloseButton({ longSessions, oldRecords }: AutoCloseButtonProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleCapLongSessions = async () => {
    setLoading("cap")
    const result = await capLongSessions()
    
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.error || "Error al limitar sesiones")
    }
    setLoading(null)
  }

  const handleCloseOldRecords = async () => {
    setLoading("close")
    const result = await autoCloseOldRecords()
    
    if (result.success) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.error || "Error al cerrar registros")
    }
    setLoading(null)
  }

  const hasIssues = longSessions > 0 || oldRecords > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={hasIssues ? "destructive" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Administrar</span>
          {hasIssues && (
            <span className="h-2 w-2 bg-white dark:bg-gray-800 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Administración de Sesiones
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Cap long sessions */}
        <DropdownMenuItem
          onClick={handleCapLongSessions}
          disabled={loading !== null || longSessions === 0}
          className="cursor-pointer"
        >
          <div className="flex items-start gap-3 w-full">
            <Clock className={`h-5 w-5 mt-0.5 ${
              longSessions > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <div className="flex-1">
              <p className="font-medium text-sm">
                Limitar a 10 horas
              </p>
              <p className="text-xs text-muted-foreground">
                {longSessions > 0 
                  ? `${longSessions} ${longSessions === 1 ? 'sesión' : 'sesiones'} exceden 10hrs`
                  : 'No hay sesiones largas'
                }
              </p>
            </div>
            {loading === "cap" && (
              <div className="h-4 w-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </DropdownMenuItem>

        {/* Close old records */}
        <DropdownMenuItem
          onClick={handleCloseOldRecords}
          disabled={loading !== null || oldRecords === 0}
          className="cursor-pointer"
        >
          <div className="flex items-start gap-3 w-full">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${
              oldRecords > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'
            }`} />
            <div className="flex-1">
              <p className="font-medium text-sm">
                Cerrar registros antiguos
              </p>
              <p className="text-xs text-muted-foreground">
                {oldRecords > 0 
                  ? `${oldRecords} ${oldRecords === 1 ? 'registro' : 'registros'} con +24hrs`
                  : 'No hay registros antiguos'
                }
              </p>
            </div>
            {loading === "close" && (
              <div className="h-4 w-4 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {!hasIssues && (
          <div className="px-2 py-3 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Todas las sesiones están en orden
            </p>
          </div>
        )}

        <div className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-1">Políticas automáticas:</p>
          <ul className="space-y-1">
            <li>• Máximo 10 horas por día</li>
            <li>• Auto-cierre después de 24hrs</li>
          </ul>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
