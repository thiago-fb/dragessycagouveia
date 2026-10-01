import { supabase } from './supabase'

/**
 * fetch() que envia o token da sessão do admin no header Authorization,
 * exigido pelas rotas protegidas por verifyAuth().
 */
export async function authFetch(input: string, init: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${session?.access_token ?? ''}`)
  return fetch(input, { ...init, headers })
}
