/*
  # Création de la table des études SORA

  1. Nouvelle Table
    - `sora_studies`
      - `id` (uuid, clé primaire)
      - `name` (text, nom de l'étude)
      - `data` (jsonb, données de l'étude)
      - `user_id` (uuid, référence à auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Active RLS
    - Ajoute des politiques pour la lecture/écriture des données
*/

CREATE TABLE IF NOT EXISTS sora_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  data jsonb NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sora_studies ENABLE ROW LEVEL SECURITY;

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