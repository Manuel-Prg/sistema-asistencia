"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import useSWR from "swr"
import { differenceInMinutes } from "date-fns"

interface ActiveStudent {
  id: string
  student_name: string
  room: string
  shift: string
  check_in: string
}

const fetcher = async () => {
  const supabase = getSupabaseBrowserClient()

  console.log("🔍 Fetching active students...")

  // Get active attendance records (where check_out is null)
  const { data: records, error: recordsError } = await supabase
    .from("attendance_records")
    .select(`
      id,
      student_id,
      check_in,
      room,
      shift
    `)
    .is("check_out", null)
    .order("check_in", { ascending: false })

  console.log("📋 Attendance records:", records)
  console.log("❌ Records error:", recordsError)

  if (recordsError) {
    console.error("Error fetching attendance records:", recordsError)
    return []
  }

  if (!records || records.length === 0) {
    console.log("⚠️ No active attendance records found")
    return []
  }

  console.log(`✅ Found ${records.length} active attendance records`)

  // Get student profiles
  const studentIds = records.map((r: any) => r.student_id)
  
  console.log("👥 Student IDs to fetch:", studentIds)
  
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select(`
      id,
      profile:profiles(full_name)
    `)
    .in("id", studentIds)

  console.log("👤 Students data:", students)
  console.log("❌ Students error:", studentsError)

  if (studentsError) {
    console.error("Error fetching students:", studentsError)
    // If we can't get student names, still show the records
    return records.map((record: any) => ({
      id: record.id,
      student_name: "Cargando...",
      room: record.room,
      shift: record.shift,
      check_in: record.check_in,
    }))
  }

  // Create a map of student IDs to names
  const studentMap = new Map()
  students?.forEach((s: any) => {
    studentMap.set(s.id, s.profile?.full_name || "Desconocido")
  })

  console.log("🗺️ Student map:", Object.fromEntries(studentMap))

  // Combine the data
  const result = records.map((record: any) => ({
    id: record.id,
    student_name: studentMap.get(record.student_id) || "Desconocido",
    room: record.room,
    shift: record.shift,
    check_in: record.check_in,
  }))

  console.log("✅ Final result:", result)
  
  return result
}

export function ActiveStudentsDisplay() {
  const { data: activeStudents = [], isLoading, error } = useSWR<ActiveStudent[]>(
    "active-students",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
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
          <div className="space-y-3">
            {activeStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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