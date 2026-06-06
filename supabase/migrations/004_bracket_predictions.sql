-- ═══════════════════════════════════════════════════════════════════════════
-- MUNDIAL — Migration 004: My Bracket anonymous prediction tables
-- Run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- Stores one prediction record per anonymous session
CREATE TABLE IF NOT EXISTS predictions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  user_name       TEXT,
  champion_team   TEXT,
  champion_flag   TEXT,
  is_complete     BOOLEAN DEFAULT false
);

-- Stores each group's confirmed 1st, 2nd, and 3rd place picks
CREATE TABLE IF NOT EXISTS group_picks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id   UUID REFERENCES predictions(id) ON DELETE CASCADE,
  group_letter    CHAR(1) NOT NULL,
  first_team      TEXT NOT NULL,
  first_flag      TEXT NOT NULL,
  second_team     TEXT NOT NULL,
  second_flag     TEXT NOT NULL,
  third_team      TEXT,
  third_flag      TEXT,
  confirmed_at    TIMESTAMPTZ DEFAULT now()
);

-- Stores the best 8 third-place ranking
CREATE TABLE IF NOT EXISTS best8_ranking (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id   UUID REFERENCES predictions(id) ON DELETE CASCADE,
  rank            INTEGER NOT NULL CHECK (rank BETWEEN 1 AND 12),
  team            TEXT NOT NULL,
  flag            TEXT NOT NULL,
  group_letter    CHAR(1) NOT NULL,
  advances        BOOLEAN DEFAULT false
);

-- Stores every bracket match pick across all rounds
CREATE TABLE IF NOT EXISTS bracket_picks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id   UUID REFERENCES predictions(id) ON DELETE CASCADE,
  round           TEXT NOT NULL,   -- 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL'
  match_index     INTEGER NOT NULL,
  home_team       TEXT,
  home_flag       TEXT,
  away_team       TEXT,
  away_flag       TEXT,
  winner          TEXT,
  winner_flag     TEXT,
  bracket_half    INTEGER          -- 1 or 2
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_group_picks_pred_id  ON group_picks(prediction_id);
CREATE INDEX IF NOT EXISTS idx_best8_pred_id        ON best8_ranking(prediction_id);
CREATE INDEX IF NOT EXISTS idx_bracket_pred_round   ON bracket_picks(prediction_id, round, match_index);

-- Enable RLS
ALTER TABLE predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_picks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE best8_ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE bracket_picks ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write (no auth required — identified by predictionId only)
CREATE POLICY "allow_all" ON predictions   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON group_picks   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON best8_ranking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON bracket_picks FOR ALL USING (true) WITH CHECK (true);
