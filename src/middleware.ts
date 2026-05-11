import { NextRequest, NextResponse } from 'next/server'

// A autenticação do admin é verificada client-side no layout (admin/layout.tsx)
// O Supabase v2 armazena o token em localStorage, não em cookies de request,
// por isso a proteção via middleware server-side não funciona com o cliente padrão.
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}