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
 * Logger condicional - solo en desarrollo
 */
const isDev = process.env.NODE_ENV === 'development'
const logError = isDev ? console.error : () => {}

/**
 * Obtiene el rol de un usuario de forma segura en el middleware
 */
export async function getUserRole(userId: string): Promise<'student' | 'supervisor' | null> {
  try {
    const supabase = getSupabaseMiddlewareClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) {
      logError('[MIDDLEWARE HELPER] Error fetching user role:', error)
      return null
    }
    
    if (!data) {
      logError('[MIDDLEWARE HELPER] No profile found for user:', userId)
      return null
    }
    
    return data.role as 'student' | 'supervisor'
  } catch (error) {
    logError('[MIDDLEWARE HELPER] Exception fetching user role:', error)
    return null
  }
}