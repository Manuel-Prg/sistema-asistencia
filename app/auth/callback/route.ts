import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"
    const error = searchParams.get("error")
    const errorDescription = searchParams.get("error_description")

    // Si ya viene un error en la URL, redirigir al login con el error
    if (error) {
        return NextResponse.redirect(
            `${origin}/login?error=${error}&message=${encodeURIComponent(errorDescription || 'Error de autenticación')}`
        )
    }

    if (code) {
        const cookieStore = request.cookies
        const response = NextResponse.redirect(`${origin}${next}`)

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value,
                            ...options,
                        })
                    },
                    remove(name: string, options: CookieOptions) {
                        response.cookies.set({
                            name,
                            value: "",
                            ...options,
                        })
                    },
                },
            }
        )

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (!exchangeError) {
            return response
        }

        console.error('Error al intercambiar código:', exchangeError)

        return NextResponse.redirect(
            `${origin}/login?error=auth-code-error&message=${encodeURIComponent(exchangeError.message)}`
        )
    }

    // No hay código ni error
    return NextResponse.redirect(`${origin}/login?error=no-code`)
}