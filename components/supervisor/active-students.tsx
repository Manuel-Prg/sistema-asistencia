// components/supervisor/active-students.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Clock, AlertTriangle } from "lucide-react"
import { formatTime } from "@/lib/utils/date-formatter"
import { AdminCheckoutDialog } from "./admin-checkout-dialog"
import { AutoCloseButton } from "./auto-close-button"

interface ActiveStudentsProps {
  records: any[]
}

export function ActiveStudents({ records }: ActiveStudentsProps) {
  // Calcular estadísticas
  const longSessions = records.filter(r => {
    const checkIn = new Date(r.check_in)
    const now = new Date()
    const hours = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
    return hours > 10
  })

  const oldRecords = records.filter(r => {
    const checkIn = new Date(r.check_in)
    const now = new Date()
    const hours = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
    return hours > 24
  })

  if (records.length === 0) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl">Estudiantes Activos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8 sm:py-12">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              No hay estudiantes activos en este momento
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Los estudiantes aparecerán aquí cuando hagan check-in
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Title - Mobile stacks, Desktop inline */}
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shrink-0">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg lg:text-xl">Estudiantes Activos</span>
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({records.length})
              </span>
            </div>
          </CardTitle>
          
          {/* Auto-close buttons */}
          <div className="shrink-0">
            <AutoCloseButton 
              longSessions={longSessions.length}
              oldRecords={oldRecords.length}
            />
          </div>
        </div>

        {/* Warnings */}
        {(longSessions.length > 0 || oldRecords.length > 0) && (
          <div className="mt-3 space-y-2">
            {longSessions.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800">
                  <strong>{longSessions.length}</strong> {longSessions.length === 1 ? 'estudiante tiene' : 'estudiantes tienen'} más de 10 horas activas
                </p>
              </div>
            )}
            {oldRecords.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <p className="text-xs text-red-800">
                  <strong>{oldRecords.length}</strong> {oldRecords.length === 1 ? 'registro tiene' : 'registros tienen'} más de 24 horas sin cerrar
                </p>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
          {records.map((record) => {
            const checkIn = new Date(record.check_in)
            const now = new Date()
            const hoursElapsed = (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
            const isLongSession = hoursElapsed > 10
            const isVeryOld = hoursElapsed > 24

            return (
              <div
                key={record.id}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  isVeryOld
                    ? 'bg-red-50 border-red-300'
                    : isLongSession
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                {/* Header section */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {record.student.profile.full_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatTime(record.check_in)}
                      </span>
                      <span className="text-xs text-gray-500">📍 {record.room}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`shrink-0 text-xs ${
                      isVeryOld
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : isLongSession
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-green-100 text-green-700 border-green-300'
                    }`}
                  >
                    {record.shift === "matutino" ? "☀️" : "🌙"}
                    <span className="hidden sm:inline ml-1">
                      {record.shift === "matutino" ? "Matutino" : "Vespertino"}
                    </span>
                  </Badge>
                </div>

                {/* Hours indicator - Responsive layout */}
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg ${
                  isVeryOld
                    ? 'bg-red-100'
                    : isLongSession
                    ? 'bg-amber-100'
                    : 'bg-green-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 shrink-0 ${
                      isVeryOld
                        ? 'text-red-600'
                        : isLongSession
                        ? 'text-amber-600'
                        : 'text-green-600'
                    }`} />
                    <span className={`text-xs sm:text-sm font-bold ${
                      isVeryOld
                        ? 'text-red-900'
                        : isLongSession
                        ? 'text-amber-900'
                        : 'text-green-900'
                    }`}>
                      {hoursElapsed.toFixed(1)} hrs transcurridas
                    </span>
                  </div>

                  <AdminCheckoutDialog record={record} />
                </div>

                {/* Warning messages */}
                {isLongSession && (
                  <p className="text-xs text-amber-700 mt-2 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span>Máximo 10 horas al cerrar</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}