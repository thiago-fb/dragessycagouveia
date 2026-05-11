'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Loader2, Save, CheckCircle, Plus, Pencil, Trash2,
  X, Check, Upload, ImageIcon,
} from 'lucide-react'
import Image from 'next/image'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Config { [key: string]: string }

interface Procedure {
  id: string
  nome: string
  descricao: string
  ordem: number
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type Tab = 'geral' | 'procedimentos' | 'sobre' | 'agenda' | 'rodape'

// ─── Field definitions ───────────────────────────────────────────────────────

const GERAL_FIELDS = [
  { key: 'hero_linha1',       label: 'Hero — linha 1',              hint: 'Ex: Realce sua' },
  { key: 'hero_linha2_bold',  label: 'Hero — linha 2 (negrito)',    hint: 'Ex: beleza natural,' },
  { key: 'hero_linha3',       label: 'Hero — linha 3',              hint: 'Ex: agora mesmo.' },
  { key: 'hero_subtitulo',    label: 'Hero — subtítulo',            hint: 'Texto abaixo do título' },
  { key: 'whatsapp_link',     label: 'WhatsApp — link',             hint: 'https://wa.me/55...' },
  { key: 'whatsapp_numero',   label: 'WhatsApp — número exibido',   hint: '+55 (82) 9 9999-9999' },
  { key: 'horario_atendimento', label: 'Horário de atendimento',    hint: 'Segunda a Sexta, 8h às 18h' },
  { key: 'instagram_url',     label: 'Instagram — URL',             hint: 'https://instagram.com/...' },
  { key: 'instagram_handle',  label: 'Instagram — handle',          hint: '@gessycagouveia' },
  { key: 'endereco',          label: 'Endereço',                    hint: 'Exibido no rodapé' },
]

const SOBRE_TEXT_FIELDS = [
  { key: 'sobre_titulo1',         label: 'Título — parte 1',            hint: 'Ex: Beleza que é' },
  { key: 'sobre_titulo_destaque', label: 'Título — palavra destaque',    hint: 'Ex: sua (aparece em bronze)' },
  { key: 'sobre_texto',           label: 'Parágrafo de apresentação',    textarea: true },
  { key: 'sobre_pilar1_nome',     label: 'Pilar 1 — nome',              hint: 'Ex: Técnica' },
  { key: 'sobre_pilar1_desc',     label: 'Pilar 1 — descrição',         textarea: true },
  { key: 'sobre_pilar2_nome',     label: 'Pilar 2 — nome',              hint: 'Ex: Harmonia' },
  { key: 'sobre_pilar2_desc',     label: 'Pilar 2 — descrição',         textarea: true },
  { key: 'sobre_pilar3_nome',     label: 'Pilar 3 — nome',              hint: 'Ex: Confiança' },
  { key: 'sobre_pilar3_desc',     label: 'Pilar 3 — descrição',         textarea: true },
  { key: 'sobre_pill1',           label: 'Badge 1',                     hint: 'Ex: Equilíbrio que transforma' },
  { key: 'sobre_pill2',           label: 'Badge 2',                     hint: 'Ex: Harmonia que revela' },
  { key: 'sobre_card_titulo',     label: 'Card flutuante — título',      hint: 'Ex: Agende sua Avaliação e ganhe 10%' },
  { key: 'sobre_card_subtitulo',  label: 'Card flutuante — subtexto',    hint: 'Ex: Acesse no WhatsApp...' },
]

const AGENDA_FIELDS = [
  { key: 'agenda_tag',      label: 'Tag da seção',   hint: 'Ex: Próximo passo' },
  { key: 'agenda_titulo',   label: 'Título',          hint: 'Ex: Agende sua avaliação' },
  { key: 'agenda_subtitulo', label: 'Subtítulo (itálico)', hint: 'Ex: e sinta a diferença.' },
  { key: 'agenda_botao',    label: 'Texto do botão', hint: 'Ex: Agende sua avaliação' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Field({
  fieldKey, label, hint, textarea, value, onChange,
}: {
  fieldKey: string
  label: string
  hint?: string
  textarea?: boolean
  value: string
  onChange: (k: string, v: string) => void
}) {
  return (
    <div>
      <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-1">
        {label}
      </label>
      {hint && <p className="font-jost text-xs text-brand-dark/40 mb-2">{hint}</p>}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          rows={3}
          className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze
                     focus:bg-brand-white outline-none px-4 py-3 font-jost text-sm
                     text-brand-dark resize-y transition-colors"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze
                     focus:bg-brand-white outline-none px-4 py-3 font-jost text-sm
                     text-brand-dark transition-colors"
        />
      )}
    </div>
  )
}

function SaveBar({
  status, onSave,
}: { status: SaveStatus; onSave: () => void }) {
  return (
    <div className="flex justify-end mt-8">
      <button
        onClick={onSave}
        disabled={status === 'saving'}
        className="btn-primary text-xs gap-2 flex items-center disabled:opacity-60"
      >
        {status === 'saving' ? <><Loader2 size={14} className="animate-spin" /> Salvando…</>
          : status === 'saved'  ? <><CheckCircle size={14} /> Salvo!</>
          : <><Save size={14} /> Salvar alterações</>}
      </button>
    </div>
  )
}

// ─── Image uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  label, slot, value, onChange,
}: {
  label: string
  slot: string
  value: string
  onChange: (url: string) => void
}) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('slot', slot)
      const res  = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">
        {label}
      </label>
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="w-24 h-24 bg-brand-cream border border-brand-cream flex items-center justify-center flex-shrink-0 overflow-hidden rounded-lg">
          {value ? (
            <Image src={value} alt={label} width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <ImageIcon size={24} className="text-brand-dark/20" />
          )}
        </div>
        {/* Actions */}
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-ghost text-xs py-2 px-4 gap-2 flex items-center disabled:opacity-60"
          >
            {uploading
              ? <><Loader2 size={13} className="animate-spin" /> Enviando…</>
              : <><Upload size={13} /> {value ? 'Trocar imagem' : 'Enviar imagem'}</>}
          </button>
          {value && (
            <p className="font-jost text-[11px] text-brand-dark/40 mt-2 break-all">{value}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ConfiguracoesPage() {
  const [tab,        setTab]        = useState<Tab>('geral')
  const [config,     setConfig]     = useState<Config>({})
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  // Procedure modal
  const [procModal,  setProcModal]  = useState(false)
  const [editProc,   setEditProc]   = useState<Procedure | null>(null)
  const [procForm,   setProcForm]   = useState({ nome: '', descricao: '' })
  const [procSaving, setProcSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/config').then((r) => r.json()),
      fetch('/api/procedures').then((r) => r.json()),
    ]).then(([cfg, procs]) => {
      setConfig(cfg ?? {})
      setProcedures(Array.isArray(procs) ? procs : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function handleConfig(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSaveConfig() {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error()
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  function openCreate() {
    setEditProc(null)
    setProcForm({ nome: '', descricao: '' })
    setProcModal(true)
  }

  function openEdit(p: Procedure) {
    setEditProc(p)
    setProcForm({ nome: p.nome, descricao: p.descricao })
    setProcModal(true)
  }

  async function handleSaveProc() {
    if (!procForm.nome.trim() || !procForm.descricao.trim()) return
    setProcSaving(true)
    try {
      if (editProc) {
        await fetch(`/api/procedures/${editProc.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...procForm, ordem: editProc.ordem }),
        })
        setProcedures((prev) =>
          prev.map((p) => p.id === editProc.id ? { ...p, ...procForm } : p)
        )
      } else {
        const res  = await fetch('/api/procedures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...procForm, ordem: procedures.length + 1 }),
        })
        const novo = await res.json()
        setProcedures((prev) => [...prev, novo])
      }
      setProcModal(false)
    } finally {
      setProcSaving(false)
    }
  }

  async function handleDeleteProc(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/procedures/${id}`, { method: 'DELETE' })
      setProcedures((prev) => prev.filter((p) => p.id !== id))
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-brand-bronze/40" />
      </div>
    )
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'geral',          label: 'Configuração Geral' },
    { key: 'procedimentos',  label: 'Procedimentos' },
    { key: 'sobre',          label: 'Sobre' },
    { key: 'agenda',         label: 'Agenda' },
    { key: 'rodape',         label: 'Rodapé' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-3xl text-brand-dark">Configurações</h1>
        <p className="font-jost text-sm text-brand-dark/50 mt-1">
          Gerencie os textos, imagens e dados da landing page
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-brand-cream mb-8 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`font-jost text-xs tracking-widest uppercase px-5 py-3 border-b-2 whitespace-nowrap transition-colors
              ${tab === key
                ? 'border-brand-bronze text-brand-bronze'
                : 'border-transparent text-brand-dark/40 hover:text-brand-dark/70'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Configuração Geral ─────────────────────────────────────────── */}
      {tab === 'geral' && (
        <div className="bg-brand-white p-8 space-y-6">
          {GERAL_FIELDS.map((f) => (
            <Field
              key={f.key}
              fieldKey={f.key}
              label={f.label}
              hint={f.hint}
              value={config[f.key] ?? ''}
              onChange={handleConfig}
            />
          ))}
          <SaveBar status={saveStatus} onSave={handleSaveConfig} />
        </div>
      )}

      {/* ── Procedimentos ─────────────────────────────────────────────── */}
      {tab === 'procedimentos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openCreate} className="btn-primary text-xs py-3 gap-2 flex items-center">
              <Plus size={14} /> Novo procedimento
            </button>
          </div>

          <div className="bg-brand-white overflow-hidden">
            {procedures.length === 0 ? (
              <p className="p-12 text-center font-jost text-sm text-brand-dark/40">
                Nenhum procedimento cadastrado.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-cream">
                    <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-bronze/60">Ordem</th>
                    <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-bronze/60">Nome</th>
                    <th className="text-left px-6 py-4 font-jost text-xs tracking-widest uppercase text-brand-bronze/60 hidden md:table-cell">Descrição</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {procedures.map((p, i) => (
                    <tr key={p.id} className={`border-b border-brand-cream last:border-0 ${i % 2 === 0 ? '' : 'bg-brand-cream/30'}`}>
                      <td className="px-6 py-4 font-jost text-sm text-brand-dark/40 w-16">{p.ordem}</td>
                      <td className="px-6 py-4 font-jost text-sm text-brand-dark font-medium">{p.nome}</td>
                      <td className="px-6 py-4 font-jost text-sm text-brand-dark/60 hidden md:table-cell max-w-xs truncate">{p.descricao}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 text-brand-dark/30 hover:text-brand-bronze transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          {confirmId === p.id ? (
                            <div className="flex items-center gap-1">
                              <span className="font-jost text-xs text-brand-dark/50 mr-1">Confirmar?</span>
                              <button
                                onClick={() => handleDeleteProc(p.id)}
                                disabled={deletingId === p.id}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                {deletingId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              </button>
                              <button onClick={() => setConfirmId(null)} className="p-2 text-brand-dark/30 hover:text-brand-dark transition-colors">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmId(p.id)}
                              className="p-2 text-brand-dark/30 hover:text-red-500 transition-colors"
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
        </div>
      )}

      {/* ── Sobre ─────────────────────────────────────────────────────── */}
      {tab === 'sobre' && (
        <div className="bg-brand-white p-8 space-y-8">
          {/* Imagens */}
          <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-brand-cream">
            <ImageUploader
              label="Foto principal"
              slot="gessyca-sobre"
              value={config['sobre_imagem_principal'] ?? ''}
              onChange={(url) => handleConfig('sobre_imagem_principal', url)}
            />
            <ImageUploader
              label="Foto do procedimento (card flutuante)"
              slot="procedimento-sobre"
              value={config['sobre_imagem_proc'] ?? ''}
              onChange={(url) => handleConfig('sobre_imagem_proc', url)}
            />
          </div>

          {/* Textos */}
          <div className="space-y-6">
            {SOBRE_TEXT_FIELDS.map((f) => (
              <Field
                key={f.key}
                fieldKey={f.key}
                label={f.label}
                hint={f.hint}
                textarea={f.textarea}
                value={config[f.key] ?? ''}
                onChange={handleConfig}
              />
            ))}
          </div>

          <SaveBar status={saveStatus} onSave={handleSaveConfig} />
        </div>
      )}

      {/* ── Agenda ────────────────────────────────────────────────────── */}
      {tab === 'agenda' && (
        <div className="bg-brand-white p-8 space-y-6">
          {AGENDA_FIELDS.map((f) => (
            <Field
              key={f.key}
              fieldKey={f.key}
              label={f.label}
              hint={f.hint}
              value={config[f.key] ?? ''}
              onChange={handleConfig}
            />
          ))}
          <SaveBar status={saveStatus} onSave={handleSaveConfig} />
        </div>
      )}

      {/* ── Rodapé ────────────────────────────────────────────────────── */}
      {tab === 'rodape' && (
        <div className="bg-brand-white p-8">
          <p className="font-jost text-sm text-brand-dark/60 mb-6 leading-relaxed">
            O rodapé usa os dados cadastrados em <strong>Configuração Geral</strong>.
            Abaixo um resumo do que está configurado atualmente.
          </p>
          <div className="space-y-4">
            {[
              { label: 'WhatsApp',   value: config['whatsapp_numero'] },
              { label: 'Horário',    value: config['horario_atendimento'] },
              { label: 'Instagram',  value: config['instagram_handle'] },
              { label: 'Endereço',   value: config['endereco'] },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 border-b border-brand-cream pb-4 last:border-0">
                <span className="font-jost text-xs tracking-widest uppercase text-brand-bronze/60 w-28 flex-shrink-0 pt-0.5">
                  {label}
                </span>
                <span className="font-jost text-sm text-brand-dark/80">
                  {value || <span className="text-brand-dark/30 italic">não configurado</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={() => setTab('geral')}
              className="btn-ghost text-xs py-3 gap-2 flex items-center"
            >
              Editar em Configuração Geral
            </button>
          </div>
        </div>
      )}

      {/* ── Modal procedimento ────────────────────────────────────────── */}
      {procModal && (
        <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setProcModal(false)}>
          <div className="bg-brand-white w-full max-w-lg p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProcModal(false)} className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-bronze transition-colors">
              <X size={20} />
            </button>
            <span className="section-tag">{editProc ? 'Editar' : 'Novo'} procedimento</span>
            <h2 className="font-playfair text-2xl text-brand-dark mb-6">
              {editProc ? 'Editar procedimento' : 'Adicionar procedimento'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">Nome</label>
                <input
                  type="text"
                  value={procForm.nome}
                  onChange={(e) => setProcForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Harmonização Facial"
                  className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white outline-none px-4 py-3 font-jost text-sm text-brand-dark transition-colors"
                />
              </div>
              <div>
                <label className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2">Descrição</label>
                <textarea
                  value={procForm.descricao}
                  onChange={(e) => setProcForm((p) => ({ ...p, descricao: e.target.value }))}
                  rows={4}
                  placeholder="Descreva o procedimento…"
                  className="w-full border border-brand-cream bg-brand-cream focus:border-brand-bronze focus:bg-brand-white outline-none px-4 py-3 font-jost text-sm text-brand-dark resize-y transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setProcModal(false)} className="btn-ghost text-xs py-3 flex-1 justify-center">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProc}
                  disabled={procSaving || !procForm.nome.trim() || !procForm.descricao.trim()}
                  className="btn-primary text-xs py-3 flex-1 justify-center gap-2 flex items-center disabled:opacity-60"
                >
                  {procSaving && <Loader2 size={14} className="animate-spin" />}
                  {editProc ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}