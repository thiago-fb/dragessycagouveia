import { CTAButton } from '@/components/cta-button'
import { FloatingPaths } from '@/components/ui/background-paths'

interface CTASectionProps {
  whatsappLink: string
  horario: string
  tag: string
  titulo: string
  subtitulo: string
}

export function CTASection({ whatsappLink, horario, tag, titulo, subtitulo }: CTASectionProps) {
  return (
    <section className="bg-brand-dark section-padding text-center relative overflow-hidden" id="contato">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      <div className="container-narrow relative z-10">
        <span className="section-tag text-brand-gold/60">{tag}</span>
        <h2 className="font-playfair text-4xl md:text-5xl text-brand-white leading-tight mb-4">
          {titulo}
        </h2>
        <p className="font-playfair text-brand-gold text-2xl md:text-3xl mb-10">
          {subtitulo}
        </p>
        <p className="font-jost text-brand-white/50 text-sm tracking-wider mb-10">
          {horario} · Atendimento personalizado
        </p>
        <CTAButton
          whatsappLink={whatsappLink}
          className="inline-flex items-center gap-2 bg-white rounded-full px-8 py-4
                     font-jost font-medium tracking-widest uppercase text-sm text-[#663A23]
                     hover:bg-white/90 hover:scale-105 hover:shadow-xl
                     active:scale-95 transition-all duration-300 cursor-pointer"
        />
      </div>
    </section>
  )
}