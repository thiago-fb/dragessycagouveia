import { Instagram } from 'lucide-react'

interface FooterProps {
  instagramUrl: string
  instagramHandle: string
  horario: string
  whatsappNumero: string
  endereco: string
}

export function Footer({
  instagramUrl,
  instagramHandle,
  horario,
  whatsappNumero,
  endereco,
}: FooterProps) {
  return (
    <footer className="bg-brand-white border-t border-brand-cream py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Marca */}
          <div>
            <p className="font-playfair text-xl text-brand-bronze tracking-wide mb-2">
              Dra Gessyca Gouveia
            </p>
            <p className="font-jost text-xs tracking-[0.2em] uppercase text-brand-dark/40 mb-4">
              Estética Avançada
            </p>
            <p className="font-jost text-sm text-brand-dark/50">{endereco}</p>
          </div>

          {/* Contato */}
          <div>
            <p className="font-jost text-xs tracking-[0.2em] uppercase text-brand-bronze/60 mb-4">
              Contato
            </p>
            <p className="font-jost text-sm text-brand-dark/70 mb-2">
              {whatsappNumero}
            </p>
            <p className="font-jost text-sm text-brand-dark/50">{horario}</p>
          </div>

          {/* Redes sociais */}
          <div>
            <p className="font-jost text-xs tracking-[0.2em] uppercase text-brand-bronze/60 mb-4">
              Redes sociais
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-jost text-sm text-brand-dark/70 hover:text-brand-bronze transition-colors"
            >
              <Instagram size={16} />
              {instagramHandle}
            </a>
          </div>
        </div>

        <div className="border-t border-brand-cream pt-6 text-center">
          <p className="font-jost text-xs text-brand-dark/30">
            © {new Date().getFullYear()} Gessyca Gouveia Estética Avançada. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}