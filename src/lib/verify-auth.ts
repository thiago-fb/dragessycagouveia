import { createServerClient } from './supabase-server'
import { isAdminEmail } from './admin-auth'

/**
 * Verifica se a requisição contém um token de sessão válido do Supabase
 * de um usuário admin (criado pelo painel, e-mail @admin.gg.internal).
 * Qualquer outra conta do Supabase Auth é recusada.
 * O cliente envia o token no header: Authorization: Bearer <access_token>
 */
export async function verifyAuth(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false

  const token = authHeader.slice(7)
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser(token)
  return !!user && isAdminEmail(user.email)
}
