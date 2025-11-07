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
      // On error, redirect to student by default
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
      // If supervisor tries to access student page, redirect to supervisor
      if (profile.role === "supervisor" && isStudentPage) {
        return NextResponse.redirect(new URL("/supervisor", request.url))
      }
      // If student tries to access supervisor page, redirect to student
      if (profile.role === "student" && isSupervisorPage) {
        return NextResponse.redirect(new URL("/student", request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}