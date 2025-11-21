/*
  # Create Super Agent System
  
  1. New Tables
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, reference to auth.users)
      - `role` (text, user role)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on user_roles table
    - Update sora_studies policies to allow super agents to view all studies
    - Add policies for role management
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'super_agent', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user is super agent
CREATE OR REPLACE FUNCTION is_super_agent(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('super_agent', 'admin')
  );
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT role FROM user_roles WHERE user_id = user_uuid),
    'user'
  );
$$;

-- Policies for user_roles table
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super agents can read all roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (is_super_agent(auth.uid()));

CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin')
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Update sora_studies policies to allow super agents to view all studies
DROP POLICY IF EXISTS "Users can read their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can insert their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can update their own studies" ON sora_studies;
DROP POLICY IF EXISTS "Users can delete their own studies" ON sora_studies;

-- New policies for sora_studies
CREATE POLICY "Users can read their own studies or super agents can read all"
  ON sora_studies
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    is_super_agent(auth.uid())
  );

CREATE POLICY "Users can insert their own studies"
  ON sora_studies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own studies or super agents can update all"
  ON sora_studies
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    is_super_agent(auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id OR 
    is_super_agent(auth.uid())
  );

CREATE POLICY "Users can delete their own studies or super agents can delete all"
  ON sora_studies
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    is_super_agent(auth.uid())
  );

-- Insert default admin user (you'll need to update this with actual user ID)
-- This is commented out - you'll need to run this manually with the actual user ID
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('your-admin-user-id-here', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';