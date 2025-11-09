// app/student/actions.ts
"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function checkIn(room: string, shift: "matutino" | "vespertino") {
  console.log("=== CHECK-IN INICIADO ===")
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("Error de autenticación:", userError)
    return { error: "No autenticado" }
  }

  console.log("Usuario:", user.id)

  const { data: activeRecord } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  if (activeRecord) {
    console.log("Ya existe entrada activa:", activeRecord.id)
    return { error: "Ya tienes una entrada activa. Debes registrar salida primero." }
  }

  const { error } = await supabase.from("attendance_records").insert({
    student_id: user.id,
    check_in: new Date().toISOString(),
    shift,
    room,
  })

  if (error) {
    console.error("Error al insertar registro:", error)
    return { error: error.message }
  }

  console.log("=== CHECK-IN EXITOSO ===")
  revalidatePath("/student")
  return { success: true }
}

export async function checkOut(earlyDepartureReason?: string) {
  console.log("=== CHECK-OUT INICIADO ===")
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("Error de autenticación:", userError)
    return { error: "No autenticado" }
  }

  console.log("Usuario:", user.id)

  // Find the active check-in
  const { data: activeRecord, error: fetchError } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", user.id)
    .is("check_out", null)
    .single()

  if (fetchError || !activeRecord) {
    console.error("Error buscando registro activo:", fetchError)
    return { error: "No hay entrada activa para registrar salida" }
  }

  console.log("Registro activo encontrado:", activeRecord.id)
  console.log("Check-in time:", activeRecord.check_in)

  const checkInTime = new Date(activeRecord.check_in)
  const checkOutTime = new Date()
  const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

  console.log("Check-out time:", checkOutTime.toISOString())
  console.log("Horas trabajadas:", hoursWorked)

  const updateData: any = {
    check_out: checkOutTime.toISOString(),
    hours_worked: hoursWorked,
  }

  if (earlyDepartureReason) {
    updateData.early_departure_reason = earlyDepartureReason
    console.log("Razón de salida temprana:", earlyDepartureReason)
  }

  // ✅ Solo actualizar el registro de asistencia
  // El trigger de la BD se encargará de actualizar accumulated_hours automáticamente
  const { error: updateError } = await supabase
    .from("attendance_records")
    .update(updateData)
    .eq("id", activeRecord.id)

  if (updateError) {
    console.error("Error actualizando registro:", updateError)
    return { error: updateError.message }
  }

  console.log("=== CHECK-OUT EXITOSO ===")
  console.log("Horas registradas:", hoursWorked)
  console.log("El trigger actualizará las horas acumuladas automáticamente")

  // ✅ Esperar un momento para que el trigger se ejecute
  await new Promise(resolve => setTimeout(resolve, 500))

  // ✅ Revalidar la página para que se muestren los datos actualizados
  revalidatePath("/student")
  
  return { success: true, hoursWorked }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/")
}