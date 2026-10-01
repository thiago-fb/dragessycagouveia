import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/verify-auth'

const TIPOS_PERMITIDOS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
}
const TAMANHO_MAXIMO = 5 * 1024 * 1024 // 5 MB, mesmo limite do bucket

export async function POST(req: NextRequest) {
  if (!(await verifyAuth(req))) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  try {
    const form = await req.formData()
    const file = form.get('file')
    // slot vira parte do nome do arquivo — só letras minúsculas, números, _ e -
    const slot = String(form.get('slot') || 'imagem').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'imagem'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    // Extensão definida pelo tipo do arquivo, não pelo nome enviado
    const ext = TIPOS_PERMITIDOS[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Envie uma imagem JPG, PNG ou WebP.' }, { status: 400 })
    }
    if (file.size > TAMANHO_MAXIMO) {
      return NextResponse.json({ error: 'A imagem deve ter no máximo 5 MB.' }, { status: 400 })
    }

    const filename = `${slot}-${Date.now()}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const supabase = createServerClient()
    const { error } = await supabase.storage
      .from('imagens')
      .upload(filename, buffer, { contentType: file.type })

    if (error) throw error

    const { data } = supabase.storage.from('imagens').getPublicUrl(filename)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    console.error('[upload] POST error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload.' }, { status: 500 })
  }
}