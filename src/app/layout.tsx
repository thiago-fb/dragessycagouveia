import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gessyca Gouveia — Estética Avançada em Maceió',
  description:
    'Procedimentos estéticos minimamente invasivos com resultados naturais e harmoniosos. Toxina Botulínica, Harmonização Facial, Preenchimento Labial e mais. Maceió, Alagoas.',
  keywords:
    'estética avançada Maceió, toxina botulínica Maceió, botox Maceió, harmonização facial Maceió, Gessyca Gouveia',
  openGraph: {
    title: 'Gessyca Gouveia — Estética Avançada em Maceió',
    description: 'Resultados que respeitam sua essência.',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}