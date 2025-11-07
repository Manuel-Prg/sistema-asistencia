// components/student/check-in-out-card.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, LogOut, Clock } from "lucide-react"
import { checkIn, checkOut } from "@/app/student/actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { EarlyDepartureDialog } from "./early-departure-dialog"

interface CheckInOutCardProps {
  activeRecord: any
}

const ROOMS = ["Sala 1", "Sala 2 y Galería", "Sala 3", "Sala 4 y 5"]

export function CheckInOutCard({ activeRecord }: CheckInOutCardProps) {
  const [shift, setShift] = useState<"matutino" | "vespertino">("matutino")
  const [room, setRoom] = useState<string>(ROOMS[0])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showEarlyDepartureDialog, setShowEarlyDepartureDialog] = useState(false)
  const [calculatedHours, setCalculatedHours] = useState(0)

  const handleCheckIn = async () => {
    setLoading(true)
    setMessage(null)

    const result = await checkIn(room, shift)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Entrada registrada exitosamente" })
    }

    setLoading(false)
  }

  const handleCheckOut = async () => {
    if (!activeRecord) return

    // Calculate hours worked
    const checkInTime = new Date(activeRecord.check_in)
    const checkOutTime = new Date()
    const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

    // If less than 4 hours, show dialog
    if (hoursWorked < 4) {
      setCalculatedHours(hoursWorked)
      setShowEarlyDepartureDialog(true)
      return
    }

    // If 4 or more hours, proceed normally
    await performCheckOut()
  }

  const performCheckOut = async (earlyDepartureReason?: string) => {
    setLoading(true)
    setMessage(null)

    const result = await checkOut(earlyDepartureReason)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({
        type: "success",
        text: `Salida registrada. Trabajaste ${result.hoursWorked?.toFixed(2)} horas`,
      })
    }

    setLoading(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            Registro de Asistencia
          </CardTitle>
          <CardDescription>
            {activeRecord ? "Tienes una entrada activa" : "Registra tu entrada al turno"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeRecord ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-green-900">Entrada activa</p>
                <p className="text-xs text-green-700">
                  Hora de entrada: {format(new Date(activeRecord.check_in), "PPp", { locale: es })}
                </p>
                <p className="text-xs text-green-700">
                  Turno: {activeRecord.shift === "matutino" ? "Matutino (10:00 - 14:00)" : "Vespertino (14:00 - 18:00)"}
                </p>
                <p className="text-xs text-green-700">Sala: {activeRecord.room}</p>
              </div>
              <Button onClick={handleCheckOut} disabled={loading} className="w-full gap-2" variant="destructive">
                <LogOut className="h-4 w-4" />
                {loading ? "Registrando..." : "Registrar Salida"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room">Selecciona la sala</Label>
                <Select value={room} onValueChange={setRoom}>
                  <SelectTrigger id="room">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOMS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shift">Selecciona tu turno</Label>
                <Select value={shift} onValueChange={(value: any) => setShift(value)}>
                  <SelectTrigger id="shift">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matutino">Matutino (10:00 - 14:00)</SelectItem>
                    <SelectItem value="vespertino">Vespertino (14:00 - 18:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCheckIn} disabled={loading} className="w-full gap-2">
                <LogIn className="h-4 w-4" />
                {loading ? "Registrando..." : "Registrar Entrada"}
              </Button>
            </div>
          )}

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <EarlyDepartureDialog
        open={showEarlyDepartureDialog}
        onOpenChange={setShowEarlyDepartureDialog}
        hoursWorked={calculatedHours}
        onConfirm={performCheckOut}
      />
    </>
  )
}
