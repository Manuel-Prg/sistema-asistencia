"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        if (error.message.includes("Invalid login credentials")) {
            return { error: "Credenciales de inicio de sesión inválidas" }
        }
        if (error.message.includes("Email not confirmed")) {
            return { error: "Por favor confirma tu correo electrónico" }
        }
        if (error.message.includes("rate") || error.message.includes("too many")) {
            return { error: "Demasiados intentos. Por favor espera un momento" }
        }
        // Si hay un error de conexión, es probable que venga aquí también,
        // pero al menos estamos en el servidor de Vercel (idealmente)
        return { error: error.message }
    }

    // Verificar rol para redirección
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

        if (profile?.role === "supervisor") {
            redirect("/supervisor")
        } else {
            redirect("/student")
        }
    }

    redirect("/")
}
