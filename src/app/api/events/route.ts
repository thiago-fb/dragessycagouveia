import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const TIPOS_VALIDOS = new Set(['modal_open', 'lead_submitted', 'modal_closed'])
const UUID_REGEX    = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(req: NextRequest) {
  try {
    const body       = await req.json()
    const tipo       = body?.tipo
    const session_id = UUID_REGEX.test(String(body?.session_id)) ? body.session_id : crypto.randomUUID()
    if (!TIPOS_VALIDOS.has(tipo)) {
      return NextResponse.json({ error: 'Tipo de evento inválido.' }, { status: 400 })
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
