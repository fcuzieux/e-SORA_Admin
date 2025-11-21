/*
  # Mise à jour de la sécurité et des contraintes de la table sora_studies

  1. Nettoyage
    - Supprime les lignes avec user_id null
    - Met à jour les index et contraintes
  
  2. Sécurité
    - Mise à jour des politiques RLS
    - Ajout de politiques pour les utilisateurs authentifiés

  3. Performance
    - Ajout d'index sur les colonnes fréquemment utilisées
*/

-- Supprime d'abord les enregistrements avec user_id null
DELETE FROM sora_studies WHERE user_id IS NULL;

-- Mise à jour des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_sora_studies_user_id ON sora_studies(user_id);
CREATE INDEX IF NOT EXISTS idx_sora_studies_updated_at ON sora_studies(updated_at);

-- Ajout des contraintes NOT NULL
ALTER TABLE sora_studies 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN data SET NOT NULL;

-- Mise à jour des politiques de sécurité
DROP POLICY IF EXISTS "Enable full access to all users" ON sora_studies;

-- Création des nouvelles politiques de sécurité
CREATE POLICY "Users can read their own studies"
  ON sora_studies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own studies"
  ON sora_studies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own studies"
  ON sora_studies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own studies"
  ON sora_studies
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ajout de la contrainte de clé étrangère
ALTER TABLE sora_studies
  DROP CONSTRAINT IF EXISTS fk_user,
  ADD CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;