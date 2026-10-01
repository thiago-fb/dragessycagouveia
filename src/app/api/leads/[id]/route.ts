import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'
import { normalizeLead, validateLead } from '@/lib/lead-validation'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const lead   = normalizeLead(await req.json())
    const errors = validateLead(lead, { exigirSobrenome: false })

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Dados inválidos.', errors }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[leads] PATCH error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
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
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[leads] DELETE error:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}