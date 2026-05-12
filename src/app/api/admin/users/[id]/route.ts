import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const { email, password } = await req.json()

    if (!email?.trim() && !password) {
      return NextResponse.json({ error: 'Informe e-mail ou senha para atualizar.' }, { status: 400 })
    }
    if (password && password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }

    const updates: { email?: string; password?: string } = {}
    if (email?.trim()) updates.email    = email.trim()
    if (password)      updates.password = password

    const supabase = createServerClient()
    const { data, error } = await supabase.auth.admin.updateUserById(id, updates)
    if (error) throw error

    return NextResponse.json({ user: { id: data.user.id, email: data.user.email } })
  } catch (err: unknown) {
    console.error('[admin/users] PATCH error:', err)
    const message = err instanceof Error ? err.message : 'Erro interno.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const supabase = createServerClient()
    const { error } = await supabase.auth.admin.deleteUser(id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('[admin/users] DELETE error:', err)
    const message = err instanceof Error ? err.message : 'Erro interno.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}