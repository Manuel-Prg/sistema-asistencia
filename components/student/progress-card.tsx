import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Award, Target, TrendingUp } from "lucide-react"
import type { ProgressCardProps } from "@/lib/types/student"


export function ProgressCard({ accumulatedHours, requiredHours, studentType }: ProgressCardProps) {
  const percentage = Math.min((accumulatedHours / requiredHours) * 100, 100)
  const remainingHours = Math.max(requiredHours - accumulatedHours, 0)
  const isComplete = percentage >= 100

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          Tu Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        {/* Main Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Horas completadas</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {accumulatedHours.toFixed(1)}
              </span>
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">
                / {requiredHours}
              </span>
            </div>
          </div>

          {/* Progress Bar with Gradient */}
          <div className="relative">
            <Progress
              value={percentage}
              className="h-3 sm:h-4 bg-gray-100 dark:bg-gray-800"
            />
            {isComplete && (
              <div className="absolute -top-1 -right-1 animate-bounce">
                <div className="p-1 bg-emerald-500 rounded-full">
                  <Award className="h-3 w-3 text-white" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% completado</span>
            {isComplete ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Award className="h-4 w-4" />
                ¡Completado!
              </span>
            ) : (
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {(100 - percentage).toFixed(1)}% restante
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Remaining Hours */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Por completar</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {remainingHours.toFixed(1)}
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-normal ml-1">hrs</span>
            </p>
          </div>

          {/* Progress Trend */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900 rounded-xl">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">Avance</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {percentage.toFixed(0)}
              <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-normal ml-1">%</span>
            </p>
          </div>
        </div>

        {/* Student Type Badge */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tipo de programa</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {studentType === "servicio_social" ? "Servicio Social" : "Prácticas Profesionales"}
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        {!isComplete && percentage > 75 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 text-center font-medium">
              🎯 ¡Casi lo logras! Solo te faltan {remainingHours.toFixed(1)} horas
            </p>
          </div>
        )}

        {isComplete && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 text-center font-medium">
              🎉 ¡Felicidades! Has completado todas tus horas requeridas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}