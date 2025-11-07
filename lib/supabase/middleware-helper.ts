// lib/supabase/middleware-helper.ts
import { createClient } from "@supabase/supabase-js"

/**
 * Cliente especial para el middleware que puede leer profiles
 * Usa service role solo para consultas de autorización
 */
export function getSupabaseMiddlewareClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Obtiene el rol de un usuario de forma segura en el middleware
 */
export async function getUserRole(userId: string): Promise<'student' | 'supervisor' | null> {
  console.log('[MIDDLEWARE HELPER] Getting role for user:', userId)
  
  try {
    const supabase = getSupabaseMiddlewareClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[MIDDLEWARE HELPER] Error fetching user role:', error)
      return null
    }
    
    if (!data) {
      console.error('[MIDDLEWARE HELPER] No profile found for user:', userId)
      return null
    }

    console.log('[MIDDLEWARE HELPER] Role found:', data.role)
    return data.role as 'student' | 'supervisor'
  } catch (error) {
    console.error('[MIDDLEWARE HELPER] Exception fetching user role:', error)
    return null
  }
}