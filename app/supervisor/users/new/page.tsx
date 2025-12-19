"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserPlus, Mail, Lock, User, Users, Clock } from "lucide-react"
import Link from "next/link"
import { createNewUser } from "./action"

export default function NewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as "student" | "supervisor",
    studentType: "servicio_social" as "servicio_social" | "practicas",
    requiredHours: 360,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createNewUser(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      setSuccess(true)
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "student",
        studentType: "servicio_social",
        requiredHours: 360,
      })

      setTimeout(() => {
        router.push("/supervisor/students")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Error al crear usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-5"></div>
          <div className="relative p-6 sm:p-8">
            <Link href="/supervisor/students">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-white dark:hover:bg-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
            </Link>
            <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Crear Nuevo Usuario
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium">
              Agrega un nuevo estudiante o supervisor al sistema
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-3xl mx-auto border-0 shadow-xl overflow-hidden dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-900">
            <CardTitle className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <UserPlus className="h-5 w-5" />
              </div>
              <span className="text-xl sm:text-2xl text-gray-800 dark:text-white">Información del Usuario</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2 dark:text-gray-400">
              Completa todos los campos para crear una nueva cuenta
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="Juan Pérez García"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="usuario@ejemplo.com"
                    className="h-11 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  className="h-11 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  La contraseña debe tener al menos 8 caracteres.
                </p>
              </div>

              {/* Role Selection - Cards */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Tipo de usuario
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "student" })}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all ${formData.role === "student"
                      ? "border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${formData.role === "student"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        }`}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 dark:text-white">Estudiante</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Servicio social o prácticas</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "supervisor" })}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all ${formData.role === "supervisor"
                      ? "border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 shadow-md"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${formData.role === "supervisor"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        }`}>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 dark:text-white">Supervisor</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Administrador del sistema</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Student Fields */}
              {formData.role === "student" && (
                <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Información del Estudiante
                  </h3>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de estudiante</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, studentType: "servicio_social", requiredHours: 360 })}
                        disabled={loading}
                        className={`p-4 rounded-xl border-2 transition-all ${formData.studentType === "servicio_social"
                          ? "border-blue-600 bg-white dark:bg-gray-800 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
                          }`}
                      >
                        <p className="font-semibold text-gray-800 dark:text-white">Servicio Social</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">360 horas requeridas</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, studentType: "practicas", requiredHours: 480 })}
                        disabled={loading}
                        className={`p-4 rounded-xl border-2 transition-all ${formData.studentType === "practicas"
                          ? "border-blue-600 bg-white dark:bg-gray-800 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
                          }`}
                      >
                        <p className="font-semibold text-gray-800 dark:text-white">Prácticas Profesionales</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">480 horas requeridas</p>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requiredHours" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Horas requeridas (personalizar)
                    </Label>
                    <Input
                      id="requiredHours"
                      type="number"
                      value={formData.requiredHours}
                      onChange={(e) => setFormData({ ...formData, requiredHours: parseInt(e.target.value) })}
                      required
                      disabled={loading}
                      min={1}
                      className="h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Alerts */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                  <AlertDescription className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 text-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                  <AlertDescription className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Usuario creado exitosamente. Redirigiendo...
                  </AlertDescription>
                </Alert>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando usuario...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Crear usuario
                    </>
                  )}
                </Button>
                <Link href="/supervisor/students">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="w-full sm:w-auto h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-base font-semibold"
                  >
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}