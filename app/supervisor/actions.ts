"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/login")
}

export async function exportToExcel() {
  const supabase = await getSupabaseServerClient()

  // Get all students with their profiles
  const { data: students } = await supabase
    .from("students")
    .select("*, profile:profiles(*)")
    .order("profile(full_name)")

  // Get all attendance records
  const { data: records } = await supabase
    .from("attendance_records")
    .select("*, student:students(*, profile:profiles(*))")
    .order("check_in", { ascending: false })

  return { students, records }
}
