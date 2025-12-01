import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { get_env_variables } from './env';

/**
 * Crea un cliente Supabase que ejecutará consultas con el token del usuario.
 * De esta forma las consultas respetan RLS (auth.uid() corresponde al token).
 * @param {string} access_token - access token del usuario (Bearer)
 * @returns {SupabaseClient} cliente Supabase configurado
 */
export const create_supabase_client_for_token = (access_token: string): SupabaseClient => {
	const { supabase_url, supabase_anon_key } = get_env_variables();
	// Se usa la ANON key junto con el header Authorization para que PostgREST / RLS
	// reconozcan al usuario en la petición. No se expone service role aquí.
	return createClient(supabase_url, supabase_anon_key, {
		global: {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	});
};
