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
import { Lock, Check, Eye, EyeOff, Loader2 } from "lucide-react"
import { validatePasswordStrength } from "@/lib/password-utils"
import { isPasswordCompromised } from "@/app/actions/check-pwned"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()
    const supabase = getSupabaseBrowserClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden")
            return
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres")
            return
        }

        const validation = validatePasswordStrength(password)
        if (!validation.isValid) {
            setError(validation.errors[0])
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Check against HIBP
            const isCompromised = await isPasswordCompromised(password)
            if (isCompromised) {
                setError("Esta contraseña ha aparecido en filtraciones de datos conocidas. Por favor, elige una más segura.")
                setLoading(false)
                return
            }

            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) {
                throw error
            }

            // Redirect to home or login with success message
            // We'll redirect to home as they are logged in, but maybe force a re-login or show a toast?
            // For simplicity, redirect to home which is the dashboard.
            router.push("/")
            router.refresh()

        } catch (err: any) {
            setError(err.message || "Error al actualizar la contraseña")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center space-x-3">
                        <Image src="/logo/iconoFavicon.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sistema de Asistencia</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Seguridad de la cuenta</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                                <Lock className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Restablecer Contraseña
                        </CardTitle>
                        <CardDescription className="text-base dark:text-gray-400">
                            Ingresa tu nueva contraseña segura.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nueva Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
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
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    La contraseña debe tener al menos 8 caracteres y no ser de uso común.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmar Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Repite la contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 pr-10"
                                    />
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
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </span>
                                ) : (
                                    "Actualizar contraseña"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Casa Universitaria del Agua
                    </p>
                </div>
            </footer>
        </div>
    )
}
