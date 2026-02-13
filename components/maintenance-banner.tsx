"use client"

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MaintenanceBanner() {
    // Inicializamos en true para asegurar que se muestre, pero controlamos la hidratación
    const [isDown, setIsDown] = useState(false)
    const [lastCheck, setLastCheck] = useState<Date | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        setLastCheck(new Date())

        const checkSupabaseStatus = async () => {
            try {
                const response = await fetch('https://status.supabase.com/api/v2/status.json', {
                    cache: 'no-store'
                })
                const data = await response.json()

                // Solo ocultamos si explícitamente dice "none"
                // indicator values: none, minor, major, critical
                setIsDown(data.status.indicator !== 'none')

                setLastCheck(new Date())
            } catch {
                // Ante cualquier error de red (como el bug 500 actual), asumimos CAÍDO
                setIsDown(true)
            }
        }

        // Verificar inmediatamente
        checkSupabaseStatus()

        // Verificar cada 2 minutos
        const interval = setInterval(checkSupabaseStatus, 120000)

        return () => clearInterval(interval)
    }, [])

    const [isDismissed, setIsDismissed] = useState(false)

    // ... (keep useEffect logic) ...

    // Evitar renderizado en servidor para prevenir error de hidratación
    if (!isMounted) return null

    if (!isDown || isDismissed) return null

    return (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-5 duration-500 max-w-sm w-full">
            <div className="bg-orange-50 dark:bg-orange-950/90 backdrop-blur-md border border-orange-200 dark:border-orange-800 rounded-lg shadow-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        Servicio Intermitente
                    </h3>
                    <p className="text-orange-800 dark:text-orange-200/90 leading-relaxed mb-3">
                        Proveedor de base de datos reporta fallas. Es posible que experimentes errores al iniciar sesión.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.location.reload()}
                            className="h-8 px-2 text-orange-700 hover:text-orange-800 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/50 -ml-2"
                        >
                            <RefreshCw className="h-3 w-3 mr-1.5" />
                            Reintentar
                        </Button>
                        <a
                            href="https://status.supabase.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-orange-700 dark:text-orange-400 hover:underline"
                        >
                            Ver estatus
                        </a>
                    </div>
                </div>
                <button
                    onClick={() => setIsDismissed(true)}
                    className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-200 transition-colors"
                >
                    <span className="sr-only">Cerrar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    )
}
