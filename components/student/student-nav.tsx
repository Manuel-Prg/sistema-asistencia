// components/student/student-nav.tsx
"use client"

import { ClipboardCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/student/actions"

interface StudentNavProps {
  userName: string
}

export function StudentNav({ userName }: StudentNavProps) {
  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Sistema de Asistencia</h1>
              <p className="text-sm text-gray-600">{userName}</p>
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
