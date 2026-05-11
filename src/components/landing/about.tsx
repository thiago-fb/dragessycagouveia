'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useRef, useState, useCallback } from 'react'

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
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    })
  }, [])

  const handleMouseLeave = useCallback(() => setMouse({ x: 0, y: 0 }), [])

  const layer = (depth: number) => ({
    transform: `translate(${mouse.x * depth}px, ${mouse.y * depth}px)`,
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  })

  const imgPrincipal = imagemPrincipal || '/images/gessyca-sobre.jpg'
  const imgProc      = imagemProc      || '/images/procedimento-sobre.jpg'

  return (
    <section
      id="sobre"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-brand-cream section-padding"
    >
      <div className="container-narrow">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Coluna esquerda */}
          <div style={layer(8)}>
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

            <div style={layer(18)} className="relative rounded-3xl overflow-hidden aspect-[3/4] w-full">
              <Image
                src={imgPrincipal}
                alt="Gessyca Gouveia"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Card flutuante */}
            <div
              style={layer(32)}
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

            {/* Pills */}
            <div style={layer(48)} className="absolute bottom-8 -left-2 flex flex-col gap-2">
              {[pill1, pill2].map((text, i) => (
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
    </section>
  )
}