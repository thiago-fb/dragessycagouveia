import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'
import { normalizeLead, validateLead } from '@/lib/lead-validation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot: campo invisível que só robôs preenchem. Finge sucesso e descarta.
    if (body?.website) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    // Lead criado pelo admin (logado) pode ter só o primeiro nome
    const isAdmin = req.headers.has('Authorization') && (await verifyAuth(req))
    const lead    = normalizeLead(body ?? {})
    const errors  = validateLead(lead, { exigirSobrenome: !isAdmin })

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Dados inválidos.', errors }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase
      .from('leads')
      .insert(lead)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[leads] POST error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

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