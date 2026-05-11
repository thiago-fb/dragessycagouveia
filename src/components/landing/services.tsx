import { createServerClient } from '@/lib/supabase-server'
import { AuroraBackground } from '@/components/aurora-background'

interface Procedure {
  id: string
  nome: string
  descricao: string
  ordem: number
}

async function getProcedures(): Promise<Procedure[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from('procedures')
      .select('*')
      .order('ordem', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export async function Services() {
  const procedures = await getProcedures()

  return (
    <AuroraBackground id="servicos" className="bg-brand-cream section-padding">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="section-tag">O que tratamos</span>
          <h2 className="section-title">
            Procedimentos{' '}
            <em className="text-brand-bronze not-italic">especializados</em>
          </h2>
          <p className="font-jost text-brand-dark/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Cada procedimento é realizado com protocolos avançados, respeitando
            sua individualidade e promovendo resultados naturais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-cream">
          {procedures.map((p) => (
            <div
              key={p.id}
              className="bg-white/25 backdrop-blur-sm p-8 group hover:bg-white/40 hover:shadow-[0_4px_24px_rgba(139,94,60,0.08)] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="w-px h-10 bg-brand-gold flex-shrink-0 mt-1 group-hover:h-14 transition-all duration-300" />
                <div>
                  <h3 className="font-playfair text-xl text-brand-dark mb-2">{p.nome}</h3>
                  <p className="font-jost text-sm text-brand-dark/60 leading-relaxed">{p.descricao}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuroraBackground>
  )
}