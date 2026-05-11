import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { nome, email, telefone } = body

    if (!nome?.trim() || !email?.trim() || !telefone?.trim()) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase
      .from('leads')
      .update({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[leads] PATCH error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServerClient()
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[leads] DELETE error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}