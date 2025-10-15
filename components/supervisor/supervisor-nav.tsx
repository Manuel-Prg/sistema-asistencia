"use client"

import { ClipboardCheck, LogOut, LayoutDashboard, Users, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/supervisor/actions"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SupervisorNavProps {
  userName: string
}

export function SupervisorNav({ userName }: SupervisorNavProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const navItems = [
    { href: "/supervisor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/supervisor/students", label: "Estudiantes", icon: Users },
    { href: "/supervisor/attendance", label: "Asistencias", icon: History },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Panel de Supervisión</h1>
                <p className="text-sm text-gray-600">{userName}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn("gap-2", isActive && "bg-indigo-600")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}
