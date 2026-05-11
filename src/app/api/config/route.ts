import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from('config').select('chave, valor')

    if (error) throw error

    // Converte array [{chave, valor}] em objeto {chave: valor}
    const config = Object.fromEntries(data.map((row) => [row.chave, row.valor]))

    return NextResponse.json(config)
  } catch (err) {
    console.error('[config] GET error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const updates: Record<string, string> = await req.json()

    const supabase = createServerClient()

    const upserts = Object.entries(updates).map(([chave, valor]) => ({
      chave,
      valor,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('config')
      .upsert(upserts, { onConflict: 'chave' })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[config] PUT error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}