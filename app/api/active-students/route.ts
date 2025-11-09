// app/api/active-students/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log("🔵 API route /api/active-students called")
  
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ Missing environment variables")
      return NextResponse.json({ error: "Config error", activeStudents: [] })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabaseAdmin
      .from("attendance_records")
      .select(`id, check_in, shift, room, student:students!inner(profile:profiles!inner(full_name))`)
      .gte("check_in", today.toISOString())
      .is("check_out", null)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message, activeStudents: [] })
    }

    const formatted = data?.map((r: any) => ({
      id: r.id,
      studentName: r.student?.profile?.full_name || "Sin nombre",
      checkIn: r.check_in,
      shift: r.shift,
      room: r.room,
    })) || []

    console.log(`✅ Found ${formatted.length} active students`)
    return NextResponse.json({ activeStudents: formatted })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Server error", activeStudents: [] })
  }
}