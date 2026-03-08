"use client"

import type React from "react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { showError } from "@/lib/toast-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { loginAction } from "./actions"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    // useSearchParams is safe here because this component is wrapped in <Suspense> by the parent
    const searchParams = useSearchParams()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append("email", email)
        formData.append("password", password)

        try {
            const result = await loginAction(formData)

            if (result?.error) {
                showError(result.error)
                setLoading(false)
            } else if (result?.redirectUrl) {
                // Success! Navigate to dashboard — keep loading=true while navigating
                window.location.href = result.redirectUrl
            }
        } catch (err: any) {
            console.error("Login action error:", err)

            let msg = "Error de conexión al intentar iniciar sesión."
            if (err.message && err.message.includes("Unexpected token")) {
                msg = "Error crítico del servidor (500/504). El servicio de base de datos podría estar caído o pausado."
            }

            showError(msg)
            setLoading(false)
        }
    }

    return (
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
                            autoComplete="email"
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
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

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
    )
}
