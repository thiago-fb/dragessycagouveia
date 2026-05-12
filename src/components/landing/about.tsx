'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState, useCallback, useEffect } from 'react'

interface Pilar { nome: string; desc: string }

interface AboutProps {
  sobreTexto: string
  titulo1: string
  tituloDestaque: string
  pilares: [Pilar, Pilar, Pilar]
  pill1: string
  pill2: string
  cardTitulo: string
  cardSubtitulo: string
  imagemPrincipal: string
  imagemProc: string
}

// Espaço extra de scroll que "consome" antes de passar para a próxima seção
const SCROLL_EXTRA = 700

export function About({
  sobreTexto,
  titulo1,
  tituloDestaque,
  pilares,
  pill1,
  pill2,
  cardTitulo,
  cardSubtitulo,
  imagemPrincipal,
  imagemProc,
}: AboutProps) {
  const sectionRef              = useRef<HTMLDivElement>(null)
  const [mouse, setMouse]       = useState({ x: 0, y: 0 })
  const [progress, setProgress] = useState(0) // 0 = início, 1 = elementos totalmente fora

  /* ── Mouse parallax ──────────────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({
      x: (e.clientX - window.innerWidth / 2)  / window.innerWidth,
      y: (e.clientY - window.innerHeight / 2) / window.innerHeight,
    })
  }, [])

  const handleMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), [])

  /* ── Scroll → progress 0→1 ───────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / scrollable))
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // mouseDepth = amplitude do parallax de mouse (px)
  // exitPx    = quantos px o elemento sobe quando progress=1
  const layer = (mouseDepth: number, exitPx = 0) => ({
    transform: `translate(${mouse.x * mouseDepth}px, ${mouse.y * mouseDepth - progress * exitPx}px)`,
    transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform' as const,
  })

const imgPrincipal = imagemPrincipal || '/images/gessyca-sobre.jpg'
  const imgProc      = imagemProc      || '/images/procedimento-sobre.jpg'

  const pillItems = [pill1, pill2]

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative bg-brand-cream"
      style={{ height: `calc(100vh + ${SCROLL_EXTRA}px)` }}
    >
      {/* Área sticky — permanece visível durante o scroll */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container-narrow py-16 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Coluna esquerda — sai mais devagar */}
            <div style={layer(8, 120)}>
              <span className="section-tag">Sobre</span>
              <h2 className="section-title mb-6">
                {titulo1}{' '}
                <em className="text-brand-bronze not-italic">{tituloDestaque}</em>
              </h2>
              <p className="font-jost text-brand-dark/70 leading-relaxed text-base mb-10">
                {sobreTexto}
              </p>
              <div className="space-y-7">
                {pilares.map((p) => (
                  <div key={p.nome} className="flex gap-4">
                    <span className="w-8 h-px bg-brand-gold mt-3 flex-shrink-0" />
                    <div>
                      <p className="font-playfair text-lg text-brand-dark mb-1">{p.nome}</p>
                      <p className="font-jost text-sm text-brand-dark/60 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna direita */}
            <div className="relative md:pr-10">

              {/* Foto — velocidade média */}
              <div style={layer(18, 180)} className="relative rounded-3xl overflow-hidden aspect-[3/4] w-full">
                <Image
                  src={imgPrincipal}
                  alt="Gessyca Gouveia"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Card flutuante — sai mais rápido */}
              <div
                style={layer(32, 280)}
                className="absolute bottom-24 -right-2 md:-right-10 w-[280px] bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-xl flex gap-3 items-start"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={imgProc}
                    alt="Procedimento estético"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-jost text-[13px] text-brand-dark leading-snug">
                    {cardTitulo}
                  </p>
                  <p className="font-jost text-[11px] text-brand-dark/50 mt-1 leading-snug">
                    {cardSubtitulo}
                  </p>
                </div>
              </div>

              {/* Pills — desktop: saem primeiro */}
              <div style={layer(48, 380)} className="absolute bottom-8 -left-2 hidden md:flex flex-col gap-2">
                {pillItems.map((text, i) => (
                  <button
                    key={i}
                    className={`group flex items-center gap-2 rounded-full pl-2 pr-5 py-2 shadow-md
                      hover:bg-brand-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300
                      ${i === 0 ? 'bg-[#A77A59]' : 'bg-[#A77A59]/75 backdrop-blur-sm'}`}
                  >
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300" style={{ backgroundColor: '#F6E5D5' }}>
                      <ArrowUpRight size={13} className="group-hover:rotate-12 transition-transform duration-300" style={{ color: '#86593C' }} />
                    </span>
                    <span className="font-jost text-[13px] font-medium text-brand-white whitespace-nowrap">
                      {text}
                    </span>
                  </button>
                ))}
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  )
}