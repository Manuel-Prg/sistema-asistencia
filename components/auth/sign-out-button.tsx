"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        await supabase.auth.signOut()
        router.refresh()
        router.push("/login")
    }

    return (
        <Button onClick={handleSignOut} variant="destructive" className="gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
        </Button>
    )
}
