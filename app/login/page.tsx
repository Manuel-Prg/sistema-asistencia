import { Suspense } from "react"
import { createClient } from "@supabase/supabase-js"
import LoginForm from "./login-form"
import type { ActiveStudent } from "@/lib/types/app"
import { Users, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

async function getActiveStudents(): Promise<ActiveStudent[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return []
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { data } = await supabase
      .from("attendance_records")
      .select(`id, check_in, shift, room, student:students!inner(profile:profiles!inner(full_name))`)
      .is("check_out", null)
      .order("check_in", { ascending: false })

    return (
      data?.map((r: any) => ({
        id: r.id,
        studentName: r.student?.profile?.full_name ?? "Sin nombre",
        checkIn: r.check_in,
        shift: r.shift,
        room: r.room,
      })) ?? []
    )
  } catch {
    return []
  }
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ActiveStudentsPanel({ students }: { students: ActiveStudent[] }) {
  return (
    <Card className="w-full shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Estudiantes Activos
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Estudiantes actualmente en turno</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {students.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No hay estudiantes activos</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Los estudiantes aparecerán aquí cuando hagan check-in
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{student.studentName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" />
                      {formatTime(student.checkIn)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{student.shift}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">• {student.room}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default async function LoginPage() {
  const activeStudents = await getActiveStudents()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/logo/iconoFavicon.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sistema de Asistencia</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestión escolar integral</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bienvenido</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Accede con tus credenciales</p>
                </div>
                <Image src="/logo/logo_remove_background.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form (Client Component, needs Suspense for useSearchParams) */}
          <Suspense fallback={
            <div className="w-full shadow-xl border-0 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center min-h-64">
              <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <LoginForm />
          </Suspense>

          {/* Active Students Panel (Server Component, data fetched server-side) */}
          <ActiveStudentsPanel students={activeStudents} />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Casa Universitaria del Agua, Sistema de Asistencia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}