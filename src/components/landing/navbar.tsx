'use client'

import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CTAButton } from '@/components/cta-button'

interface NavbarProps {
  whatsappLink: string
}

export function Navbar({ whatsappLink }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <a href="#inicio" className="flex items-center group flex-shrink-0">
          <div
            className="relative transition-all duration-300 ease-out"
            style={{
              width:  scrolled ? 160 : 340,
              height: scrolled ?  56 : 112,
            }}
          >
            <Image
              src="/images/logo-gg.png"
              alt="Gessyca Gouveia Estética Avançada"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 160px, 340px"
            />
          </div>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '#servicos',  label: 'Serviços' },
            { href: '#sobre',     label: 'Dra Gessyca Gouveia' },
            { href: '#contato',   label: 'Contato' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-jost text-sm tracking-wide transition-colors duration-200
                ${scrolled
                  ? 'text-brand-dark/70 hover:text-brand-bronze'
                  : 'text-brand-dark/80 hover:text-brand-bronze'
                }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <CTAButton
          whatsappLink={whatsappLink}
          className="group hidden md:inline-flex items-center gap-2.5 bg-brand-dark text-brand-white
                     rounded-full px-5 py-2.5 font-jost font-medium text-sm
                     hover:bg-brand-bronze hover:scale-105 hover:shadow-lg
                     active:scale-95 transition-all duration-300"
        >
          <span className="w-6 h-6 rounded-full bg-brand-white/15 flex items-center justify-center
                           group-hover:bg-brand-white/25 transition-colors duration-300 flex-shrink-0">
            <Calendar size={13} />
          </span>
          Agendar Avaliação
        </CTAButton>

      </div>
    </header>
  )
}