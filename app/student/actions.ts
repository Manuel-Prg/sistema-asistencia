// app/student/actions.ts
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

  // Verificar si hay una sesión activa
  const { data: activeRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  if (activeRecord) {
    // Verificación de sesiones "pegadas" (más de 24 horas)
    const checkInTime = new Date(activeRecord.check_in)
    const now = new Date()
    const hoursElapsed = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

    if (hoursElapsed > 24) {
      // Auto-cerrar la sesión antigua
      const autoCheckOutDate = new Date(checkInTime.getTime() + (4 * 60 * 60 * 1000)) // +4 horas

      await supabase
        .from("attendance_records")
        .update({
          check_out: autoCheckOutDate.toISOString(),
          hours_worked: 4.0, // Mínimo de horas
          early_departure_reason: "Auto-cerrado por sistema (nueva entrada tras +24h)"
        })
        .eq("id", activeRecord.id)

      // Continuar con el check-in normal (no retornamos error)
    } else {
      // Si es menos de 24 horas, bloqueamos como siempre
      return { error: "Ya tienes una entrada activa. Debes registrar salida primero." }
    }
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
  const hoursWorkedRaw = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

  // APLICAR LÍMITE DE 10 HORAS
  // Si trabajó más de 10 horas, registramos solo 10.
  const hoursWorked = Math.min(hoursWorkedRaw, 10.0)

  const updateData: any = {
    check_out: checkOutTime.toISOString(),
    hours_worked: hoursWorked,
  }

  if (hoursWorkedRaw > 10.0) {
    updateData.early_departure_reason = earlyDepartureReason
      ? `Límite 10h excedido (+${(hoursWorkedRaw - 10).toFixed(1)}h reales). ${earlyDepartureReason}`
      : `Auto-limitado a 10h (real: ${hoursWorkedRaw.toFixed(1)}h)`
  } else if (earlyDepartureReason) {
    updateData.early_departure_reason = earlyDepartureReason
  }

  const { error: updateError } = await supabase
    .from("attendance_records")
    .update(updateData)
    .eq("id", activeRecord.id)

  if (updateError) {
    return { error: updateError.message }
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  revalidatePath("/student")

  return { success: true, hoursWorked }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/")
}