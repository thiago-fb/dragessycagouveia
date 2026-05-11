import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const tipo       = body.tipo
    const session_id = body.session_id || crypto.randomUUID()
    if (!tipo) {
      return NextResponse.json({ error: 'Campo tipo obrigatório.' }, { status: 400 })
    }
    const supabase = createServerClient()
    const { error } = await supabase.from('events').insert({ tipo, session_id })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[events] POST error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}