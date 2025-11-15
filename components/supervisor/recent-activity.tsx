// components/supervisor/recent-activity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Clock } from "lucide-react"
import { formatTime } from "@/lib/utils/date-formatter"

interface RecentActivityProps {
  records: any[]
}

export function RecentActivity({ records }: RecentActivityProps) {
  if (records.length === 0) {
    return (
      <Card className="border-0 shadow-xl dark:bg-gray-900">
        <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-900">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <History className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl dark:text-white">Actividad Reciente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-8">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <History className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              No hay actividad reciente
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Las salidas recientes aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl dark:bg-gray-900">
      <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-900">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shrink-0">
            <History className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <span className="text-base sm:text-lg lg:text-xl dark:text-white">Actividad Reciente</span>
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({records.length})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-2 sm:space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
          {records.map((record) => (
            <div
              key={record.id}
              className="group p-3 sm:p-3.5 bg-gradient-to-r from-white to-slate-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200"
            >
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                {/* Left section: Student info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-sm sm:text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors dark:text-white">
                    {record.student.profile.full_name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {formatTime(record.check_in)} - {formatTime(record.check_out)}
                      </span>
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">•</span>
                    <span className="truncate">📍 {record.room}</span>
                  </div>
                </div>

                {/* Right section: Hours and badge */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  {/* Hours display */}
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-md">
                      <p className="text-base sm:text-lg font-bold leading-none">
                        {record.hours_worked.toFixed(1)}
                      </p>
                      <p className="text-[10px] opacity-90">horas</p>
                    </div>
                  </div>

                  {/* Shift badge */}
                  <Badge variant="outline" className="text-xs shrink-0">
                    {record.shift === "matutino" ? "☀️" : "🌙"}
                    <span className="hidden sm:inline ml-1">
                      {record.shift === "matutino" ? "Matutino" : "Vespertino"}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}