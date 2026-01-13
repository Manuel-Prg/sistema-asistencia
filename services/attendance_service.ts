import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { AttendanceRecord, AttendanceWithStudent, Shift } from '@/types/database';

/**
 * Obtiene todos los registros de asistencia
 * @returns {Promise<AttendanceWithStudent[]>} Lista de registros de asistencia con datos del estudiante
 */
export const get_all_attendance_records = async (): Promise<AttendanceWithStudent[]> => {
  try {
    const { data, error } = await getSupabaseBrowserClient()
      .from('attendance_records')
      .select('*, student:students!inner(*, profile:profiles!inner(*))');

    if (error) throw new Error(`Error al obtener registros: ${error.message}`);

    return data || [];
  } catch (err) {
    console.error('Error en get_all_attendance_records:', err);
    throw err;
  }
};

/**
 * Crea un nuevo registro de check-in
 * @param {string} student_id - ID del estudiante
 * @param {Shift} shift - Turno de trabajo
 * @param {string} room - Sala asignada
 * @returns {Promise<AttendanceRecord>} Registro creado
 */
export const create_check_in = async (
  student_id: string,
  shift: Shift,
  room: string
): Promise<AttendanceRecord> => {
  try {
    if (!student_id || !shift || !room) {
      throw new Error('Faltan parámetros requeridos: student_id, shift, room');
    }

    const { data, error } = await getSupabaseBrowserClient()
      .from('attendance_records')
      .insert([
        {
          student_id,
          check_in: new Date().toISOString(),
          shift,
          room,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Error al crear check-in: ${error.message}`);

    return data;
  } catch (err) {
    console.error('Error en create_check_in:', err);
    throw err;
  }
};

/**
 * Registra un check-out y calcula horas trabajadas
 * @param {string} record_id - ID del registro de asistencia
 * @param {string} early_departure_reason - Razón de salida temprana (opcional)
 * @returns {Promise<AttendanceRecord>} Registro actualizado
 */
export const create_check_out = async (
  record_id: string,
  early_departure_reason?: string
): Promise<AttendanceRecord> => {
  try {
    if (!record_id) {
      throw new Error('record_id es requerido');
    }

    const check_out_time = new Date();

    // Obtiene el registro existente para calcular horas
    const { data: existing_record, error: fetch_error } = await getSupabaseBrowserClient()
      .from('attendance_records')
      .select('check_in')
      .eq('id', record_id)
      .single();

    if (fetch_error) throw new Error(`Error al obtener registro: ${fetch_error.message}`);

    if (!existing_record) {
      throw new Error('Registro de asistencia no encontrado');
    }

    // Calcula horas trabajadas
    const check_in_date = new Date(existing_record.check_in);
    const hours_worked = (check_out_time.getTime() - check_in_date.getTime()) / (1000 * 60 * 60);

    const { data, error } = await getSupabaseBrowserClient()
      .from('attendance_records')
      .update({
        check_out: check_out_time.toISOString(),
        hours_worked: Math.round(hours_worked * 100) / 100,
        early_departure_reason: early_departure_reason || null,
      })
      .eq('id', record_id)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar check-out: ${error.message}`);

    return data;
  } catch (err) {
    console.error('Error en create_check_out:', err);
    throw err;
  }
};

/**
 * Obtiene los registros de asistencia de un estudiante específico
 * @param {string} student_id - ID del estudiante
 * @returns {Promise<AttendanceRecord[]>} Lista de registros del estudiante
 */
export const get_student_attendance = async (student_id: string): Promise<AttendanceRecord[]> => {
  try {
    if (!student_id) {
      throw new Error('student_id es requerido');
    }

    const { data, error } = await getSupabaseBrowserClient()
      .from('attendance_records')
      .select('*')
      .eq('student_id', student_id)
      .order('check_in', { ascending: false });

    if (error) throw new Error(`Error al obtener registros: ${error.message}`);

    return data || [];
  } catch (err) {
    console.error('Error en get_student_attendance:', err);
    throw err;
  }
};
