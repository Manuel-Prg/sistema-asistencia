// components/supervisor/active-students.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AttendanceTableProps {
  records: any[]
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-600" />
          Registros de Asistencia ({records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-sm">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Entrada</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Salida</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Turno</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Sala</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Horas</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-sm">{record.student.profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{record.student.profile.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(record.check_in), "dd/MM/yyyy", { locale: es })}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {format(new Date(record.check_in), "HH:mm", { locale: es })}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {record.check_out ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(record.check_out), "HH:mm", { locale: es })}
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        En curso
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{record.shift === "matutino" ? "Matutino" : "Vespertino"}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{record.room}</td>
                  <td className="py-3 px-4 text-right">
                    {record.hours_worked ? (
                      <span className="font-bold text-indigo-600">{record.hours_worked.toFixed(1)}h</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
