-- Migration 006: RLS policies for users table
-- Allow authenticated users to manage their own row

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "users_select_all"  ON users;
DROP POLICY IF EXISTS "users_insert_own"  ON users;
DROP POLICY IF EXISTS "users_update_own"  ON users;
DROP POLICY IF EXISTS "users_select_anon" ON users;

-- Select: authenticated users can read all profiles (for leaderboard)
CREATE POLICY "users_select_all"
  ON users FOR SELECT TO authenticated
  USING (true);

-- Insert: authenticated users can insert (registration)
CREATE POLICY "users_insert_own"
  ON users FOR INSERT TO authenticated
  WITH CHECK (true);

-- Update: authenticated users can update rows
CREATE POLICY "users_update_own"
  ON users FOR UPDATE TO authenticated
  USING (true);

-- Allow anon to read (public leaderboard)
CREATE POLICY "users_select_anon"
  ON users FOR SELECT TO anon
  USING (true);
