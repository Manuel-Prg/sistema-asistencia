"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardCheck, Users, Clock } from "lucide-react"

interface ActiveStudent {
  id: string
  studentName: string
  checkIn: string
  shift: string
  room: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // Cargar estudiantes activos al montar el componente
  useEffect(() => {
    fetchActiveStudents()
  }, [])

  const fetchActiveStudents = async () => {
    try {
      setLoadingStudents(true)
      console.log("🔍 Fetching active students...")
      
      const response = await fetch("/api/active-students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      const text = await response.text()
      console.log("📄 Response text:", text)

      let data
      try {
        data = JSON.parse(text)
        console.log("✅ Parsed data:", data)
      } catch (parseError) {
        console.error("❌ Failed to parse JSON:", parseError)
        console.error("📄 Raw response:", text)
        return
      }

      if (response.ok) {
        console.log(`✅ Found ${data.activeStudents?.length || 0} active students`)
        setActiveStudents(data.activeStudents || [])
      } else {
        console.error("❌ Error fetching active students:", data.error)
      }
    } catch (err) {
      console.error("❌ Failed to fetch active students:", err)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      console.log("Login successful, redirecting...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      window.location.href = "/"
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Error al iniciar sesión")
      setLoading(false)
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/logo/iconoFavicon.png" alt="Logo" width={40} height={40} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Asistencia</h1>
                <p className="text-sm text-gray-500">Gestión escolar integral</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Bienvenido</p>
                <p className="text-xs text-gray-500">Accede con tus credenciales</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Card */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                  <ClipboardCheck className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-base">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-300 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Iniciando sesión...
                    </span>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Students Card */}
          <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Estudiantes Activos
                  </CardTitle>
                  <CardDescription>Estudiantes actualmente en turno</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No hay estudiantes activos</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Los estudiantes aparecerán aquí cuando hagan check-in
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {activeStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{student.studentName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                            <Clock className="h-3 w-3" />
                            {formatTime(student.checkIn)}
                          </span>
                          <span className="text-xs text-gray-600 capitalize">{student.shift}</span>
                          <span className="text-xs text-gray-500">• {student.room}</span>
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
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Casa Universitaria del Agua, Sistema de Asistencia. Todos los derechos reservados. 
          </p>
        </div>
      </footer>
    </div>
  )
}