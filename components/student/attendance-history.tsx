import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Sun, Moon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { AttendanceHistoryProps } from "@/lib/types/student"
import { getMexicoCityTime } from "@/lib/utils"

export function AttendanceHistory({ records }: AttendanceHistoryProps) {
  if (records.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            Historial de Asistencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
              No hay registros de asistencia aún
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Tus registros aparecerán aquí cuando hagas check-in
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            Historial de Asistencias
          </CardTitle>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            {records.length} {records.length === 1 ? "registro" : "registros"}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {records.map((record, index) => {
            const isActive = !record.check_out
            const shiftIcon = record.shift === "matutino" ? Sun : Moon

            return (
              <div
                key={record.id}
                className="group relative overflow-hidden p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-200"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100/30 dark:bg-indigo-900/20 rounded-full -mr-10 -mt-10 group-hover:bg-indigo-200/40 dark:group-hover:bg-indigo-800/30 transition-colors" />

                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  {/* Left Section - Date and Details */}
                  <div className="flex-1 space-y-2 sm:space-y-2.5">
                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                      <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white capitalize">
                        {format(getMexicoCityTime(record.check_in), "EEEE, d 'de' MMMM", { locale: es })}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                      {/* Time */}
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">
                          {format(getMexicoCityTime(record.check_in), "HH:mm", { locale: es })}
                          {record.check_out && (
                            <> - {format(getMexicoCityTime(record.check_out), "HH:mm", { locale: es })}</>
                          )}
                        </span>
                      </div>

                      {/* Shift */}
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        {ShiftIcon({ icon: shiftIcon })}
                        <span className="capitalize truncate">
                          {record.shift === "matutino" ? "Matutino" : "Vespertino"}
                        </span>
                      </div>

                      {/* Room */}
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{record.room}</span>
                      </div>
                    </div>

                    {/* Early Departure Reason */}
                    {record.early_departure_reason && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          <span className="font-semibold">Salida temprana:</span> {record.early_departure_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Hours */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 sm:pl-4">
                    {!isActive ? (
                      <>
                        <div className="flex sm:flex-col items-baseline sm:items-end gap-1">
                          <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {record.hours_worked?.toFixed(1) || '0.0'}
                          </p>
                          <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">horas</span>
                        </div>
                        {(record.hours_worked || 0) >= 4 ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Completo</span>
                        ) : (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠ Incompleto</span>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-full">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">En curso</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Helper component for shift icon
function ShiftIcon({ icon: Icon }: { icon: any }) {
  return <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
}