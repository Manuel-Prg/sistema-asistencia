import { NextRequest, NextResponse } from 'next/server';
import { create_supabase_client_for_token } from '@/lib/supabase_server';

export async function POST(req: NextRequest) {
    try {
        const auth_header = req.headers.get('authorization') || '';
        const match = auth_header.match(/^Bearer (.+)$/);
        if (!match) {
            return NextResponse.json({ error: 'Missing Authorization Bearer token' }, { status: 401 });
        }
        const access_token = match[1];

        // Validar fechas opcionales
        const { from, to } = await req.json().catch(() => ({}));

        let from_iso: string | null = null;
        let to_iso: string | null = null;
        if (from) {
            const d = new Date(from);
            if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid from date' }, { status: 400 });
            from_iso = d.toISOString();
        }
        if (to) {
            const d = new Date(to);
            if (isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid to date' }, { status: 400 });
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
            console.error('Error fetching data:', error);
            return NextResponse.json({ error: 'Error querying attendance records' }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
