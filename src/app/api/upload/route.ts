import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const slot = (form.get('slot') as string) || 'imagem'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const ext      = file.name.split('.').pop() ?? 'jpg'
    const filename = `${slot}-${Date.now()}.${ext}`
    const buffer   = Buffer.from(await file.arrayBuffer())

    const supabase = createServerClient()
    const { error } = await supabase.storage
      .from('imagens')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) throw error

    const { data } = supabase.storage.from('imagens').getPublicUrl(filename)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    console.error('[upload] POST error:', err)
    return NextResponse.json({ error: 'Erro ao fazer upload.' }, { status: 500 })
  }
}