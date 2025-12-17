// app/supervisor/users/new/action.ts
"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

interface CreateUserData {
  email: string
  password: string
  fullName: string
  role: "student" | "supervisor"
  studentType?: "servicio_social" | "practicas"
  requiredHours?: number
}

export async function createNewUser(data: CreateUserData) {
  try {
    const supabase = await getSupabaseServerClient()

    // Check if supervisor is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "No autenticado" }
    }

    // Verify user is a supervisor
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "supervisor") {
      return { error: "No tienes permisos para crear usuarios" }
    }

    // Create user using admin client WITHOUT triggering the database trigger
    const supabaseAdmin = getSupabaseAdminClient()

    // First, create the auth user with email_confirm to skip confirmation
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return { error: authError.message }
    }

    if (!newUser.user) {
      return { error: "No se pudo crear el usuario" }
    }

    console.log("User created in auth:", newUser.user.id)

    // Force send confirmation email
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: data.email,
    })

    if (resendError) {
      console.warn("Could not send confirmation email:", resendError)
      // We don't block the process but warn the admin
    } else {
      console.log("Confirmation email sent to:", data.email)
    }

    // Now manually create the profile (bypassing the trigger issue)
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: newUser.user.id,
      email: data.email,
      full_name: data.fullName,
      role: data.role,
    })

    if (profileError) {
      console.error("Profile error:", profileError)
      // Clean up: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      return { error: "Error al crear el perfil: " + profileError.message }
    }

    console.log("Profile created successfully")

    // If student, create student record
    if (data.role === "student" && data.studentType && data.requiredHours) {
      const { error: studentError } = await supabaseAdmin.from("students").insert({
        id: newUser.user.id,
        student_type: data.studentType,
        required_hours: data.requiredHours,
        accumulated_hours: 0,
        assigned_room: "Por asignar",
      })

      if (studentError) {
        console.error("Student error:", studentError)
        // Clean up profile and auth user
        await supabaseAdmin.from("profiles").delete().eq("id", newUser.user.id)
        await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
        return { error: "Error al crear el registro de estudiante: " + studentError.message }
      }

      console.log("Student record created successfully")
    }

    return { success: true, userId: newUser.user.id }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return { error: error.message || "Error inesperado al crear usuario" }
  }
}