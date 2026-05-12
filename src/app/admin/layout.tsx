'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BarChart2, Settings, LogOut, Users, ShieldCheck } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
      setChecking(false)
    })
  }, [pathname, router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (checking) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <p className="font-jost text-brand-dark/40 text-sm tracking-widest">Carregando...</p>
    </div>
  )

  const navItems = [
    { href: '/admin/visao-geral',   label: 'Visão Geral',    icon: BarChart2 },
    { href: '/admin/dashboard',     label: 'Leads',          icon: Users },
    { href: '/admin/configuracoes', label: 'Configurações',  icon: Settings },
    { href: '/admin/usuarios',      label: 'Usuários',       icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-brand-cream flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-dark flex flex-col">
        <div className="p-6 border-b border-brand-white/10">
          <p className="font-playfair text-xl text-brand-gold tracking-widest">GG</p>
          <p className="font-jost text-xs tracking-wider text-brand-white/30 mt-1 uppercase">
            Admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 font-jost text-sm transition-colors ${pathname === href
                  ? 'bg-brand-bronze/20 text-brand-gold'
                  : 'text-brand-white/50 hover:text-brand-white hover:bg-brand-white/5'
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full font-jost text-sm text-brand-white/40 hover:text-brand-white transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}