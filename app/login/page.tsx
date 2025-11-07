"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClipboardCheck, School } from "lucide-react"
import { ActiveStudentsDisplay } from "@/components/login/active-students-display"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

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
      console.log("About to redirect to /")
      window.location.href = "/"
      
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Error al iniciar sesión")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Aquí puedes reemplazar el ícono con tu logo */}
              <Image 
              src="/logo/iconoFavicon.png" alt="Logo" 
              width={40}
               height={40} 
               />
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

          {/* Active Students Display */}
          <ActiveStudentsDisplay />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sistema de Asistencia. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}