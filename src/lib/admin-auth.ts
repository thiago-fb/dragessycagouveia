const DOMAIN = '@admin.gg.internal'

export function toEmail(username: string) {
  return `${username.trim().toLowerCase()}${DOMAIN}`
}

export function toUsername(email: string) {
  return email.endsWith(DOMAIN) ? email.replace(DOMAIN, '') : email
}

/** Só contas no padrão do painel (usuario@admin.gg.internal) são admin. */
export function isAdminEmail(email: string | null | undefined) {
  return !!email && /^[a-z0-9._-]+@admin\.gg\.internal$/.test(email.toLowerCase())
}
