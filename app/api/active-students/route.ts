// app/api/active-students/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
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
      return NextResponse.json({ error: error.message, activeStudents: [] })
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