// app/supervisor/layout.tsx
import type React from "react"
import { Toaster } from "sonner"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"

export default async function SupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "supervisor") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SupervisorNav userName={profile.full_name} />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <Toaster 
      position="top-right"
       richColors
       closeButton
       duration={4000} />
    </div>
  )
}