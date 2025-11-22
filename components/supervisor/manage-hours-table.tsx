"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus, Minus, History, AlertCircle } from "lucide-react"
import { adjustStudentHours } from "@/app/supervisor/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface Student {
  id: string
  accumulated_hours: number
  profile: {
    full_name: string
  }
}

interface ManageHoursTableProps {
  students: Student[]
}

export function ManageHoursTable({ students }: ManageHoursTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add")
  const [hours, setHours] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase()
    return student.profile.full_name.toLowerCase().includes(searchLower)
  })

  const handleOpenDialog = (student: Student, type: "add" | "subtract") => {
    setSelectedStudent(student)
    setAdjustmentType(type)
    setHours("")
    setReason("")
    setError("")
    setSuccessMessage("")
  }

  const handleCloseDialog = () => {
    setSelectedStudent(null)
    setHours("")
    setReason("")
    setError("")
    setSuccessMessage("")
  }

  const handleSubmit = async () => {
    if (!selectedStudent) return

    // Validaciones
    const hoursNum = parseFloat(hours)
    if (isNaN(hoursNum) || hoursNum <= 0) {
      setError("Por favor ingresa un número válido de horas mayor a 0")
      return
    }

    if (hoursNum > 100) {
      setError("El ajuste no puede ser mayor a 100 horas")
      return
    }

    if (!reason.trim()) {
      setError("Por favor proporciona una razón para el ajuste")
      return
    }

    if (reason.trim().length < 10) {
      setError("La razón debe tener al menos 10 caracteres")
      return
    }

    // Verificar que no se reste más de lo que tiene
    if (adjustmentType === "subtract") {
      if (hoursNum > selectedStudent.accumulated_hours) {
        setError(
          `No se pueden restar ${hoursNum}h. El estudiante solo tiene ${selectedStudent.accumulated_hours.toFixed(1)}h acumuladas`
        )
        return
      }
    }

    setIsSubmitting(true)
    setError("")
    setSuccessMessage("")

    try {
      const hoursToAdjust = adjustmentType === "subtract" ? -hoursNum : hoursNum

      console.log(`📤 Submitting adjustment: ${adjustmentType === "add" ? "+" : ""}${hoursToAdjust}h for ${selectedStudent.profile.full_name}`)

      const result = await adjustStudentHours(
        selectedStudent.id,
        hoursToAdjust,
        reason.trim()
      )

      if (result.success) {
        console.log('✅ Adjustment successful, reloading page...')
        setSuccessMessage("✅ Ajuste realizado correctamente. Recargando datos...")

        // Esperar 2 segundos para asegurar que se guardó
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        console.error('❌ Adjustment failed:', result.error)
        setError(result.error || "Error al realizar el ajuste")
      }
    } catch (err: any) {
      console.error('❌ Adjustment exception:', err)
      setError(`Error: ${err.message || "Error al procesar la solicitud"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estudiantes ({filteredStudents.length})</CardTitle>
            <Link href="/supervisor/manage-hours/history">
              <Button variant="outline" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                Ver Historial
              </Button>
            </Link>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron estudiantes</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {student.profile.full_name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Horas acumuladas:{" "}
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {student.accumulated_hours.toFixed(1)}h
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 border-green-200 dark:border-green-800"
                      onClick={() => handleOpenDialog(student, "add")}
                    >
                      <Plus className="h-4 w-4" />
                      Sumar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800"
                      onClick={() => handleOpenDialog(student, "subtract")}
                      disabled={student.accumulated_hours <= 0}
                    >
                      <Minus className="h-4 w-4" />
                      Restar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={selectedStudent !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === "add" ? "Sumar Horas" : "Restar Horas"}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent && (
                <>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedStudent.profile.full_name}
                  </span>
                  <br />
                  <span className="text-sm">
                    Horas actuales:{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedStudent.accumulated_hours.toFixed(1)}h
                    </span>
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="hours">
                Horas a {adjustmentType === "add" ? "sumar" : "restar"}
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="100"
                placeholder="Ej: 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Razón del ajuste *</Label>
              <Textarea
                id="reason"
                placeholder="Describe el motivo del ajuste (mínimo 10 caracteres)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {reason.length}/10 caracteres mínimo
              </p>
            </div>

            {hours && !isNaN(parseFloat(hours)) && parseFloat(hours) > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Horas después del ajuste:{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {selectedStudent &&
                      (
                        selectedStudent.accumulated_hours +
                        (adjustmentType === "add" ? 1 : -1) * parseFloat(hours)
                      ).toFixed(1)}
                    h
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={
                adjustmentType === "add"
                  ? "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              }
            >
              {isSubmitting ? "Procesando..." : "Confirmar Ajuste"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}