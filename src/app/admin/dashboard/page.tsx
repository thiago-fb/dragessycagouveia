'use client'

import { useEffect, useState } from 'react'
import { Download, Search, Plus, Pencil, Trash2, X, Loader2, Check } from 'lucide-react'

interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  origem: string
  created_at: string
}

interface FormState {
  nome: string
  email: string
  telefone: string
}

type ModalMode = 'create' | 'edit'

const EMPTY_FORM: FormState = { nome: '', email: '', telefone: '' }

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal de criar/editar
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Confirmação de exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  async function fetchLeads() {
    const res = await fetch('/api/leads')
    const data = await res.json()
    setLeads(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [])

  const filtered = leads.filter(
    (l) =>
      l.nome.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.telefone.includes(search)
  )

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function openCreate() {
    setForm(EMPTY_FORM)
    setModalMode('create')
    setEditingId(null)
    setSaveError('')
    setModalOpen(true)
  }

  function openEdit(lead: Lead) {
    setForm({ nome: lead.nome, email: lead.email, telefone: lead.telefone })
    setModalMode('edit')
    setEditingId(lead.id)
    setSaveError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSaveError('')
  }

  async function handleSave() {
    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
      setSaveError('Preencha todos os campos.')
      return
    }
    setSaving(true)
    setSaveError('')

    try {
      const url = modalMode === 'edit' ? `/api/leads/${editingId}` : '/api/leads'
      const method = modalMode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      await fetchLeads()
      closeModal()
    } catch {
      setSaveError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } finally {
      setDeletingId(null)
      setDeleteConfirmId(null)
    }
  }

  function downloadCSV() {
    const header = 'Nome,Email,Telefone,Data\n'
    const rows = filtered
      .map((l) => `"${l.nome}","${l.email}","${l.telefone}","${formatDate(l.created_at)}"`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-gessyca-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl text-brand-dark">Leads</h1>
          <p className="font-jost text-sm text-brand-dark/50 mt-1">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} cadastrado{leads.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCSV}
            disabled={filtered.length === 0}
            className="btn-ghost text-xs py-3 gap-2 flex items-center disabled:opacity-40"
          >
            <Download size={14} /> Exportar CSV
          </button>
          <button onClick={openCreate} className="btn-primary text-xs py-3 gap-2 flex items-center">
            <Plus size={14} /> Novo lead
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" />
        <input
          type="text"
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-brand-white border border-brand-cream pl-11 pr-4 py-3
                     font-jost text-sm text-brand-dark placeholder:text-brand-dark/30
                     focus:border-brand-bronze outline-none transition-colors"
        />
      </div>

      {/* Tabela */}
      <div className="bg-brand-white overflow-hidden">
        {loading ? (
          <div className="p-12 text-center font-jost text-sm text-brand-dark/40">Carregando leads...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center font-jost text-sm text-brand-dark/40">
            {search ? 'Nenhum lead encontrado.' : 'Nenhum lead cadastrado ainda.'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-cream">
                {['Nome', 'E-mail', 'Telefone', 'Data', ''].map((col, i) => (
                  <th key={i} className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-bronze/60">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id} className={`border-b border-brand-cream last:border-0 ${i % 2 === 0 ? 'bg-brand-white' : 'bg-brand-cream/30'}`}>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark">{lead.nome}</td>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark/70">{lead.email}</td>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark/70">{lead.telefone}</td>
                  <td className="px-6 py-4 font-jost text-sm text-brand-dark/40">{formatDate(lead.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {/* Editar */}
                      <button
                        onClick={() => openEdit(lead)}
                        className="p-2 text-brand-dark/30 hover:text-brand-bronze transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Excluir — pede confirmação inline */}
                      {deleteConfirmId === lead.id ? (
                        <div className="flex items-center gap-1">
                          <span className="font-jost text-xs text-brand-dark/50 mr-1">Confirmar?</span>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            disabled={deletingId === lead.id}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                            title="Confirmar exclusão"
                          >
                            {deletingId === lead.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-2 text-brand-dark/30 hover:text-brand-dark transition-colors"
                            title="Cancelar"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(lead.id)}
                          className="p-2 text-brand-dark/30 hover:text-red-500 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal criar/editar */}
      {modalOpen && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-brand-white w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-bronze transition-colors">
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="section-tag">{modalMode === 'create' ? 'Novo lead' : 'Editar lead'}</span>
              <h2 className="font-playfair text-2xl text-brand-dark">
                {modalMode === 'create' ? 'Cadastrar lead' : 'Editar informações'}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Nome do lead' },
                { key: 'email', label: 'E-mail', type: 'email', placeholder: 'email@exemplo.com' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof FormState]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                               outline-none px-4 py-3 font-jost text-sm text-brand-dark placeholder:text-brand-dark/30 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => setForm((p) => ({ ...p, telefone: formatTelefone(e.target.value) }))}
                  placeholder="(82) 9 9999-9999"
                  className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white
                             outline-none px-4 py-3 font-jost text-sm text-brand-dark placeholder:text-brand-dark/30 transition-colors"
                />
              </div>

              {saveError && <p className="font-jost text-sm text-red-500">{saveError}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="btn-ghost text-xs py-3 flex-1 justify-center">
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary text-xs py-3 flex-1 justify-center gap-2 flex items-center disabled:opacity-60"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {modalMode === 'create' ? 'Cadastrar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}