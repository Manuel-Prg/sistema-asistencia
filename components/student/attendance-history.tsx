// components/student/attendance-history.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { AttendanceRecord } from "@/lib/supabase/types"

interface AttendanceHistoryProps {
  records: AttendanceRecord[]
}

export function AttendanceHistory({ records }: AttendanceHistoryProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Historial de Asistencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No hay registros de asistencia aún</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          Historial de Asistencias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {format(new Date(record.check_in), "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(record.check_in), "HH:mm", { locale: es })}
                    {record.check_out && ` - ${format(new Date(record.check_out), "HH:mm", { locale: es })}`}
                  </span>
                  <span className="capitalize">{record.shift === "matutino" ? "Matutino" : "Vespertino"}</span>
                  <span>{record.room}</span>
                </div>
              </div>
              <div className="text-right">
                {record.hours_worked ? (
                  <p className="text-lg font-bold text-indigo-600">{record.hours_worked.toFixed(1)}h</p>
                ) : (
                  <p className="text-sm text-yellow-600 font-medium">En curso</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
