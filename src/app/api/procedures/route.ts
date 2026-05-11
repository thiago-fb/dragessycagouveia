import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('procedures')
      .select('*')
      .order('ordem', { ascending: true })
    if (error) throw error
    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[procedures] GET error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nome, descricao, ordem } = await req.json()
    if (!nome?.trim() || !descricao?.trim()) {
      return NextResponse.json({ error: 'Campos obrigatórios.' }, { status: 400 })
    }
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('procedures')
      .insert({ nome: nome.trim(), descricao: descricao.trim(), ordem: ordem ?? 0 })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error('[procedures] POST error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}