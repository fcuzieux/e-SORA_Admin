-- Mise à jour de la table sora_studies
CREATE TABLE IF NOT EXISTS sora_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL,
  user_id uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "Users can read their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can insert their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can update their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can delete their own studies" ON sora_studies;

-- Activation de RLS
ALTER TABLE sora_studies ENABLE ROW LEVEL SECURITY;

-- Nouvelle politique permettant l'accès public en lecture/écriture
CREATE POLICY "Enable full access to all users"
  ON sora_studies
  FOR ALL
  USING (true)
  WITH CHECK (true);