"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export function FreedomCelebration() {
    const [show, setShow] = useState(true)

    useEffect(() => {
        // Trigger confetti immediately and repeatedly
        triggerConfetti()

        // No auto-hide, user must close manually
    }, [])

    const triggerConfetti = () => {
        const duration = 15000 // Run for 15 seconds
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 150 } // z-150: Above backdrop, below text

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        }, 250)
    }

    if (!show) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-start sm:justify-center pt-48 sm:pt-0 bg-black/90 backdrop-blur-sm">
            <div className="relative p-8 sm:p-12 flex flex-col items-center gap-6 max-w-lg w-full mx-4 text-center z-[200]">

                {/* Text - No icons, just massive text */}
                <div className="space-y-4 relative">
                    <h2 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        ¡POR FIN ERES LIBRE!
                    </h2>
                    <p className="text-gray-200 font-medium text-xl sm:text-2xl drop-shadow-md">
                        Has completado todas tus horas
                    </p>
                </div>

                <button
                    onClick={() => setShow(false)}
                    className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/50 rounded-full text-lg font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}
