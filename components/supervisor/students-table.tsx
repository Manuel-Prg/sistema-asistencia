import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users } from "lucide-react"

interface Student {
  id: string
  student_type: string
  required_hours: number
  accumulated_hours: number
  assigned_room: string | null
  profile: {
    full_name: string
    email: string
  }
}

interface StudentsTableProps {
  students: Student[]
}

export function StudentsTable({ students }: StudentsTableProps) {
  const getShiftLabel = (type: string) => {
    return type === "servicio_social" ? "Servicio Social" : "Prácticas"
  }

  const calculateProgress = (accumulated: number, required: number) => {
    if (required === 0) return 0
    return Math.min((accumulated / required) * 100, 100)
  }

  const getProgressVariant = (progress: number): "default" | "destructive" => {
    if (progress >= 50) return "default"
    return "destructive"
  }

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
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No hay estudiantes registrados</p>
              <p className="text-sm text-gray-400 mt-1">
                Agrega un nuevo usuario para comenzar
              </p>
            </div>
          ) : (
            students.map((student) => {
              const progress = calculateProgress(
                student.accumulated_hours,
                student.required_hours
              )
              const remaining = Math.max(
                student.required_hours - student.accumulated_hours,
                0
              )
              const progressVariant = getProgressVariant(progress)

              return (
                <div
                  key={student.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {student.profile.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.profile.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">
                          {getShiftLabel(student.student_type)}
                        </Badge>
                        {student.assigned_room ? (
                          <Badge variant="secondary">{student.assigned_room}</Badge>
                        ) : (
                          <Badge variant="secondary" className="opacity-50">
                            Por asignar
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-bold text-indigo-600">
                        {student.accumulated_hours.toFixed(1)}h
                      </p>
                      <p className="text-xs text-muted-foreground">
                        de {student.required_hours}h
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Faltan {remaining.toFixed(1)} horas
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}