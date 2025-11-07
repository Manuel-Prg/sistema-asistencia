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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname === "/login"
  const isSupervisorPage = request.nextUrl.pathname.startsWith("/supervisor")
  const isStudentPage = request.nextUrl.pathname.startsWith("/student")

  // Redirect to login if not authenticated and trying to access protected routes
  if (!user && !isLoginPage) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and on login page, redirect to appropriate dashboard
  if (user && isLoginPage) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Middleware: Error fetching profile:", error)
      return NextResponse.redirect(new URL("/student", request.url))
    }

    if (profile?.role === "supervisor") {
      return NextResponse.redirect(new URL("/supervisor", request.url))
    } else {
      return NextResponse.redirect(new URL("/student", request.url))
    }
  }

  // Prevent supervisors from accessing student routes and vice versa
  if (user && (isSupervisorPage || isStudentPage)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile) {
      if (profile.role === "supervisor" && isStudentPage) {
        return NextResponse.redirect(new URL("/supervisor", request.url))
      }
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