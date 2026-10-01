import type { NextConfig } from 'next'

const securityHeaders = [
  // Impede que o site/painel seja exibido dentro de iframe de outro site (clickjacking)
  { key: 'X-Frame-Options',         value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qxlhpjyebqjgmzccxwud.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  async redirects() {
    return [{ source: '/admin', destination: '/admin/dashboard', permanent: false }]
  },
}

export default nextConfig
