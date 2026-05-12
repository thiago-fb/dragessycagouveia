'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toEmail } from '@/lib/admin-auth'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(username),
      password,
    })

    if (error) {
      setError('Usuário ou senha incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="bg-brand-white w-full max-w-sm p-10">
        <div className="text-center mb-10">
          <p className="font-playfair text-3xl text-brand-bronze tracking-widest mb-1">GG</p>
          <p className="font-jost text-xs tracking-[0.2em] uppercase text-brand-dark/40">
            Dashboard Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">
              Usuário
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Usuário"
              className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                         outline-none px-4 py-3 font-jost text-sm text-brand-dark placeholder:text-brand-dark/30 transition-colors"
            />
          </div>

          <div>
            <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                         outline-none px-4 py-3 font-jost text-sm text-brand-dark transition-colors"
            />
          </div>

          {error && (
            <p className="font-jost text-sm text-red-500">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}