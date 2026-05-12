import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dragessycagouveia.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Gessyca Gouveia — Estética Avançada em Maceió',
  description:
    'Procedimentos estéticos minimamente invasivos com resultados naturais e harmoniosos. Toxina Botulínica, Harmonização Facial, Preenchimento Labial e mais. Maceió, Alagoas.',
  keywords:
    'estética avançada Maceió, toxina botulínica Maceió, botox Maceió, harmonização facial Maceió, Gessyca Gouveia',
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
  openGraph: {
    title: 'Gessyca Gouveia — Estética Avançada em Maceió',
    description: 'Resultados que respeitam sua essência.',
    locale: 'pt_BR',
    type: 'website',
    url: siteUrl,
    siteName: 'Gessyca Gouveia Estética Avançada',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gessyca Gouveia — Estética Avançada em Maceió',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gessyca Gouveia — Estética Avançada em Maceió',
    description: 'Resultados que respeitam sua essência.',
    images: ['/images/og-image.jpg'],
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