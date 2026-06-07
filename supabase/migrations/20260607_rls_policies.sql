-- ============================================================
-- MUNDIAL 2026 — Production RLS Policies
-- ============================================================
-- Run this in Supabase SQL Editor.
-- Locks down all tables so only authenticated users can read
-- their own data. The API routes use service_role key to
-- bypass RLS for legitimate writes.
-- ============================================================

-- ── predictions ─────────────────────────────────────────────
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "predictions_select" ON predictions;
DROP POLICY IF EXISTS "predictions_insert" ON predictions;
DROP POLICY IF EXISTS "predictions_update" ON predictions;
DROP POLICY IF EXISTS "predictions_delete" ON predictions;

-- Only owner can read their own prediction
CREATE POLICY "predictions_select" ON predictions
  FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert only for themselves
CREATE POLICY "predictions_insert" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only owner can update their own prediction
CREATE POLICY "predictions_update" ON predictions
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only owner can delete their own prediction
CREATE POLICY "predictions_delete" ON predictions
  FOR DELETE USING (auth.uid() = user_id);

-- ── group_picks ──────────────────────────────────────────────
ALTER TABLE group_picks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "group_picks_select" ON group_picks;
DROP POLICY IF EXISTS "group_picks_insert" ON group_picks;
DROP POLICY IF EXISTS "group_picks_update" ON group_picks;
DROP POLICY IF EXISTS "group_picks_delete" ON group_picks;

CREATE POLICY "group_picks_select" ON group_picks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "group_picks_insert" ON group_picks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "group_picks_update" ON group_picks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "group_picks_delete" ON group_picks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

-- ── best8_ranking ────────────────────────────────────────────
ALTER TABLE best8_ranking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "best8_select" ON best8_ranking;
DROP POLICY IF EXISTS "best8_insert" ON best8_ranking;
DROP POLICY IF EXISTS "best8_delete" ON best8_ranking;

CREATE POLICY "best8_select" ON best8_ranking
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "best8_insert" ON best8_ranking
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "best8_delete" ON best8_ranking
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

-- ── bracket_picks ────────────────────────────────────────────
ALTER TABLE bracket_picks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bracket_picks_select" ON bracket_picks;
DROP POLICY IF EXISTS "bracket_picks_insert" ON bracket_picks;
DROP POLICY IF EXISTS "bracket_picks_update" ON bracket_picks;
DROP POLICY IF EXISTS "bracket_picks_delete" ON bracket_picks;

CREATE POLICY "bracket_picks_select" ON bracket_picks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "bracket_picks_insert" ON bracket_picks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

CREATE POLICY "bracket_picks_delete" ON bracket_picks
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM predictions p WHERE p.id = prediction_id AND p.user_id = auth.uid())
  );

-- ── users (custom profile table) ────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- Users can only read their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (email = auth.email());

-- Users can only update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (email = auth.email())
  WITH CHECK (email = auth.email());

-- No public inserts or deletes — only service_role can do those
