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
import { AlertCircle } from "lucide-react"

interface EarlyDepartureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hoursWorked: number
  onConfirm: (reason: string) => void
}

const REASONS = [
  { value: "enfermedad", label: "Enfermedad" },
  { value: "imprevisto", label: "Imprevisto" },
  { value: "otra", label: "Otra razón" },
]

export function EarlyDepartureDialog({ open, onOpenChange, hoursWorked, onConfirm }: EarlyDepartureDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherReason, setOtherReason] = useState<string>("")

  const handleConfirm = () => {
    const finalReason = selectedReason === "otra" ? otherReason : selectedReason
    if (finalReason) {
      onConfirm(finalReason)
      onOpenChange(false)
      // Reset state
      setSelectedReason("")
      setOtherReason("")
    }
  }

  const isValid = selectedReason && (selectedReason !== "otra" || otherReason.trim())

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Aún no completas tus horas
          </DialogTitle>
          <DialogDescription>
            Has trabajado {hoursWorked.toFixed(2)} horas de las 4 horas requeridas. ¿Cuál es la razón de tu salida
            temprana?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {REASONS.map((reason) => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="cursor-pointer font-normal">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "otra" && (
            <div className="space-y-2">
              <Label htmlFor="other-reason">Especifica la razón</Label>
              <Textarea
                id="other-reason"
                placeholder="Escribe el motivo de tu salida temprana..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Confirmar Salida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
