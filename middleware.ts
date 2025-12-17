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

  // Obtener usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === "/login"
  const isSupervisorPage = pathname.startsWith("/supervisor")
  const isStudentPage = pathname.startsWith("/student")
  const isProtectedRoute = isSupervisorPage || isStudentPage

  // Si no hay usuario y está tratando de acceder a rutas protegidas → redirigir a login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si hay usuario y está en login → redirigir según su rol
  if (user && isLoginPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role === "supervisor") {
      return NextResponse.redirect(new URL("/supervisor", request.url))
    } else {
      return NextResponse.redirect(new URL("/student", request.url))
    }
  }

  // Si hay usuario en ruta protegida → verificar que tenga el rol correcto
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile) {
      // Supervisor tratando de acceder a student → redirigir a supervisor
      if (profile.role === "supervisor" && isStudentPage) {
        return NextResponse.redirect(new URL("/supervisor", request.url))
      }
      // Student tratando de acceder a supervisor → redirigir a student
      if (profile.role === "student" && isSupervisorPage) {
        return NextResponse.redirect(new URL("/student", request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/ (API routes)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico, /logo/ (static files)
     * - .*\\.(?:svg|png|jpg|jpeg|gif|webp)$ (image files)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|logo/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}