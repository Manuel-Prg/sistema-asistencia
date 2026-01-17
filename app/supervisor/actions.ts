// app/supervisor/actions.ts
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
    .select("*, profile:profiles!inner(*)")
    .order("profile(full_name)")

  // Get all attendance records
  const { data: records } = await supabase
    .from("attendance_records")
    .select("*, student:students!inner(*, profile:profiles!inner(*))")
    .order("check_in", { ascending: false })

  return { students, records }
}

// ✅ NUEVA: Forzar check-out manual por supervisor
export async function forceCheckOut(recordId: string, reason: string) {
  const supabase = await getSupabaseServerClient()

  try {
    // Obtener el registro activo
    const { data: record, error: fetchError } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("id", recordId)
      .single()

    if (fetchError || !record) {
      return { success: false, error: "Registro no encontrado" }
    }

    // Calcular horas trabajadas
    const checkInTime = new Date(record.check_in)
    const checkOutTime = new Date()
    const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

    // ✅ LÍMITE: Máximo 10 horas por día
    const cappedHours = Math.min(hoursWorked, 10)

    // Actualizar registro con salida forzada
    const { error: updateError } = await supabase
      .from("attendance_records")
      .update({
        check_out: checkOutTime.toISOString(),
        hours_worked: cappedHours,
        early_departure_reason: reason || "Salida forzada por supervisor"
      })
      .eq("id", recordId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // El trigger se encargará de actualizar accumulated_hours automáticamente
    revalidatePath("/supervisor")

    return {
      success: true,
      hoursWorked: cappedHours,
      wasCapped: hoursWorked > 10
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ✅ NUEVA: Auto-cerrar registros antiguos (más de 24 horas)
export async function autoCloseOldRecords() {
  const supabase = await getSupabaseServerClient()

  try {
    // Buscar registros con más de 24 horas sin check-out
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const { data: oldRecords, error: fetchError } = await supabase
      .from("attendance_records")
      .select("id, check_in, student_id")
      .is("check_out", null)
      .lt("check_in", twentyFourHoursAgo.toISOString())

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    if (!oldRecords || oldRecords.length === 0) {
      return { success: true, closed: 0, message: "No hay registros antiguos" }
    }

    // Cerrar cada registro con 4 horas (turno mínimo)
    for (const record of oldRecords) {
      const checkIn = new Date(record.check_in)
      const checkOut = new Date(checkIn.getTime() + (4 * 60 * 60 * 1000)) // +4 horas

      await supabase
        .from("attendance_records")
        .update({
          check_out: checkOut.toISOString(),
          hours_worked: 4.0,
          early_departure_reason: "Auto-cerrado por sistema (más de 24h sin salida)"
        })
        .eq("id", record.id)
    }

    revalidatePath("/supervisor")

    return {
      success: true,
      closed: oldRecords.length,
      message: `Se cerraron ${oldRecords.length} registros antiguos`
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ✅ NUEVA: Auto-cerrar registros que excedan 10 horas
export async function capLongSessions() {
  const supabase = await getSupabaseServerClient()

  try {
    // Buscar registros activos con más de 10 horas
    const tenHoursAgo = new Date()
    tenHoursAgo.setHours(tenHoursAgo.getHours() - 10)

    const { data: longRecords, error: fetchError } = await supabase
      .from("attendance_records")
      .select("id, check_in, student_id")
      .is("check_out", null)
      .lt("check_in", tenHoursAgo.toISOString())

    if (fetchError) {
      return { success: false, error: fetchError.message }
    }

    if (!longRecords || longRecords.length === 0) {
      return { success: true, capped: 0, message: "No hay sesiones largas" }
    }

    // Cerrar cada registro con exactamente 10 horas
    for (const record of longRecords) {
      const checkIn = new Date(record.check_in)
      const checkOut = new Date(checkIn.getTime() + (10 * 60 * 60 * 1000)) // +10 horas

      await supabase
        .from("attendance_records")
        .update({
          check_out: checkOut.toISOString(),
          hours_worked: 10.0,
          early_departure_reason: "Auto-cerrado por límite de 10 horas diarias"
        })
        .eq("id", record.id)
    }

    revalidatePath("/supervisor")

    return {
      success: true,
      capped: longRecords.length,
      message: `Se limitaron ${longRecords.length} sesiones a 10 horas`
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ✅ NUEVA: Ajustar horas manualmente
export async function adjustStudentHours(
  studentId: string,
  hoursAdjustment: number,
  reason: string
) {
  try {
    const supabase = await getSupabaseServerClient()

    // Verificar que el usuario es supervisor
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "No autenticado" }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "supervisor") {
      return { success: false, error: "No autorizado" }
    }

    // Obtener las horas actuales del estudiante
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("accumulated_hours")
      .eq("id", studentId)
      .single()

    if (studentError || !student) {
      console.error("Error al obtener estudiante:", studentError)
      return { success: false, error: "Estudiante no encontrado" }
    }

    // Obtener el turno actual para el registro
    const now = new Date()
    const hour = now.getHours()
    const shift = hour < 14 ? "matutino" : "vespertino"

    // Crear registro de asistencia con el ajuste
    // Permitimos horas negativas para que el trigger actualice correctamente el total
    const adjustmentType = hoursAdjustment > 0 ? "SUMA" : "RESTA"
    const { error: recordError } = await supabase
      .from("attendance_records")
      .insert({
        student_id: studentId,
        check_in: now.toISOString(),
        check_out: now.toISOString(),
        shift: shift,
        room: "Ajuste Manual",
        hours_worked: hoursAdjustment, // Permitir valor negativo
        early_departure_reason: `${adjustmentType}: ${reason}`,
      })

    if (recordError) {
      console.error("Error al crear registro:", recordError)
      return { success: false, error: "Error al crear registro de ajuste" }
    }

    // Revalidar todas las rutas relevantes
    revalidatePath("/supervisor/manage-hours")
    revalidatePath("/supervisor/manage-hours/history")
    revalidatePath("/supervisor/students")
    revalidatePath("/supervisor")

    return { success: true }
  } catch (error: any) {
    console.error("Error en adjustStudentHours:", error)
    return { success: false, error: "Error al procesar el ajuste" }
  }
}