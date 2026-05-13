'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BarChart2, Settings, LogOut, Users, ShieldCheck, Menu, X } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
      setChecking(false)
    })
  }, [pathname, router])

  // Fecha o drawer ao mudar de página
  useEffect(() => { setDrawerOpen(false) }, [pathname])

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
    { href: '/admin/visao-geral',   label: 'Visão Geral',   icon: BarChart2 },
    { href: '/admin/dashboard',     label: 'Leads',         icon: Users },
    { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
    { href: '/admin/usuarios',      label: 'Usuários',      icon: ShieldCheck },
  ]

  const NavLinks = () => (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 font-jost text-sm transition-colors rounded-sm ${
              pathname === href
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
    </>
  )

  return (
    <div className="min-h-screen bg-brand-cream flex">

      {/* ── Sidebar desktop (md+) ─────────────────────── */}
      <aside className="hidden md:flex w-56 bg-brand-dark flex-col flex-shrink-0">
        <div className="p-6 border-b border-brand-white/10">
          <p className="font-playfair text-xl text-brand-gold tracking-widest">GG</p>
          <p className="font-jost text-xs tracking-wider text-brand-white/30 mt-1 uppercase">Admin</p>
        </div>
        <NavLinks />
      </aside>

      {/* ── Layout mobile ─────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top bar mobile */}
        <header className="md:hidden flex items-center justify-between bg-brand-dark px-4 py-3 flex-shrink-0">
          <p className="font-playfair text-lg text-brand-gold tracking-widest">GG</p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-brand-white/60 hover:text-brand-white transition-colors p-1"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>

      {/* ── Drawer mobile ─────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Painel deslizante */}
          <aside className="fixed top-0 left-0 h-full w-64 bg-brand-dark z-50 flex flex-col md:hidden
                            animate-[slideInLeft_0.25s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-brand-white/10">
              <div>
                <p className="font-playfair text-xl text-brand-gold tracking-widest">GG</p>
                <p className="font-jost text-xs tracking-wider text-brand-white/30 mt-0.5 uppercase">Admin</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-brand-white/40 hover:text-brand-white transition-colors p-1"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>
            <NavLinks />
          </aside>
        </>
      )}

    </div>
  )
}