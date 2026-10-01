/**
 * Validação dos dados do lead — usada no formulário (lead-modal) e nas rotas
 * /api/leads, para que front e back aceitem exatamente as mesmas coisas.
 */

export interface LeadInput {
  nome: string
  email: string
  telefone: string
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

const NOME_REGEX  = /^[\p{L}'.\- ]+$/u
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalizeLead(input: Partial<Record<keyof LeadInput, unknown>>): LeadInput {
  const str = (v: unknown) => (typeof v === 'string' ? v : '')
  return {
    nome:     str(input.nome).trim().replace(/\s+/g, ' '),
    email:    str(input.email).trim().toLowerCase(),
    telefone: str(input.telefone).trim(),
  }
}

/**
 * `exigirSobrenome`: o formulário do site exige nome e sobrenome; o painel
 * admin pode salvar só o primeiro nome.
 */
export function validateLead(lead: LeadInput, { exigirSobrenome = true } = {}): LeadErrors {
  const errors: LeadErrors = {}

  // Palavras com 2+ letras — aceita "João D. Souza", rejeita "a"
  const palavras = lead.nome.split(' ').filter((p) => p.replace(/[^\p{L}]/gu, '').length >= 2)
  if (!lead.nome) {
    errors.nome = 'Informe seu nome.'
  } else if (lead.nome.length > 100 || !NOME_REGEX.test(lead.nome)) {
    errors.nome = 'Use apenas letras no nome.'
  } else if (palavras.length < (exigirSobrenome ? 2 : 1)) {
    errors.nome = exigirSobrenome ? 'Informe nome e sobrenome.' : 'Informe o nome.'
  }

  if (!lead.email) {
    errors.email = 'Informe seu e-mail.'
  } else if (lead.email.length > 254 || !EMAIL_REGEX.test(lead.email)) {
    errors.email = 'E-mail inválido. Ex.: seu@email.com'
  }

  const digitos = lead.telefone.replace(/\D/g, '')
  if (!digitos) {
    errors.telefone = 'Informe seu telefone.'
  } else if (
    (digitos.length !== 10 && digitos.length !== 11) ||
    digitos[0] === '0' ||
    (digitos.length === 11 && digitos[2] !== '9')
  ) {
    errors.telefone = 'Telefone inválido. Ex.: (82) 9 9999-9999'
  }

  return errors
}
