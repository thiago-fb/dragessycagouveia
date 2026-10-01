-- ============================================================
-- Restaura os buckets do site ETOPNET
-- ============================================================
-- Este projeto Supabase é compartilhado com o site ETOPNET (schema
-- "etopnet", buckets "banners" e "cadastros"). A 002 removeu por engano
-- as políticas desses buckets; aqui elas voltam como eram.
-- NÃO remover: o painel da ETOPNET depende delas.

UPDATE storage.buckets SET public = true WHERE id = 'banners';

CREATE POLICY "Auth upload banners" ON storage.objects FOR INSERT TO public
  WITH CHECK ((bucket_id = 'banners'::text) AND (auth.role() = 'authenticated'::text));
CREATE POLICY "Auth delete banners" ON storage.objects FOR DELETE TO public
  USING ((bucket_id = 'banners'::text) AND (auth.role() = 'authenticated'::text));
CREATE POLICY "Auth upload cadastros" ON storage.objects FOR INSERT TO public
  WITH CHECK ((bucket_id = 'cadastros'::text) AND (auth.role() = 'authenticated'::text));
CREATE POLICY "comprovantes_storage_delete_own" ON storage.objects FOR DELETE TO public
  USING ((bucket_id = 'cadastros'::text) AND (auth.role() = 'authenticated'::text));
