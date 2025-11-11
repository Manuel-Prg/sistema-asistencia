// components/supervisor/students-table.tsx
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

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg sm:text-xl">Todos los Estudiantes</span>
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({students.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {students.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
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

              return (
                <div
                  key={student.id}
                  className="group p-3 sm:p-4 bg-gradient-to-r from-white to-slate-50 rounded-xl border border-gray-200 space-y-3 hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                >
                  {/* Header con horas destacadas */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Student info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {student.profile.full_name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                          {student.profile.email}
                        </p>
                      </div>
                      
                      {/* Badges - Responsive */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getShiftLabel(student.student_type)}
                        </Badge>
                        {student.assigned_room ? (
                          <Badge variant="secondary" className="text-xs">
                            📍 {student.assigned_room}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="opacity-50 text-xs">
                            Por asignar
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Right: Hours display */}
                    <div className="shrink-0 text-right">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-lg">
                        <p className="text-xl sm:text-2xl font-bold leading-none">
                          {student.accumulated_hours.toFixed(1)}
                        </p>
                        <p className="text-[10px] sm:text-xs opacity-90 mt-0.5">
                          de {student.required_hours}h
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 font-medium">Progreso</span>
                      <span className="font-bold text-indigo-600">{progress.toFixed(1)}%</span>
                    </div>
                    
                    {/* Progress bar */}
                    <Progress 
                      value={progress} 
                      className="h-2 sm:h-2.5"
                    />
                    
                    {/* Remaining hours */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Faltan {remaining.toFixed(1)} horas</span>
                      {progress >= 100 && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          ✓ Completado
                        </span>
                      )}
                      {progress >= 75 && progress < 100 && (
                        <span className="text-amber-600 font-semibold">
                          🎯 Casi listo
                        </span>
                      )}
                    </div>
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