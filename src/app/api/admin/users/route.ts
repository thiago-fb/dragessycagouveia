import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'

export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const supabase = createServerClient()
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    return NextResponse.json({
      users: users.map(u => ({
        id:              u.id,
        email:           u.email,
        created_at:      u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      })),
    })
  } catch (err) {
    console.error('[admin/users] GET error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { email, password } = await req.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase.auth.admin.createUser({
      email:         email.trim(),
      password,
      email_confirm: true,
    })
    if (error) throw error

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } })
  } catch (err: unknown) {
    console.error('[admin/users] POST error:', err)
    const message = err instanceof Error ? err.message : 'Erro interno.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}