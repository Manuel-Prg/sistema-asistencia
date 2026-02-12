// app/api/active-students/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Rate limiting simple (puedes mejorarlo con Redis o Upstash)
const requestLog = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 180000 // 3 minutos
  const maxRequests = 90 // 90 requests por 3 minutos (30 por minuto)

  const requests = requestLog.get(ip) || []
  const recentRequests = requests.filter(time => now - time < windowMs)

  if (recentRequests.length >= maxRequests) {
    return false
  }

  recentRequests.push(now)
  requestLog.set(ip, recentRequests)
  return true
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const headersList = headers()
    const ip = (await headersList).get('x-forwarded-for')?.split(',')[0] ||
      (await headersList).get('x-real-ip') ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests", activeStudents: [] },
        { status: 429 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Config error", activeStudents: [] })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data, error } = await supabaseAdmin
      .from("attendance_records")
      .select(`
        id, 
        check_in, 
        shift, 
        room, 
        student:students!inner(
          profile:profiles!inner(full_name)
        )
      `)
      .is("check_out", null)
      .order("check_in", { ascending: false })

    if (error) {
      console.error("Database error in active-students:", error)
      return NextResponse.json(
        { error: error.message, activeStudents: [] },
        { status: 500 }
      )
    }

    const formatted = data?.map((r: any) => ({
      id: r.id,
      studentName: r.student?.profile?.full_name || "Sin nombre",
      checkIn: r.check_in,
      shift: r.shift,
      room: r.room,
    })) || []

    return NextResponse.json({ activeStudents: formatted }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Server error",
      activeStudents: []
    })
  }
}