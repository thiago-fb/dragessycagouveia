import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { nome, descricao, ordem } = await req.json()
    if (!nome?.trim() || !descricao?.trim()) {
      return NextResponse.json({ error: 'Campos obrigatórios.' }, { status: 400 })
    }
    const supabase = createServerClient()
    const { error } = await supabase
      .from('procedures')
      .update({ nome: nome.trim(), descricao: descricao.trim(), ordem })
      .eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[procedures] PATCH error:', err)
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
    const { error } = await supabase.from('procedures').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[procedures] DELETE error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}