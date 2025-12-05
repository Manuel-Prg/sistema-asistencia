// components/supervisor/supervisor-nav.tsx
"use client"

import { ClipboardCheck, LogOut, LayoutDashboard, Users, History, Menu, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/supervisor/actions"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SupervisorNavProps } from "@/lib/types/supervisor"

export function SupervisorNav({ userName }: SupervisorNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const navItems = [
    { href: "/supervisor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/supervisor/students", label: "Estudiantes", icon: Users },
    { href: "/supervisor/attendance", label: "Asistencias", icon: History },
    { href: "/supervisor/manage-hours", label: "Gestionar Horas", icon: Clock },
  ]

  // ✅ FUNCIÓN MEJORADA: Verifica si la ruta está activa de forma precisa
  const isActive = (href: string) => {
    if (!pathname) return false // <-- Verificación de seguridad añadida

    // Si es el dashboard, solo debe estar activo cuando pathname es exactamente "/supervisor"
    if (href === "/supervisor") {
      return pathname === "/supervisor"
    }
    // Para otras rutas, verifica que pathname comience con href
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Image
              src="/logo/iconoFavicon.png"
              alt="Logo"
              width={32}
              height={32}
              className="sm:w-10 sm:h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                Panel de Supervisión
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{userName}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className={cn("gap-2", active && "bg-indigo-600")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden xl:inline">Cerrar sesión</span>
              <span className="xl:hidden">Salir</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={cn("w-full justify-start gap-2", active && "bg-indigo-600")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm text-muted-foreground">Tema</span>
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}