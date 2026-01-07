// components/supervisor/admin-checkout-dialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, LogOut, Clock } from "lucide-react"
import { forceCheckOut } from "@/app/supervisor/actions"
import { useRouter } from "next/navigation"
import { formatDateTime } from "@/lib/utils/date-formatter"
interface AdminCheckoutDialogProps {
  record: any // Using any to match existing usage, ideally should be typed
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminCheckoutDialog({ record, open, onOpenChange }: AdminCheckoutDialogProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!record) return null

  const checkIn = new Date(record.check_in)
  const now = new Date()
  const hoursElapsed = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
  const willBeCapped = hoursElapsed > 10

  const handleForceCheckout = async () => {
    setLoading(true)
    const result = await forceCheckOut(record.id, reason || "Salida forzada por supervisor")

    if (result.success) {
      onOpenChange(false)
      setReason("")
      router.refresh()
    } else {
      alert(result.error || "Error al forzar salida")
    }
    setLoading(false)
  }

  const checkInFormatted = formatDateTime(record.check_in)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Forzar Salida</DialogTitle>
              <DialogDescription>
                Registrar salida manual para estudiante que olvidó marcar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Student Info Card */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estudiante</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {record.student.profile.full_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-300 dark:border-gray-600">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Entrada</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{checkInFormatted.time}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{checkInFormatted.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Turno</p>
              <Badge variant="outline" className="mt-1">
                {record.shift === "matutino" ? "☀️ Matutino" : "🌙 Vespertino"}
              </Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">Sala</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">📍 {record.room}</p>
          </div>

          {/* Hours Warning */}
          <div className={`p-3 rounded-lg border-2 ${willBeCapped
            ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700'
            : 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
            }`}>
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${willBeCapped ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${willBeCapped ? 'text-amber-900 dark:text-amber-200' : 'text-blue-900 dark:text-blue-200'
                  }`}>
                  Tiempo transcurrido: {hoursElapsed.toFixed(2)} horas
                </p>
                {willBeCapped && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    ⚠️ Se registrarán máximo 10 horas (límite diario)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div className="space-y-2">
          <Label htmlFor="reason">Motivo (opcional)</Label>
          <Input
            id="reason"
            placeholder="Ej: Olvidó marcar salida, emergencia, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {reason.length}/200 caracteres
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleForceCheckout}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Confirmar Salida
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
