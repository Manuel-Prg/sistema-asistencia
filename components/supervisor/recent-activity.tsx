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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay actividad reciente
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-600" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{record.student.profile.full_name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(record.check_in)} - {formatTime(record.check_out)}
                  </span>
                  <span>📍 {record.room}</span>
                </div>
              </div>
              <div className="text-right space-y-1 ml-3">
                <p className="text-lg font-bold text-indigo-600">{record.hours_worked.toFixed(1)}h</p>
                <Badge variant="outline" className="text-xs">
                  {record.shift === "matutino" ? "☀️ Matutino" : "🌙 Vespertino"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}