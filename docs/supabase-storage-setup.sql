-- ============================================
-- Configuration Supabase Storage pour e-SORA
-- ============================================
-- Ce script configure le bucket de stockage et les politiques d'accès
-- pour les fichiers de l'application e-SORA Admin

-- Note: Le bucket 'sora-file' doit être créé manuellement via l'interface
-- Supabase avant d'exécuter ce script (cochez "Public bucket")

-- ============================================
-- Politiques d'Accès (Row Level Security)
-- ============================================

-- 1. Permettre aux utilisateurs authentifiés d'uploader des fichiers
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sora-file');

-- 2. Permettre la lecture publique de tous les fichiers
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'sora-file');

-- 3. Permettre aux utilisateurs authentifiés de supprimer leurs fichiers
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'sora-file');

-- 4. Permettre aux utilisateurs authentifiés de mettre à jour leurs fichiers
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'sora-file')
WITH CHECK (bucket_id = 'sora-file');

-- ============================================
-- Fonction de Nettoyage (Optionnel)
-- ============================================
-- Cette fonction supprime les fichiers orphelins (fichiers dont l'étude n'existe plus)

CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  file_record RECORD;
  study_exists BOOLEAN;
BEGIN
  -- Parcourir tous les fichiers dans le bucket sora-file
  FOR file_record IN 
    SELECT name, id 
    FROM storage.objects 
    WHERE bucket_id = 'sora-file'
  LOOP
    -- Extraire l'ID de l'étude du chemin du fichier
    -- Format: {study-id}/{category}/{timestamp}_{filename}
    DECLARE
      study_id_from_path TEXT;
    BEGIN
      study_id_from_path := split_part(file_record.name, '/', 1);
      
      -- Vérifier si l'étude existe
      SELECT EXISTS(
        SELECT 1 FROM sora_studies WHERE id::text = study_id_from_path
      ) INTO study_exists;
      
      -- Si l'étude n'existe pas, supprimer le fichier
      IF NOT study_exists THEN
        DELETE FROM storage.objects 
        WHERE id = file_record.id;
        
        RAISE NOTICE 'Deleted orphaned file: %', file_record.name;
      END IF;
    END;
  END LOOP;
END;
$$;

-- ============================================
-- Fonction pour supprimer tous les fichiers d'une étude
-- ============================================
-- Cette fonction est appelée automatiquement quand une étude est supprimée

CREATE OR REPLACE FUNCTION delete_study_files()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer tous les fichiers associés à l'étude
  DELETE FROM storage.objects
  WHERE bucket_id = 'sora-file'
  AND name LIKE OLD.id::text || '/%';
  
  RETURN OLD;
END;
$$;

-- Créer le trigger pour supprimer automatiquement les fichiers
DROP TRIGGER IF EXISTS on_study_delete ON sora_studies;
CREATE TRIGGER on_study_delete
  BEFORE DELETE ON sora_studies
  FOR EACH ROW
  EXECUTE FUNCTION delete_study_files();

-- ============================================
-- Vérification de la Configuration
-- ============================================
-- Exécutez cette requête pour vérifier que tout est bien configuré

SELECT 
  'Bucket Configuration' as check_type,
  CASE 
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'sora-file') 
    THEN '✅ Bucket sora-file exists'
    ELSE '❌ Bucket sora-file NOT found - Please create it manually'
  END as status
UNION ALL
SELECT 
  'Public Access',
  CASE 
    WHEN (SELECT public FROM storage.buckets WHERE id = 'sora-file')
    THEN '✅ Bucket is public'
    ELSE '❌ Bucket is NOT public - Please enable public access'
  END
UNION ALL
SELECT 
  'RLS Policies',
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') >= 4
    THEN '✅ ' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')::text || ' policies configured'
    ELSE '⚠️  Only ' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')::text || ' policies found'
  END;

-- ============================================
-- Commandes Utiles
-- ============================================

-- Lister tous les fichiers dans le bucket
-- SELECT * FROM storage.objects WHERE bucket_id = 'sora-file' ORDER BY created_at DESC;

-- Compter les fichiers par étude
-- SELECT 
--   split_part(name, '/', 1) as study_id,
--   COUNT(*) as file_count,
--   pg_size_pretty(SUM((metadata->>'size')::bigint)) as total_size
-- FROM storage.objects 
-- WHERE bucket_id = 'sora-file'
-- GROUP BY split_part(name, '/', 1)
-- ORDER BY file_count DESC;

-- Supprimer tous les fichiers d'une étude spécifique
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'sora-file' 
-- AND name LIKE 'STUDY_ID_HERE/%';

-- Nettoyer les fichiers orphelins manuellement
-- SELECT cleanup_orphaned_files();
