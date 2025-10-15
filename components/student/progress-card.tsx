import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Award } from "lucide-react"

interface ProgressCardProps {
  accumulatedHours: number
  requiredHours: number
  studentType: "servicio_social" | "practicas"
}

export function ProgressCard({ accumulatedHours, requiredHours, studentType }: ProgressCardProps) {
  const percentage = Math.min((accumulatedHours / requiredHours) * 100, 100)
  const remainingHours = Math.max(requiredHours - accumulatedHours, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-600" />
          Tu Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Horas completadas</span>
            <span className="font-bold text-lg">
              {accumulatedHours.toFixed(1)} / {requiredHours}
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">{percentage.toFixed(1)}% completado</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Horas restantes</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{remainingHours.toFixed(1)}</p>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Tipo:{" "}
            <span className="font-medium text-foreground">
              {studentType === "servicio_social" ? "Servicio Social" : "Prácticas Profesionales"}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
