import { createServerClient } from './supabase-server'

/**
 * Verifica se a requisição contém um token de sessão válido do Supabase.
 * O cliente envia o token no header: Authorization: Bearer <access_token>
 */
export async function verifyAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false

  const token = authHeader.slice(7)
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  return !!user
}