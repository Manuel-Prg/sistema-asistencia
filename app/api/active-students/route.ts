// app/api/active-students/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic' // Desactiva cache
export const revalidate = 0

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()

    // Obtener registros activos (sin check_out)
    const { data: records, error: recordsError } = await supabase
      .from('attendance_records')
      .select(`
        id,
        student_id,
        check_in,
        room,
        shift
      `)
      .is('check_out', null)
      .order('check_in', { ascending: false })

    if (recordsError) {
      console.error('Error fetching attendance records:', recordsError)
      return NextResponse.json(
        { error: 'Error al obtener registros' },
        { status: 500 }
      )
    }

    if (!records || records.length === 0) {
      return NextResponse.json([])
    }

    // Obtener nombres de estudiantes
    const studentIds = records.map((r) => r.student_id)
    
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select(`
        id,
        profiles!inner(full_name)
      `)
      .in('id', studentIds)

    if (studentsError) {
      console.error('Error fetching students:', studentsError)
      // Devolver datos sin nombres si falla
      return NextResponse.json(
        records.map((record) => ({
          id: record.id,
          student_name: 'Cargando...',
          room: record.room,
          shift: record.shift,
          check_in: record.check_in,
        }))
      )
    }

    // Mapear nombres a estudiantes
    const studentMap = new Map()
    students?.forEach((s: any) => {
      studentMap.set(s.id, s.profiles?.full_name || 'Desconocido')
    })

    // Construir respuesta con datos mínimos necesarios
    const activeStudents = records.map((record) => ({
      id: record.id,
      student_name: studentMap.get(record.student_id) || 'Desconocido',
      room: record.room,
      shift: record.shift,
      check_in: record.check_in,
    }))

    return NextResponse.json(activeStudents, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}