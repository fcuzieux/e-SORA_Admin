/*
  # Add function to get user emails for admin panel

  1. New Functions
    - `get_user_emails()` - Returns user IDs and emails for admin users
      - Only accessible to users with 'admin' role in user_roles table
      - Returns data from auth.users table
  
  2. Security
    - Function has SECURITY DEFINER to access auth.users
    - Checks that caller has 'admin' role before returning data
*/

-- Function to get user emails (admin only)
CREATE OR REPLACE FUNCTION get_user_emails()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return user emails from auth.users
  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    au.created_at
  FROM auth.users au;
END;
$$;