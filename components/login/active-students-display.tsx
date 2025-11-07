// components/login/active-students-display.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import useSWR from "swr"
import { differenceInMinutes } from "date-fns"

interface ActiveStudent {
  id: string
  student_name: string
  room: string
  shift: string
  check_in: string
}

// Fetcher que usa la API route en lugar de Supabase directamente
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
    },
  })
  
  if (!response.ok) {
    throw new Error('Error al cargar estudiantes activos')
  }
  
  return response.json()
}

export function ActiveStudentsDisplay() {
  const { data: activeStudents = [], isLoading, error } = useSWR<ActiveStudent[]>(
    '/api/active-students',
    fetcher,
    {
      refreshInterval: 30000, // Actualizar cada 30 segundos
      revalidateOnFocus: true,
      dedupingInterval: 10000, // Evitar duplicar requests
    }
  )

  const calculateHoursWorked = (checkIn: string) => {
    const now = new Date()
    const checkInDate = new Date(checkIn)
    const minutes = differenceInMinutes(now, checkInDate)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  const getShiftLabel = (shift: string) => {
    return shift === "matutino" ? "Matutino" : "Vespertino"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <CardTitle className="text-xl">Estudiantes Activos</CardTitle>
        </div>
        <CardDescription>
          Estudiantes actualmente en turno
          {activeStudents.length > 0 && ` (${activeStudents.length})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error al cargar estudiantes activos
          </div>
        ) : activeStudents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay estudiantes activos en este momento
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activeStudents.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{student.student_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {student.room}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getShiftLabel(student.shift)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-indigo-600">
                  <Clock className="h-4 w-4" />
                  {calculateHoursWorked(student.check_in)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}