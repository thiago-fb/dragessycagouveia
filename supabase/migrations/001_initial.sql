-- ============================================================
-- Gessyca Gouveia — Schema inicial
-- ============================================================

-- Tabela de leads capturados pelo modal da landing page
CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT NOT NULL,
  origem      TEXT DEFAULT 'landing_page',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca por data
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

-- ============================================================
-- Tabela de configurações da landing page (CMS simples)
-- ============================================================
CREATE TABLE IF NOT EXISTS config (
  chave       TEXT PRIMARY KEY,
  valor       TEXT NOT NULL,
  descricao   TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Valores padrão — edite pela dashboard depois
INSERT INTO config (chave, valor, descricao) VALUES
  ('whatsapp_link',        'https://wa.me/5582999999999?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação.', 'Link completo do WhatsApp com mensagem pré-preenchida'),
  ('whatsapp_numero',      '+55 (82) 9 9999-9999',                                                              'Número exibido visualmente na LP'),
  ('horario_atendimento',  'Segunda a Sexta, 8h às 18h',                                                        'Horário de atendimento exibido na LP'),
  ('hero_titulo',          'Realce sua beleza natural',                                                         'Título principal do hero'),
  ('hero_subtitulo',       'Resultados que respeitam sua essência.',                                            'Subtítulo do hero'),
  ('sobre_texto',          'Especialista em estética avançada com foco em resultados naturais e harmoniosos. Cada paciente recebe um atendimento personalizado, respeitando sua individualidade e essência.', 'Texto da seção Sobre'),
  ('instagram_url',        'https://instagram.com/gessycagouveia',                                              'URL do Instagram'),
  ('instagram_handle',     '@gessycagouveia',                                                                   'Handle do Instagram exibido'),
  ('endereco',             'Maceió, Alagoas',                                                                   'Endereço exibido no footer')
ON CONFLICT (chave) DO NOTHING;

-- ============================================================
-- Row Level Security
-- ============================================================

-- Leads: apenas usuários autenticados (admin) leem; qualquer um insere via API
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_insert_public"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "leads_select_authenticated"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- Config: apenas autenticados atualizam; qualquer um lê
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "config_select_public"
  ON config FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "config_update_authenticated"
  ON config FOR UPDATE
  TO authenticated
  USING (true);