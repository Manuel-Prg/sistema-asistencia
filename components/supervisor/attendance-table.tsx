// components/supervisor/attendance-table.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { formatDateTime } from "@/lib/utils/date-formatter"

interface AttendanceRecord {
  id: string
  check_in: string
  check_out: string | null
  room: string
  shift: string
  hours_worked: number | null
  early_departure_reason: string | null
  student: {
    profile: {
      full_name: string
    }
  }
}

interface AttendanceTableProps {
  records: AttendanceRecord[]
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const getShiftBadge = (shift: string) => {
    if (shift === "vespertino") {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0 shadow-sm text-xs">
          🌙 Vespertino
        </Badge>
      )
    }
    return (
      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-sm text-xs">
        ☀️ Matutino
      </Badge>
    )
  }

  const getStatusBadge = (checkOut: string | null) => {
    if (!checkOut) {
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm animate-pulse">
          ● Activo
        </Badge>
      )
    }
    return (
      <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
        ✓ Completado
      </Badge>
    )
  }

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-lg sm:text-xl text-gray-800">Registros de Asistencia</span>
          <span className="ml-auto text-sm font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
            {records.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-semibold">
                No hay registros de asistencia
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Los registros aparecerán aquí cuando los estudiantes hagan check-in
              </p>
            </div>
          ) : (
            records.map((record) => {
              const checkIn = formatDateTime(record.check_in)
              const checkOut = record.check_out ? formatDateTime(record.check_out) : null

              return (
                <div
                  key={record.id}
                  className="group p-4 sm:p-5 bg-gradient-to-r from-white to-slate-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                >
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shrink-0">
                        {record.student.profile.full_name.charAt(0)}
                      </div>
                      
                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                          {record.student.profile.full_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {getShiftBadge(record.shift)}
                          {getStatusBadge(record.check_out)}
                        </div>
                      </div>
                    </div>

                    {/* Hours Display */}
                    {record.hours_worked !== null && (
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shrink-0">
                        <p className="text-2xl sm:text-3xl font-bold">
                          {record.hours_worked.toFixed(1)}h
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
                    {/* Check In */}
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Entrada</p>
                        <p className="text-sm font-bold text-gray-800">{checkIn.time}</p>
                        <p className="text-xs text-gray-600">{checkIn.date}</p>
                      </div>
                    </div>

                    {/* Check Out */}
                    <div className="flex items-start gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        checkOut ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <svg className={`h-4 w-4 ${checkOut ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Salida</p>
                        {checkOut ? (
                          <>
                            <p className="text-sm font-bold text-gray-800">{checkOut.time}</p>
                            <p className="text-xs text-gray-600">{checkOut.date}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 italic">En progreso...</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Room Info */}
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">{record.room}</span>
                  </div>

                  {/* Early Departure Reason */}
                  {record.early_departure_reason && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-yellow-800">Salida temprana</p>
                          <p className="text-sm text-yellow-700 mt-1">{record.early_departure_reason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}