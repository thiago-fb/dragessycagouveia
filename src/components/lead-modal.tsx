'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2 } from 'lucide-react'
import { normalizeLead, validateLead, type LeadErrors } from '@/lib/lead-validation'

interface LeadModalProps {
  open: boolean
  onClose: () => void
  whatsappLink: string
  onSubmitSuccess?: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function LeadModal({ open, onClose, whatsappLink, onSubmitSuccess }: LeadModalProps) {
  const [form, setForm]     = useState({ nome: '', email: '', telefone: '' })
  const honeypotRef         = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!open || !mounted) return null

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function formatTelefone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (!digits) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 11)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    return value
  }

  function handleTelefone(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, telefone: formatTelefone(e.target.value) }))
    setErrors((prev) => ({ ...prev, telefone: undefined }))
  }

  // Valida ao sair do campo, só se já tiver algo digitado
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as keyof LeadErrors
    if (!form[name].trim()) return
    setErrors((prev) => ({ ...prev, [name]: validateLead(normalizeLead(form))[name] }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()

    const lead = normalizeLead(form)
    const validationErrors = validateLead(lead)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      const first = Object.keys(validationErrors)[0]
      document.getElementById(first)?.focus()
      return
    }

    setStatus('loading')

    // Abre o WhatsApp aqui, antes de qualquer await — obrigatório no mobile
    // para não ser bloqueado como popup pelo navegador
    window.open(whatsappLink, '_blank', 'noopener,noreferrer')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, website: honeypotRef.current?.value ?? '' }),
      })

      if (!res.ok) throw new Error('Erro ao salvar')

      setStatus('success')
      onSubmitSuccess?.()

      setTimeout(() => {
        onClose()
        setForm({ nome: '', email: '', telefone: '' })
        setErrors({})
        setStatus('idle')
      }, 1000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const isLoading = status === 'loading'

  function inputClass(error?: string) {
    return `w-full border bg-brand-cream focus:bg-brand-white outline-none px-4 py-3 font-jost text-sm
            text-brand-dark placeholder:text-brand-dark/30 transition-colors
            ${error ? 'border-red-400 focus:border-red-500' : 'border-brand-cream focus:border-brand-bronze'}`
  }

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-brand-white w-full max-w-md p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-bronze transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-8">
            <span className="section-tag">Primeiro passo</span>
            <h2 className="font-playfair text-3xl text-brand-dark">
              Agende sua avaliação
            </h2>
            <p className="font-jost text-sm text-brand-dark/50 mt-2 leading-relaxed">
              Preencha seus dados e você será direcionada ao WhatsApp para confirmar o horário.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Honeypot anti-robô: invisível para pessoas, robôs preenchem */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="sr-only"
            />
            <div>
              <label
                htmlFor="nome"
                className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2"
              >
                Nome completo *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? 'nome-erro' : undefined}
                onBlur={handleBlur}
                className={inputClass(errors.nome)}
              />
              {errors.nome && (
                <p id="nome-erro" className="font-jost text-xs text-red-500 mt-1.5">{errors.nome}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2"
              >
                E-mail *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-erro' : undefined}
                onBlur={handleBlur}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p id="email-erro" className="font-jost text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block font-jost text-xs tracking-widest uppercase text-brand-bronze/70 mb-2"
              >
                Telefone / WhatsApp *
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                value={form.telefone}
                onChange={handleTelefone}
                placeholder="(82) 9 9999-9999"
                aria-invalid={!!errors.telefone}
                aria-describedby={errors.telefone ? 'telefone-erro' : undefined}
                onBlur={handleBlur}
                className={inputClass(errors.telefone)}
              />
              {errors.telefone && (
                <p id="telefone-erro" className="font-jost text-xs text-red-500 mt-1.5">{errors.telefone}</p>
              )}
            </div>

            {/* Feedback de erro */}
            {status === 'error' && (
              <p className="font-jost text-sm text-red-500">
                Algo deu errado. Tente novamente ou entre em contato pelo WhatsApp.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || status === 'success'}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
              {status === 'success' ? 'Redirecionando...' : 'Continuar no WhatsApp'}
            </button>

            <p className="font-jost text-xs text-brand-dark/30 text-center">
              Seus dados são usados apenas para contato e não são compartilhados.
            </p>
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}