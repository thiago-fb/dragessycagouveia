const DOMAIN = '@admin.gg.internal'

export function toEmail(username: string) {
  return `${username.trim().toLowerCase()}${DOMAIN}`
}

export function toUsername(email: string) {
  return email.endsWith(DOMAIN) ? email.replace(DOMAIN, '') : email
}