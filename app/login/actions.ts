"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const supabase = await getSupabaseServerClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error("Supabase Auth Error:", error) // Log para Vercel
            if (error.message.includes("Invalid login credentials")) {
                return { error: "Credenciales de inicio de sesión inválidas" }
            }
            if (error.message.includes("Email not confirmed")) {
                return { error: "Por favor confirma tu correo electrónico" }
            }
            if (error.message.includes("rate") || error.message.includes("too many")) {
                return { error: "Demasiados intentos. Por favor espera un momento" }
            }
            return { error: error.message }
        }

        // Verificar rol para redirección
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            console.error("User Fetch Error:", userError)
            return { error: "Error al obtener información del usuario." }
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profileError) {
            console.error("Profile Fetch Error:", profileError)
            // No bloqueamos el login si falla el perfil, pero loggeamos
        }

        if (profile?.role === "supervisor") {
            redirect("/supervisor")
        } else {
            redirect("/student")
        }
    } catch (error: any) {
        if (error.message === "NEXT_REDIRECT") {
            throw error; // Re-lanzar para que redirect funcidne
        }
        console.error("Critical Login Action Error:", error)
        return { error: "Error crítico de conexión con el servidor de autenticación." }
    }
}
