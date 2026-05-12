'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toEmail, toUsername } from '@/lib/admin-auth'
import { Loader2, Plus, Pencil, Trash2, X, ShieldCheck } from 'lucide-react'

interface AdminUser {
  id:              string
  email:           string
  created_at:      string
  last_sign_in_at: string | null
}

type ModalMode = 'add' | 'edit'

interface FormState {
  username: string
  password: string
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token ?? ''}` }
}

export default function UsuariosPage() {
  const [users, setUsers]           = useState<AdminUser[]>([])
  const [loading, setLoading]       = useState(true)
  const [currentId, setCurrentId]   = useState<string | null>(null)

  const [modal, setModal]           = useState<{ mode: ModalMode; user?: AdminUser } | null>(null)
  const [form, setForm]             = useState<FormState>({ username: '', password: '' })
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleting, setDeleting]         = useState(false)

  async function loadUsers() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setCurrentId(session?.user?.id ?? null)

    const res = await fetch('/api/admin/users', { headers: await authHeader() })
    if (res.ok) {
      const json = await res.json()
      setUsers(json.users)
    }
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  function openAdd() {
    setForm({ username: '', password: '' })
    setFormError('')
    setModal({ mode: 'add' })
  }

  function openEdit(user: AdminUser) {
    setForm({ username: toUsername(user.email), password: '' })
    setFormError('')
    setModal({ mode: 'edit', user })
  }

  async function handleSave() {
    setSaving(true)
    setFormError('')

    if (!form.username.trim()) {
      setFormError('Informe um nome de usuário.')
      setSaving(false)
      return
    }

    const headers = await authHeader()
    let res: Response

    if (modal?.mode === 'add') {
      res = await fetch('/api/admin/users', {
        method:  'POST',
        headers,
        body:    JSON.stringify({ email: toEmail(form.username), password: form.password }),
      })
    } else {
      const body: Record<string, string> = {}
      if (form.username) body.email    = toEmail(form.username)
      if (form.password) body.password = form.password
      res = await fetch(`/api/admin/users/${modal!.user!.id}`, {
        method:  'PATCH',
        headers,
        body:    JSON.stringify(body),
      })
    }

    const json = await res.json()
    if (!res.ok) {
      setFormError(json.error ?? 'Erro ao salvar.')
      setSaving(false)
      return
    }

    setModal(null)
    setSaving(false)
    loadUsers()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)

    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
      method:  'DELETE',
      headers: await authHeader(),
    })

    if (!res.ok) {
      const json = await res.json()
      alert(json.error ?? 'Erro ao excluir.')
    }

    setDeleteTarget(null)
    setDeleting(false)
    loadUsers()
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-2xl text-brand-dark mb-1">Usuários Admin</h1>
          <p className="font-jost text-sm text-brand-dark/50">Gerencie os acessos ao painel.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Novo usuário
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-brand-bronze" />
        </div>
      ) : (
        <div className="bg-brand-white rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-cream">
                <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-dark/40">Usuário</th>
                <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-dark/40">Criado em</th>
                <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-dark/40">Último acesso</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-brand-cream/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-jost text-sm text-brand-dark font-medium">
                        {toUsername(u.email)}
                      </span>
                      {u.id === currentId && (
                        <span className="inline-flex items-center gap-1 bg-brand-bronze/10 text-brand-bronze text-[10px] font-jost px-2 py-0.5 rounded-full">
                          <ShieldCheck size={10} /> você
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark/50">{fmt(u.created_at)}</td>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark/50">{fmt(u.last_sign_in_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 text-brand-dark/30 hover:text-brand-bronze transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => u.id !== currentId && setDeleteTarget(u)}
                        disabled={u.id === currentId}
                        className="p-2 text-brand-dark/30 hover:text-red-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                        title={u.id === currentId ? 'Não é possível excluir seu próprio acesso' : 'Excluir'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal adicionar / editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-white w-full max-w-sm p-8 relative shadow-2xl rounded-lg">
            <button
              onClick={() => setModal(null)}
              className="absolute top-4 right-4 text-brand-dark/30 hover:text-brand-bronze transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="font-playfair text-xl text-brand-dark mb-6">
              {modal.mode === 'add' ? 'Novo usuário' : 'Editar usuário'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">
                  Nome de usuário *
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
                  placeholder="Usuário"
                  className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                             outline-none px-4 py-3 font-jost text-sm text-brand-dark placeholder:text-brand-dark/30 transition-colors"
                />
              </div>

              <div>
                <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">
                  {modal.mode === 'add' ? 'Senha *' : 'Nova senha (opcional)'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required={modal.mode === 'add'}
                  placeholder={modal.mode === 'add' ? 'Mínimo 6 caracteres' : 'Deixe em branco para não alterar'}
                  className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                             outline-none px-4 py-3 font-jost text-sm text-brand-dark placeholder:text-brand-dark/30 transition-colors"
                />
              </div>

              {formError && (
                <p className="font-jost text-sm text-red-500">{formError}</p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full justify-center disabled:opacity-60 mt-2"
              >
                {saving && <Loader2 size={15} className="animate-spin" />}
                {modal.mode === 'add' ? 'Criar usuário' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-white w-full max-w-sm p-8 relative shadow-2xl rounded-lg">
            <h2 className="font-playfair text-xl text-brand-dark mb-2">Excluir usuário</h2>
            <p className="font-jost text-sm text-brand-dark/60 mb-6">
              Tem certeza que deseja excluir <strong>{toUsername(deleteTarget.email)}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-brand-cream bg-brand-cream text-brand-dark font-jost text-sm py-3 hover:bg-brand-cream/60 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white font-jost text-sm py-3 hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 size={15} className="animate-spin" />}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}