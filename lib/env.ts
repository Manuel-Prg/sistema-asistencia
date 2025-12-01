/**
 * Valida y devuelve variables de entorno necesarias para Supabase.
 * @returns {{supabase_url:string, supabase_anon_key:string, supabase_service_role_key?:string}}
 * @throws {Error} Si faltan variables requeridas
 */
export const get_env_variables = () => {
	const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabase_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	const supabase_service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY || null;

	if (!supabase_url) {
		throw new Error('NEXT_PUBLIC_SUPABASE_URL no definida en .env');
	}
	if (!supabase_anon_key) {
		throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no definida en .env');
	}

	return {
		supabase_url,
		supabase_anon_key,
		supabase_service_role_key,
	};
};
