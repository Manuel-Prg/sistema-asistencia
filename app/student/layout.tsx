import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StudentNav } from "@/components/student/student-nav"

export default async function StudentLayout({
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

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()

  if (profile?.role !== "student") {
    // If the profile exists but role is not student, send to login so
    // middleware/layouts can re-evaluate session/profile instead of
    // bouncing between dashboards which can create a redirect loop.
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StudentNav userName={profile.full_name} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
