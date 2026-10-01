-- ============================================================
-- Endurecimento de segurança
-- ============================================================
-- Todo acesso a dados passa pelas rotas /api do Next.js, que usam a
-- service_role (ignora RLS) e checam o login do admin (verifyAuth).
-- O navegador usa a chave pública só para login (supabase.auth).
-- Por isso as políticas abaixo, que davam acesso direto pela chave
-- pública, são removidas: anon/authenticated ficam só com leitura do
-- conteúdo público da landing page (config e procedures).

-- Leads: inserção só pelo servidor (com validação); leitura/edição só pelo admin via API
DROP POLICY IF EXISTS "leads_insert_public"        ON public.leads;
DROP POLICY IF EXISTS "leads_select_authenticated" ON public.leads;
DROP POLICY IF EXISTS "leads_update_authenticated" ON public.leads;
DROP POLICY IF EXISTS "leads_delete_authenticated" ON public.leads;

-- Events (analytics): inserção e leitura só pelo servidor
DROP POLICY IF EXISTS "events_insert" ON public.events;
DROP POLICY IF EXISTS "events_select" ON public.events;

-- Config: leitura pública mantida (config_select_public); escrita só pela API
DROP POLICY IF EXISTS "config_update_authenticated" ON public.config;

-- Procedures: leitura pública mantida (procedures_select); escrita só pela API
DROP POLICY IF EXISTS "procedures_insert" ON public.procedures;
DROP POLICY IF EXISTS "procedures_update" ON public.procedures;
DROP POLICY IF EXISTS "procedures_delete" ON public.procedures;

-- Storage "imagens": qualquer um (sem login) podia enviar e apagar arquivos.
-- Upload agora só pela rota /api/upload; leitura pública mantida (imagens_public_read).
DROP POLICY IF EXISTS "imagens_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "imagens_auth_delete" ON storage.objects;

-- Sobras de outro projeto migrado (buckets banners/cadastros, não usados pelo site)
DROP POLICY IF EXISTS "Auth upload banners"              ON storage.objects;
DROP POLICY IF EXISTS "Auth delete banners"              ON storage.objects;
DROP POLICY IF EXISTS "Auth upload cadastros"            ON storage.objects;
DROP POLICY IF EXISTS "comprovantes_storage_delete_own"  ON storage.objects;
