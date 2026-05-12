'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CTAButton } from '@/components/cta-button'

interface HeroProps {
  linha1: string
  linha2Bold: string
  linha3: string
  subtitulo: string
  whatsappLink: string
}

const TOTAL_FRAMES = 24
const SCROLL_EXTRA = 1440 // px de scroll para animar os 24 frames

const FRAME_SRCS = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
  `/images/hero-banner/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

const CLIENT_IMAGES = [
  '/images/cliente-1.png',
  '/images/cliente-2.png',
  '/images/cliente-3.png',
  '/images/cliente-4.png',
]

export function Hero({ linha1, linha2Bold, linha3, subtitulo, whatsappLink }: HeroProps) {
  const [count, setCount]           = useState(0)
  const [fontSize, setFontSize]     = useState(0)
  const [framesReady, setFramesReady] = useState(false)
  const belezaRef                   = useRef<HTMLSpanElement>(null)
  const sectionRef                  = useRef<HTMLDivElement>(null)
  const imgRef                      = useRef<HTMLImageElement>(null)
  const frameRef                    = useRef(0)

  /* ── Pré-carrega todos os frames e só ativa a animação quando prontos ── */
  useEffect(() => {
    let loaded = 0
    FRAME_SRCS.forEach(src => {
      const img = new window.Image()
      img.onload = img.onerror = () => {
        loaded++
        if (loaded >= FRAME_SRCS.length) setFramesReady(true)
      }
      img.src = src
    })
  }, [])

  /* ── Scroll → frame animation ────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el  = sectionRef.current
      const img = imgRef.current
      if (!el || !img) return

      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return

      const progress = Math.max(0, Math.min(1, (window.scrollY - el.offsetTop) / scrollable))
      const newFrame  = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES))

      if (newFrame !== frameRef.current) {
        frameRef.current = newFrame
        img.src = FRAME_SRCS[newFrame]
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── "beleza" full-width fit (after font load) ───── */
  useEffect(() => {
    const fit = () => {
      const el = belezaRef.current
      if (!el) return
      el.style.fontSize = '100px'
      const w = el.scrollWidth
      if (w > 0) {
        const size = 100 * (window.innerWidth / w)
        el.style.fontSize = `${size}px`
        setFontSize(size)
      }
    }
    const run = () => { fit(); window.addEventListener('resize', fit) }
    document.fonts?.ready ? document.fonts.ready.then(run) : run()
    return () => window.removeEventListener('resize', fit)
  }, [])

  /* ── counter 0 → 2368 ────────────────────────────── */
  useEffect(() => {
    const target   = 2368
    const duration = 2200
    const delay    = setTimeout(() => {
      const start = Date.now()
      const tick  = () => {
        const p = Math.min((Date.now() - start) / duration, 1)
        setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, 900)
    return () => clearTimeout(delay)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative"
      style={{ height: framesReady ? `calc(100vh + ${SCROLL_EXTRA}px)` : '100vh' }}
    >
      {/* ── Área sticky — permanece visível durante o scroll ── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Background: sequência de frames ─────────── */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={FRAME_SRCS[0]}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay left → right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream/70 via-brand-cream/30 to-transparent pointer-events-none" />

        {/* ── Content ────────────────────────────────── */}
        <div
          style={{ animation: 'fadeSlideUp 0.9s ease-out both' }}
          className="relative z-10 h-full flex items-center"
        >
          <div className="max-w-6xl mx-auto px-6 pt-20 w-full">
            <div className="max-w-xl">

              <h1
                className="font-playfair text-5xl md:text-6xl lg:text-7xl text-brand-dark leading-[1.05] mb-5"
                style={{ animation: 'fadeSlideUp 0.8s 0.25s ease-out both', opacity: 0 }}
              >
                {linha1}{' '}
                <strong className="font-bold">{linha2Bold}</strong>
                <br />{linha3}
              </h1>

              <p
                className="font-jost text-brand-dark/70 text-lg mb-10"
                style={{ animation: 'fadeSlideUp 0.8s 0.45s ease-out both', opacity: 0 }}
              >
                {subtitulo}
              </p>

              {/* CTA + Social proof */}
              <div
                className="flex items-center flex-wrap"
                style={{ gap: '30px', animation: 'fadeSlideUp 0.8s 0.6s ease-out both', opacity: 0 }}
              >
                <CTAButton
                  whatsappLink={whatsappLink}
                  className="group inline-flex items-center gap-3 bg-brand-dark text-brand-white
                             rounded-full px-7 py-4 font-jost font-medium text-sm
                             hover:bg-brand-bronze hover:scale-105 hover:shadow-xl
                             active:scale-95 transition-all duration-300 flex-shrink-0"
                >
                  Agende sua Avaliação
                  <span className="w-7 h-7 rounded-full bg-brand-white/15 flex items-center justify-center
                                   group-hover:bg-brand-white/25 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight size={14} />
                  </span>
                </CTAButton>

                <div
                  className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-md
                             rounded-full px-4 py-2.5 shadow-lg border border-white/30 flex-shrink-0"
                >
                  <div className="flex -space-x-2.5">
                    {CLIENT_IMAGES.map((src, i) => (
                      <div
                        key={i}
                        className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white"
                        style={{
                          animation:      'avatarAppear 0.4s ease-out forwards',
                          animationDelay: `${1.1 + i * 0.15}s`,
                          opacity:        0,
                        }}
                      >
                        <Image src={src} alt={`Cliente ${i + 1}`} fill className="object-cover" sizes="36px" />
                      </div>
                    ))}
                  </div>
                  <div className="leading-none">
                    <p className="font-jost text-[11px] text-brand-dark/60 mb-0.5">Clientes que aprovam</p>
                    <p className="font-playfair font-bold text-brand-dark text-base">
                      +{count.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── "beleza" — máscara SVG + blur nas letras ── */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
          <defs>
            <mask id="beleza-mask" maskUnits="userSpaceOnUse"
                  x="0" y="0" width="10000" height="10000">
              <rect width="10000" height="10000" fill="black" />
              {fontSize > 0 && (
                <text
                  x="0"
                  y={fontSize * 0.78}
                  style={{
                    fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: `${fontSize}px`,
                  }}
                  fill="white"
                >
                  beleza
                </text>
              )}
            </mask>
          </defs>
        </svg>

        <div className="absolute bottom-0 left-0 pointer-events-none" style={{ lineHeight: 0.92 }}>
          <span
            ref={belezaRef}
            className="font-playfair font-bold whitespace-nowrap block select-none"
            style={{ opacity: 0 }}
            aria-hidden
          >
            beleza
          </span>
        </div>

        {fontSize > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100vw',
              height: fontSize * 0.92,
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              background: 'rgba(255, 255, 255, 0.18)',
              mask: 'url(#beleza-mask)',
              WebkitMask: 'url(#beleza-mask)',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          />
        )}

      </div>
    </section>
  )
}