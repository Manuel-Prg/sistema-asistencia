// components/student/early-departure-dialog.tsx
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Clock } from "lucide-react"

interface EarlyDepartureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hoursWorked: number
  onConfirm: (reason: string) => void
}

const REASONS = [
  { value: "enfermedad", label: "Enfermedad", emoji: "🤒" },
  { value: "imprevisto", label: "Imprevisto personal", emoji: "⚡" },
  { value: "familiar", label: "Emergencia familiar", emoji: "👨‍👩‍👧" },
  { value: "otra", label: "Otra razón", emoji: "📝" },
]

export function EarlyDepartureDialog({ open, onOpenChange, hoursWorked, onConfirm }: EarlyDepartureDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherReason, setOtherReason] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    const finalReason = selectedReason === "otra" ? otherReason : selectedReason
    if (finalReason) {
      setLoading(true)
      await onConfirm(finalReason)
      onOpenChange(false)
      // Reset state
      setSelectedReason("")
      setOtherReason("")
      setLoading(false)
    }
  }

  const isValid = selectedReason && (selectedReason !== "otra" || otherReason.trim())
  // ✅ CAMBIO: Ahora son 3 horas mínimas en lugar de 4
  const remainingHours = Math.max(3 - hoursWorked, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 space-y-1">
              <DialogTitle className="text-xl sm:text-2xl text-left">
                Aún no completas tus horas
              </DialogTitle>
              <DialogDescription className="text-left text-sm sm:text-base">
                Para registrar tu salida temprana, necesitamos conocer el motivo
              </DialogDescription>
            </div>
          </div>

          {/* Hours Summary Card */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">Horas trabajadas</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-200">
                  {hoursWorked.toFixed(2)}
                  <span className="text-base text-amber-600 dark:text-amber-400 font-normal ml-1">hrs</span>
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">Horas faltantes</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {remainingHours.toFixed(2)}
                  <span className="text-base text-orange-500 dark:text-orange-400 font-normal ml-1">hrs</span>
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-300 dark:border-amber-700">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <Clock className="h-4 w-4" />
                <p className="text-xs sm:text-sm">
                  Se requieren 3 horas mínimas por turno
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-semibold">Selecciona el motivo</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-2">
              {REASONS.map((reason) => (
                <div key={reason.value} className="relative">
                  <div 
                    className={`flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedReason === reason.value 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedReason(reason.value)}
                  >
                    <RadioGroupItem value={reason.value} id={reason.value} className="mt-0.5" />
                    <Label 
                      htmlFor={reason.value} 
                      className="flex items-center gap-2 cursor-pointer font-normal flex-1 text-sm sm:text-base"
                    >
                      <span className="text-xl sm:text-2xl">{reason.emoji}</span>
                      <span>{reason.label}</span>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "otra" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <Label htmlFor="other-reason" className="text-sm sm:text-base font-semibold">
                Especifica la razón
              </Label>
              <Textarea
                id="other-reason"
                placeholder="Por favor, describe brevemente el motivo de tu salida temprana..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={4}
                className="resize-none text-sm sm:text-base"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {otherReason.length}/200 caracteres
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!isValid || loading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {loading ? "Registrando..." : "Confirmar Salida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}