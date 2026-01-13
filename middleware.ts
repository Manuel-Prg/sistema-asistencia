import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  // Helper function para aplicar headers de seguridad
  const applySecurityHeaders = (response: NextResponse) => {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    return response
  }

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === "/login"
  const isPublicAuthRoute = pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  const isSupervisorPage = pathname.startsWith("/supervisor")
  const isStudentPage = pathname.startsWith("/student")
  const isProtectedRoute = isSupervisorPage || isStudentPage

  // Obtener usuario
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // ✅ SOLO loggear errores en rutas protegidas o cuando hay un error real
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  if (error && error.message !== "Auth session missing!" && isProtectedRoute) {
    console.warn(`[Security] Auth error from ${ip} on ${pathname}: ${error.message}`)
  }

  // Si no hay usuario y está tratando de acceder a rutas protegidas (NO rutas públicas de auth)
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url)
    const response = NextResponse.redirect(redirectUrl)
    return applySecurityHeaders(response)
  }

  // Si hay usuario y está en login
  if (user && isLoginPage) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error(`[Security] Profile fetch error for user ${user.id}:`, profileError)
      const response = NextResponse.redirect(new URL("/login", request.url))
      return applySecurityHeaders(response)
    }

    const redirectUrl = profile?.role === "supervisor"
      ? new URL("/supervisor", request.url)
      : new URL("/student", request.url)

    const response = NextResponse.redirect(redirectUrl)
    return applySecurityHeaders(response)
  }

  // Si hay usuario en ruta protegida
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile) {
      const response = NextResponse.redirect(new URL("/login", request.url))
      return applySecurityHeaders(response)
    }

    // Verificar rol correcto
    if (profile.role === "supervisor" && isStudentPage) {
      const response = NextResponse.redirect(new URL("/supervisor", request.url))
      return applySecurityHeaders(response)
    }

    if (profile.role === "student" && isSupervisorPage) {
      const response = NextResponse.redirect(new URL("/student", request.url))
      return applySecurityHeaders(response)
    }
  }

  // Aplicar headers a la respuesta normal
  return applySecurityHeaders(supabaseResponse)
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|logo/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}