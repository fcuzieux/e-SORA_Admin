/*
  # Update sora_studies table and policies
  
  1. Changes
    - Make user_id column nullable
    - Drop existing RLS policies
    - Create new public access policy if it doesn't exist
*/

-- Mise à jour de la table sora_studies pour rendre user_id nullable
ALTER TABLE IF EXISTS sora_studies 
  ALTER COLUMN user_id DROP NOT NULL;

-- Suppression des anciennes politiques spécifiques aux utilisateurs
DROP POLICY IF EXISTS "Users can read their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can insert their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can update their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can delete their own studies" ON sora_studies;

-- Création de la nouvelle politique d'accès public si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'sora_studies' 
    AND policyname = 'Enable full access to all users'
  ) THEN
    CREATE POLICY "Enable full access to all users"
      ON sora_studies
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;