import type { NextApiRequest, NextApiResponse } from 'next';
import { create_supabase_client_for_token } from '@/lib/supabase_server';
import ExcelJS from 'exceljs';

/**
 * API para exportar asistencias a Excel con estilos.
 */
export default async function export_attendance_api(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	try {
		if (req.method !== 'POST') {
			res.setHeader('Allow', 'POST');
			return res.status(405).json({ error: 'Method not allowed' });
		}

		const auth_header = (req.headers.authorization || '') as string;
		const match = auth_header.match(/^Bearer (.+)$/);
		if (!match) {
			return res.status(401).json({ error: 'Missing Authorization Bearer token' });
		}
		const access_token = match[1];

		// Validar fechas opcionales
		const { from, to } = req.body || {};

		let from_iso: string | null = null;
		let to_iso: string | null = null;
		if (from) {
			const d = new Date(from);
			if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid from date' });
			from_iso = d.toISOString();
		}
		if (to) {
			const d = new Date(to);
			if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid to date' });
			to_iso = d.toISOString();
		}

		// Crear cliente supabase
		const supabase = create_supabase_client_for_token(access_token);

		// Construir consulta
		let query = supabase
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
					student_type,
					required_hours,
					assigned_room,
					accumulated_hours,
					profiles:profiles ( email, full_name, role )
				)
			`)
			.order('check_in', { ascending: true });

		if (from_iso) query = query.gte('check_in', from_iso);
		if (to_iso) query = query.lte('check_in', to_iso);

		const { data, error } = await query;

		if (error) {
			return res.status(500).json({ error: 'Error querying attendance records' });
		}

		// Crear Workbook y Worksheet con ExcelJS
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Asistencias');

		// Definir columnas con anchos y claves
		worksheet.columns = [
			{ header: 'ID Registro', key: 'id_registro', width: 36 },
			{ header: 'Nombre Completo', key: 'nombre_completo', width: 30 },
			{ header: 'Email', key: 'email', width: 30 },
			{ header: 'Rol', key: 'rol', width: 15 },
			{ header: 'Tipo Estudiante', key: 'tipo_estudiante', width: 20 },
			{ header: 'Horas Req.', key: 'horas_requeridas', width: 15 },
			{ header: 'Hab. Asignada', key: 'hab_asignada_student', width: 20 },
			{ header: 'Turno', key: 'turno', width: 15 },
			{ header: 'Hab. Registro', key: 'hab_registro', width: 20 },
			{ header: 'Entrada (Check-in)', key: 'check_in', width: 25 },
			{ header: 'Salida (Check-out)', key: 'check_out', width: 25 },
			{ header: 'Horas Trab.', key: 'horas_trabajadas', width: 15 },
			{ header: 'Motivo Salida', key: 'motivo_salida_temprana', width: 30 },
			{ header: 'Fecha Creación', key: 'creado_en_registro', width: 25 },
		];

		// Estilar la fila de cabecera
		const headerRow = worksheet.getRow(1);
		headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
		headerRow.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: '4F46E5' } // Color Indigo-600 aproximado
		};
		headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
		headerRow.height = 30;

		// Agregar datos
		(data || []).forEach((r: any) => {
			const profile = r?.students?.profiles || null;
			worksheet.addRow({
				id_registro: r.id,
				nombre_completo: profile?.full_name || '',
				email: profile?.email || '',
				rol: profile?.role || '',
				tipo_estudiante: r?.students?.student_type || '',
				horas_requeridas: r?.students?.required_hours ?? '',
				hab_asignada_student: r?.students?.assigned_room ?? '',
				turno: r.shift ?? '',
				hab_registro: r.room ?? '',
				check_in: r.check_in ? new Date(r.check_in).toLocaleString('es-MX') : '',
				check_out: r.check_out ? new Date(r.check_out).toLocaleString('es-MX') : '',
				horas_trabajadas: r.hours_worked ?? '',
				motivo_salida_temprana: r.early_departure_reason ?? '',
				creado_en_registro: r.created_at ? new Date(r.created_at).toLocaleString('es-MX') : '',
			});
		});

		// Estilar bordes para todas las celdas con datos
		worksheet.eachRow((row, rowNumber) => {
			row.eachCell((cell) => {
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' }
				};
				if (rowNumber > 1) { // Datos
					cell.alignment = { vertical: 'middle', wrapText: true };
				}
			});
		});

		// Generar buffer
		const buffer = await workbook.xlsx.writeBuffer();

		const filename = `asistencias_export_${from ? from.replace(/:/g, '-') : 'desde_inicio'}_${to ? to.replace(/:/g, '-') : 'hasta_fin'}.xlsx`;

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
		return res.status(200).send(Buffer.from(buffer));
	} catch (err) {
		console.error('Error generando Excel:', err); // Log interno solo en error grave
		return res.status(500).json({ error: 'Error generando exportación' });
	}
}
