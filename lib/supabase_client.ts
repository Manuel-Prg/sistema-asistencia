import { createClient } from '@supabase/supabase-js';
import { get_env_variables } from './env';

/**
 * Crea cliente Supabase usando variables de entorno validadas
 * @returns {ReturnType<typeof createClient>}
 */
export const create_supabase_client = () => {
	const { supabase_url, supabase_anon_key } = get_env_variables();
	return createClient(supabase_url, supabase_anon_key);
};

/**
 * Cliente compartido para la app
 */
export const supabase_client = create_supabase_client();
