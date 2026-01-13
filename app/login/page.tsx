// app/login/page.tsx
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
import { ClipboardCheck, Users, Clock, Eye, EyeOff } from "lucide-react"
import type { ActiveStudent } from "@/lib/types/app"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchActiveStudents()

    // Refresh cada 30 segundos
    const interval = setInterval(() => {
      fetchActiveStudents()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchActiveStudents = async () => {
    try {
      setLoadingStudents(true)

      const response = await fetch("/api/active-students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        cache: "no-store",
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setActiveStudents([])
        return
      }

      const data = await response.json()

      if (response.ok) {
        setActiveStudents(data.activeStudents || [])
      } else {
        setActiveStudents([])
      }
    } catch (err) {
      setActiveStudents([])
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

      router.push("/")
      router.refresh()
    } catch (err: any) {
      // Traducir errores comunes de Supabase al español
      let errorMessage = "Error al iniciar sesión"

      if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Credenciales de inicio de sesión inválidas"
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Por favor confirma tu correo electrónico"
      } else if (err.message?.includes("Email rate limit exceeded")) {
        errorMessage = "Demasiados intentos. Por favor espera un momento"
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
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
          {/* Login Card */}
          <Card className="w-full shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                  <ClipboardCheck className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-base dark:text-gray-400">
                Ingresa tus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    autoComplete="given-name"
                    className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                      className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-900">
                    <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
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
              {loadingStudents ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : activeStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No hay estudiantes activos</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los estudiantes aparecerán aquí cuando hagan check-in
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {activeStudents.map((student) => (
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