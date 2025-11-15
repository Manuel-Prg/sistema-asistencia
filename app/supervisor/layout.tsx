// app/supervisor/layout.tsx
import type React from "react"
import { Toaster } from "sonner"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupervisorNav } from "@/components/supervisor/supervisor-nav"
import { Footer } from "@/components/ui/footer"

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SupervisorNav userName={profile.full_name} />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <Footer />
      <Toaster 
        position="top-right"
        richColors
        closeButton
        duration={4000} 
      />
    </div>
  )
}