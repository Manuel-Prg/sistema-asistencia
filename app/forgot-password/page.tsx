"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = getSupabaseBrowserClient()

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            })

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "Error al solicitar la recuperación de contraseña")
        } finally {
            setLoading(false)
        }
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">Recuperación de cuenta</p>
                            </div>
                        </div>
                        <Link
                            href="/login"
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <CardHeader className="space-y-1 text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                                <Mail className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Recuperar Contraseña
                        </CardTitle>
                        <CardDescription className="text-base dark:text-gray-400">
                            Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        {success ? (
                            <div className="space-y-6 text-center animate-in fade-in zoom-in duration-300">
                                <div className="flex justify-center">
                                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">¡Correo enviado!</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada (y spam).
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => setSuccess(false)}
                                >
                                    Intentar con otro correo
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-5">
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
                                        className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
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
                                            Enviando...
                                        </span>
                                    ) : (
                                        "Enviar enlace de recuperación"
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <Link href="/login" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Cancelar y volver al inicio
                                    </Link>
                                </div>
                            </form>
                        )}
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
