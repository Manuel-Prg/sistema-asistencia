import { supabase_client } from '@/lib/supabase_client';
import { StudentWithProfile, Student } from '@/types/database';

/**
 * Obtiene todos los estudiantes con sus datos de perfil
 * @returns {Promise<StudentWithProfile[]>} Lista de estudiantes
 */
export const get_all_students = async (): Promise<StudentWithProfile[]> => {
  try {
    const { data, error } = await supabase_client
      .from('students')
      .select('*, profile:profiles(*)');

    if (error) throw new Error(`Error al obtener estudiantes: ${error.message}`);

    return data || [];
  } catch (err) {
    console.error('Error en get_all_students:', err);
    throw err;
  }
};

/**
 * Obtiene un estudiante específico por ID
 * @param {string} student_id - ID del estudiante
 * @returns {Promise<StudentWithProfile>} Datos del estudiante
 */
export const get_student_by_id = async (student_id: string): Promise<StudentWithProfile> => {
  try {
    if (!student_id) {
      throw new Error('student_id es requerido');
    }

    const { data, error } = await supabase_client
      .from('students')
      .select('*, profile:profiles(*)')
      .eq('id', student_id)
      .single();

    if (error) throw new Error(`Error al obtener estudiante: ${error.message}`);

    if (!data) {
      throw new Error('Estudiante no encontrado');
    }

    return data;
  } catch (err) {
    console.error('Error en get_student_by_id:', err);
    throw err;
  }
};

/**
 * Actualiza las horas acumuladas de un estudiante
 * @param {string} student_id - ID del estudiante
 * @param {number} hours_to_add - Horas a sumar
 * @returns {Promise<Student>} Estudiante actualizado
 */
export const update_accumulated_hours = async (
  student_id: string,
  hours_to_add: number
): Promise<Student> => {
  try {
    if (!student_id || hours_to_add < 0) {
      throw new Error('Parámetros inválidos');
    }

    // Obtiene las horas actuales
    const { data: student, error: fetch_error } = await supabase_client
      .from('students')
      .select('accumulated_hours')
      .eq('id', student_id)
      .single();

    if (fetch_error) throw new Error(`Error al obtener estudiante: ${fetch_error.message}`);

    if (!student) {
      throw new Error('Estudiante no encontrado');
    }

    const new_accumulated_hours = (student.accumulated_hours || 0) + hours_to_add;

    const { data, error } = await supabase_client
      .from('students')
      .update({ accumulated_hours: new_accumulated_hours })
      .eq('id', student_id)
      .select()
      .single();

    if (error) throw new Error(`Error al actualizar horas: ${error.message}`);

    return data;
  } catch (err) {
    console.error('Error en update_accumulated_hours:', err);
    throw err;
  }
};
