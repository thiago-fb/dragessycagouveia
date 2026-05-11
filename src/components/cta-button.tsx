'use client'

import { useRef, useState } from 'react'
import { LeadModal } from './lead-modal'

interface CTAButtonProps {
  whatsappLink: string
  variant?: 'dark' | 'light'
  className?: string
  children?: React.ReactNode
}

function getSessionId() {
  try {
    if (typeof window === 'undefined') return crypto.randomUUID()
    let id = sessionStorage.getItem('cta_session')
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem('cta_session', id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export function CTAButton({ whatsappLink, variant = 'dark', className, children }: CTAButtonProps) {
  const [open, setOpen]         = useState(false)
  const submittedRef            = useRef(false)

  // Rastreia abertura do modal
  function handleOpen() {
    setOpen(true)
    submittedRef.current = false
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'modal_open', session_id: getSessionId() }),
    }).catch(() => {})
  }

  // Rastreia envio do formulário (chamado pelo LeadModal após sucesso)
  function handleLeadSubmitted() {
    submittedRef.current = true
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'lead_submitted', session_id: getSessionId() }),
    }).catch(() => {})
  }

  // Rastreia fechamento sem envio
  function handleClose() {
    if (!submittedRef.current) {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'modal_closed', session_id: getSessionId() }),
      }).catch(() => {})
    }
    setOpen(false)
  }

  const defaultClass = variant === 'dark'
    ? 'btn-primary'
    : 'btn-ghost border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark'

  return (
    <>
      <button onClick={handleOpen} className={className ?? defaultClass}>
        {children ?? 'Agende sua avaliação'}
      </button>
      <LeadModal
        open={open}
        onClose={handleClose}
        whatsappLink={whatsappLink}
        onSubmitSuccess={handleLeadSubmitted}
      />
    </>
  )
}