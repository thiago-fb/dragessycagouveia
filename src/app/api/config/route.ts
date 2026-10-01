import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'

const CAMPOS_URL = new Set(['whatsapp_link', 'instagram_url', 'sobre_imagem_principal', 'sobre_imagem_proc'])

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
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const updates: unknown = await req.json()
    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
    }

    for (const [chave, valor] of Object.entries(updates)) {
      if (!/^[a-z0-9_]{1,60}$/.test(chave) || typeof valor !== 'string' || valor.length > 5000) {
        return NextResponse.json({ error: `Campo inválido: ${chave.slice(0, 60)}` }, { status: 400 })
      }
      // Campos de link/imagem: só https (bloqueia javascript: e afins)
      if (CAMPOS_URL.has(chave) && valor && !/^https:\/\/[^\s]+$/.test(valor)) {
        return NextResponse.json({ error: `O campo ${chave} precisa ser um link começando com https://` }, { status: 400 })
      }
    }

    const supabase = createServerClient()

    const upserts = Object.entries(updates as Record<string, string>).map(([chave, valor]) => ({
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