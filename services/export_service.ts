import { supabase_client } from '@/lib/supabase_client';

/**
 * Obtiene registros de asistencia entre dos fechas y normaliza filas para Excel
 * @param {string | null} from_iso - fecha ISO desde (inclusive) o null
 * @param {string | null} to_iso - fecha ISO hasta (inclusive) o null
 * @returns {Promise<any[]>} lista de filas normalizadas
 */
export const get_attendance_rows_for_export = async (from_iso: string | null, to_iso: string | null): Promise<any[]> => {
	try {
		let query = supabase_client
			.from('attendance_records')
			.select(`
				id,
				student_id,
				check_in,
				check_out,
				shift,
				room,
				hours_worked,
				early_departure_reason,
				created_at,
				students:students (
					required_hours,
					assigned_room,
					accumulated_hours,
					profiles:profiles (
						email,
						full_name,
						role
					)
				)
			`);
		if (from_iso) query = query.gte('check_in', from_iso);
		if (to_iso) query = query.lte('check_in', to_iso);
		const { data, error } = await query.order('check_in', { ascending: true });
		if (error) throw error;
		const rows = (data || []).map((r: any) => {
			const profile = r?.students?.profiles || null;
			return {
				id: r.id,
				student_id: r.student_id,
				email: profile?.email || '',
				full_name: profile?.full_name || '',
				role: profile?.role || '',
				student_type: r?.students?.student_type || '',
				required_hours: r?.students?.required_hours ?? '',
				assigned_room: r?.students?.assigned_room ?? '',
				shift: r.shift ?? '',
				room: r.room ?? '',
				check_in: r.check_in ?? '',
				check_out: r.check_out ?? '',
				hours_worked: r.hours_worked ?? '',
				early_departure_reason: r.early_departure_reason ?? '',
				record_created_at: r.created_at ?? '',
			};
		});
		return rows;
	} catch (err) {
		console.error('Error en get_attendance_rows_for_export:', err);
		throw err;
	}
};
