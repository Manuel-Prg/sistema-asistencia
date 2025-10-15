import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users } from "lucide-react"

interface StudentsTableProps {
  students: any[]
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          Todos los Estudiantes ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => {
            const progress = (student.accumulated_hours / student.required_hours) * 100
            const remaining = Math.max(student.required_hours - student.accumulated_hours, 0)

            return (
              <div key={student.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{student.profile.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{student.profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {student.student_type === "servicio_social" ? "Servicio Social" : "Prácticas"}
                      </Badge>
                      <Badge variant="secondary">{student.assigned_room}</Badge>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-2xl font-bold text-indigo-600">{student.accumulated_hours.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">de {student.required_hours}h</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">Faltan {remaining.toFixed(1)} horas</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
