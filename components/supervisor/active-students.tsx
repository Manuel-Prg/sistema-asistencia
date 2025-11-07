// components/supervisor/active-students.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ActiveStudentsProps {
  records: any[]
}

export function ActiveStudents({ records }: ActiveStudentsProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            Estudiantes Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No hay estudiantes activos en este momento</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-green-600" />
          Estudiantes Activos ({records.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="space-y-1">
                <p className="font-medium text-sm">{record.student.profile.full_name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Entrada: {format(new Date(record.check_in), "HH:mm", { locale: es })}
                  </span>
                  <span>{record.room}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                {record.shift === "matutino" ? "Matutino" : "Vespertino"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
