// actions.ts
"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function checkIn(room: string, shift: "matutino" | "vespertino") {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "No autenticado" }
  }

  const { data: activeRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  if (activeRecord) {
    return { error: "Ya tienes una entrada activa. Debes registrar salida primero." }
  }

  const { error } = await supabase.from("attendance_records").insert({
    student_id: user.id,
    check_in: new Date().toISOString(),
    shift,
    room,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/student")
  return { success: true }
}

export async function checkOut(earlyDepartureReason?: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "No autenticado" }
  }

  // Find the active check-in
  const { data: activeRecord, error: fetchError } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  if (fetchError || !activeRecord) {
    return { error: "No hay entrada activa para registrar salida" }
  }

  const checkInTime = new Date(activeRecord.check_in)
  const checkOutTime = new Date()
  const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

  const updateData: any = {
    check_out: checkOutTime.toISOString(),
    hours_worked: hoursWorked,
  }

  if (earlyDepartureReason) {
    updateData.early_departure_reason = earlyDepartureReason
  }

  const { error: updateError } = await supabase.from("attendance_records").update(updateData).eq("id", activeRecord.id)

  if (updateError) {
    return { error: updateError.message }
  }

  const { data: student } = await supabase.from("students").select("accumulated_hours").eq("id", user.id).single()

  if (student) {
    await supabase
      .from("students")
      .update({
        accumulated_hours: (student.accumulated_hours || 0) + hoursWorked,
      })
      .eq("id", user.id)
  }

  revalidatePath("/student")
  return { success: true, hoursWorked }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/login")
}
