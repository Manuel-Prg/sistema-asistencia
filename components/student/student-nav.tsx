"use client"

import { LogOut, User } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/student/actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import type { StudentNavProps } from "@/lib/types/student"


export function StudentNav({ userName }: StudentNavProps) {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    window.location.href = "/login"
  }

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Image
              src="/logo/iconoFavicon.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                Sistema de Asistencia
              </h1>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {userName}
                </p>
              </div>
            </div>
          </div>

          {/* Actions - Theme Toggle & Logout */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="gap-1.5 sm:gap-2 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}