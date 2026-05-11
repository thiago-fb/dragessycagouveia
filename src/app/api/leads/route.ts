import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone } = await req.json()

    if (!nome?.trim() || !email?.trim() || !telefone?.trim()) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando.' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('leads')
      .insert({ nome: nome.trim(), email: email.trim(), telefone: telefone.trim() })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[leads] POST error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('[leads] GET error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}