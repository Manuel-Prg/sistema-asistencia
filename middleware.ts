import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getUserRole } from "@/lib/supabase/middleware-helper"

// Patrones sospechosos comunes
const SUSPICIOUS_PATTERNS = [
  /(\.\.|\/etc\/|\/bin\/|\/usr\/|\/var\/)/i, // Path traversal
  /(union|select|insert|update|delete|drop|create|alter|exec|script)/i, // SQL injection / XSS
  /<script|javascript:|onerror=|onload=/i, // XSS
  /\0|%00/i, // Null byte injection
]

// Rate limiting simple (en memoria, se reinicia con cada deploy)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests
const RATE_WINDOW = 60 * 1000 // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

// Detectar patrones sospechosos en URL
function isSuspiciousRequest(url: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url))
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now()

  // 1. Obtener IP del cliente
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 
             request.headers.get('x-real-ip') ?? 
             '127.0.0.1'

  // 2. Rate limiting
  if (!checkRateLimit(ip)) {
    console.warn(`[SECURITY] Rate limit exceeded from IP: ${ip}`)
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': RATE_LIMIT.toString(),
        'X-RateLimit-Reset': Date.now().toString(),
      }
    })
  }

  // 3. Detectar patrones sospechosos
  const fullUrl = request.nextUrl.pathname + request.nextUrl.search
  if (isSuspiciousRequest(fullUrl)) {
    console.error(`[SECURITY] Suspicious request blocked from ${ip}: ${fullUrl}`)
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 4. Headers de seguridad
  let supabaseResponse = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  })

  // Agregar security headers
  supabaseResponse.headers.set('X-Frame-Options', 'SAMEORIGIN')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block')
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  supabaseResponse.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // 5. Configurar Supabase client
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
  const isRootPage = request.nextUrl.pathname === "/"
  const isSupervisorPage = request.nextUrl.pathname.startsWith("/supervisor")
  const isStudentPage = request.nextUrl.pathname.startsWith("/student")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")

  // 6. Proteger rutas de API (solo para usuarios autenticados o rutas públicas específicas)
  if (isApiRoute && !request.nextUrl.pathname.startsWith("/api/active-students")) {
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  }

  // 7. Redirect to login if not authenticated and trying to access protected routes
  if (!user && !isLoginPage && !isApiRoute) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // 7b. Si el usuario está en "/" (root), redirigir según su rol
  if (user && isRootPage) {
    try {
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
    } catch (error) {
      console.error("Middleware: Error fetching profile for root redirect:", error)
      return NextResponse.redirect(new URL("/student", request.url))
    }
  }

  // 8. If authenticated and on login page, redirect to appropriate dashboard
  if (user && isLoginPage) {
    try {
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
    } catch (error) {
      console.error("Middleware: Exception fetching profile:", error)
      return NextResponse.redirect(new URL("/student", request.url))
    }
  }

  // 9. Prevent supervisors from accessing student routes and vice versa
  if (user && (isSupervisorPage || isStudentPage)) {
    try {
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
    } catch (error) {
      console.error("Middleware: Error checking role:", error)
    }
  }

  // 10. Validar sesión antigua (opcional: forzar relogin después de 24h)
  if (user) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session) {
      // Usar expires_at en lugar de created_at
      const expiresAt = sessionData.session.expires_at
      if (expiresAt) {
        const expiryTime = expiresAt * 1000 // Convertir a milisegundos
        const now = Date.now()
        
        // Si la sesión está por expirar en menos de 1 hora, forzar relogin
        if (expiryTime - now < 60 * 60 * 1000) {
          console.log(`[SECURITY] Session expiring soon for user ${user.id}`)
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL("/login", request.url))
        }
      }
    }
  }

  // 11. Log de performance y seguridad (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime
    console.log(`[MIDDLEWARE] ${request.method} ${request.nextUrl.pathname} - ${duration}ms - IP: ${ip}`)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - files with extensions (images, fonts, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot)$).*)",
  ],
}