import { createServerClient } from '@/lib/supabase-server'
import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Services } from '@/components/landing/services'
import { About } from '@/components/landing/about'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export const dynamic = 'force-dynamic'

async function getConfig() {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from('config').select('chave, valor')
    return Object.fromEntries((data ?? []).map((r) => [r.chave, r.valor]))
  } catch {
    return {}
  }
}

const DEFAULTS = {
  // Hero
  whatsapp_link:          'https://wa.me/5582999999999',
  whatsapp_numero:        '+55 (82) 9 9999-9999',
  horario_atendimento:    'Segunda a Sexta, 8h às 18h',
  hero_linha1:            'Realce sua',
  hero_linha2_bold:       'beleza natural,',
  hero_linha3:            'agora mesmo.',
  hero_subtitulo:         'Resultados que respeitam sua essência.',
  // Sobre
  sobre_titulo1:          'Beleza que é',
  sobre_titulo_destaque:  'sua',
  sobre_texto:            'Especialista em estética avançada com foco em resultados naturais e harmoniosos. Cada paciente recebe um atendimento personalizado, respeitando sua individualidade e essência.',
  sobre_pilar1_nome:      'Técnica',
  sobre_pilar1_desc:      'Procedimentos executados com precisão clínica e protocolos avançados.',
  sobre_pilar2_nome:      'Harmonia',
  sobre_pilar2_desc:      'Resultados que equilibram e revelam a beleza natural, sem exageros.',
  sobre_pilar3_nome:      'Confiança',
  sobre_pilar3_desc:      'Relação de transparência e cuidado com cada paciente.',
  sobre_pill1:            'Equilíbrio que transforma',
  sobre_pill2:            'Harmonia que revela',
  sobre_card_titulo:      'Agende sua Avaliação e ganhe 10% no retorno.',
  sobre_card_subtitulo:   'Acesse no WhatsApp, escolha o seu melhor dia e agende.',
  sobre_imagem_principal: '',
  sobre_imagem_proc:      '',
  // Agenda
  agenda_tag:             'Próximo passo',
  agenda_titulo:          'Agende sua avaliação',
  agenda_subtitulo:       'e sinta a diferença.',
  agenda_botao:           'Agende sua avaliação',
  // Rodapé
  instagram_url:          'https://instagram.com/gessycagouveia',
  instagram_handle:       '@gessycagouveia',
  endereco:               'Maceió, Alagoas',
}

export default async function Home() {
  const raw    = await getConfig()
  const config = { ...DEFAULTS, ...raw }

  return (
    <>
      <Navbar whatsappLink={config.whatsapp_link} />
      <Hero
        linha1={config.hero_linha1}
        linha2Bold={config.hero_linha2_bold}
        linha3={config.hero_linha3}
        subtitulo={config.hero_subtitulo}
        whatsappLink={config.whatsapp_link}
      />
      <Services />
      <About
        sobreTexto={config.sobre_texto}
        titulo1={config.sobre_titulo1}
        tituloDestaque={config.sobre_titulo_destaque}
        pilares={[
          { nome: config.sobre_pilar1_nome, desc: config.sobre_pilar1_desc },
          { nome: config.sobre_pilar2_nome, desc: config.sobre_pilar2_desc },
          { nome: config.sobre_pilar3_nome, desc: config.sobre_pilar3_desc },
        ]}
        pill1={config.sobre_pill1}
        pill2={config.sobre_pill2}
        cardTitulo={config.sobre_card_titulo}
        cardSubtitulo={config.sobre_card_subtitulo}
        imagemPrincipal={config.sobre_imagem_principal}
        imagemProc={config.sobre_imagem_proc}
      />
      <CTASection
        whatsappLink={config.whatsapp_link}
        horario={config.horario_atendimento}
        tag={config.agenda_tag}
        titulo={config.agenda_titulo}
        subtitulo={config.agenda_subtitulo}
      />
      <Footer
        instagramUrl={config.instagram_url}
        instagramHandle={config.instagram_handle}
        horario={config.horario_atendimento}
        whatsappNumero={config.whatsapp_numero}
        endereco={config.endereco}
      />
    </>
  )
}