-- ═══════════════════════════════════════════════════════════════════════════
-- MUNDIAL — World Cup 2026 Predictor Database Schema
-- Migration: 001_initial_schema.sql
-- Database: PostgreSQL (Supabase)
-- Run this in: Supabase Dashboard → SQL Editor, or via supabase CLI
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (Supabase has this by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────────────────────

CREATE TYPE match_status      AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE confidence_level  AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE prediction_type   AS ENUM ('GROUP', 'KNOCKOUT');
CREATE TYPE knockout_round_name AS ENUM ('R32', 'R16', 'QF', 'SF', 'FINAL');
CREATE TYPE confederation     AS ENUM ('UEFA', 'CONMEBOL', 'CAF', 'AFC', 'CONCACAF', 'OFC');

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 1: USERS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(64)  UNIQUE NOT NULL,
  email           VARCHAR(128) UNIQUE NOT NULL,
  password_hash   VARCHAR(256) NOT NULL,
  display_name    VARCHAR(128),
  avatar_url      VARCHAR(512),
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW(),
  last_login      TIMESTAMPTZ,
  is_active       BOOLEAN      DEFAULT TRUE,
  preferred_team  VARCHAR(64),

  CONSTRAINT users_username_length CHECK (char_length(username) >= 3)
);

CREATE INDEX idx_users_username   ON users(username);
CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 2: STADIUMS  (defined before GROUP_MATCHES foreign key)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE stadiums (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(128) NOT NULL,
  city        VARCHAR(64)  NOT NULL,
  country     VARCHAR(64)  NOT NULL,
  capacity    INTEGER,
  latitude    DECIMAL(10,8),
  longitude   DECIMAL(11,8),
  timezone    VARCHAR(32),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stadiums_city    ON stadiums(city);
CREATE INDEX idx_stadiums_country ON stadiums(country);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 3: GROUPS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE groups (
  id            SERIAL PRIMARY KEY,
  group_letter  VARCHAR(1) UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT groups_letter_valid CHECK (group_letter ~ '^[A-L]$')
);

CREATE INDEX idx_groups_letter ON groups(group_letter);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 4: TEAMS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE teams (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(128) NOT NULL UNIQUE,
  flag_emoji      VARCHAR(16),
  abbreviation    VARCHAR(3)   NOT NULL UNIQUE,
  confederation   confederation,
  fifa_rank       INTEGER,
  group_id        VARCHAR(1),  -- references groups.group_letter (denormalized for convenience)
  seed_position   VARCHAR(10),
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT teams_fifa_rank_positive CHECK (fifa_rank IS NULL OR fifa_rank > 0)
);

CREATE INDEX idx_teams_abbreviation ON teams(abbreviation);
CREATE INDEX idx_teams_group_id     ON teams(group_id);
CREATE INDEX idx_teams_fifa_rank    ON teams(fifa_rank);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 5: GROUP_MATCHES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE group_matches (
  id                    SERIAL PRIMARY KEY,
  group_id              INTEGER       NOT NULL REFERENCES groups(id)    ON DELETE RESTRICT,
  match_number          INTEGER,
  home_team_id          INTEGER       NOT NULL REFERENCES teams(id)     ON DELETE RESTRICT,
  away_team_id          INTEGER       NOT NULL REFERENCES teams(id)     ON DELETE RESTRICT,
  scheduled_date        TIMESTAMPTZ,
  stadium_id            INTEGER       REFERENCES stadiums(id)           ON DELETE SET NULL,
  match_status          match_status  DEFAULT 'not_started',
  official_home_score   INTEGER,
  official_away_score   INTEGER,
  created_at            TIMESTAMPTZ   DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   DEFAULT NOW(),

  CONSTRAINT group_matches_different_teams CHECK (home_team_id <> away_team_id),
  CONSTRAINT group_matches_unique_fixture  UNIQUE (home_team_id, away_team_id, group_id),
  CONSTRAINT group_matches_score_range     CHECK (
    official_home_score IS NULL OR (official_home_score BETWEEN 0 AND 20)
  ),
  CONSTRAINT group_matches_away_score_range CHECK (
    official_away_score IS NULL OR (official_away_score BETWEEN 0 AND 20)
  )
);

CREATE INDEX idx_group_matches_group_id        ON group_matches(group_id);
CREATE INDEX idx_group_matches_scheduled_date  ON group_matches(scheduled_date);
CREATE INDEX idx_group_matches_home_team       ON group_matches(home_team_id);
CREATE INDEX idx_group_matches_away_team       ON group_matches(away_team_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 6: USER_GROUP_PREDICTIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE user_group_predictions (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER          NOT NULL REFERENCES users(id)         ON DELETE CASCADE,
  group_match_id        INTEGER          NOT NULL REFERENCES group_matches(id) ON DELETE CASCADE,
  predicted_home_score  INTEGER,
  predicted_away_score  INTEGER,
  predicted_winner      INTEGER          REFERENCES teams(id)                  ON DELETE SET NULL,
  confidence_level      confidence_level,
  created_at            TIMESTAMPTZ      DEFAULT NOW(),
  updated_at            TIMESTAMPTZ      DEFAULT NOW(),

  CONSTRAINT ugp_unique_prediction        UNIQUE (user_id, group_match_id),
  CONSTRAINT ugp_home_score_range         CHECK (predicted_home_score IS NULL OR predicted_home_score BETWEEN 0 AND 20),
  CONSTRAINT ugp_away_score_range         CHECK (predicted_away_score IS NULL OR predicted_away_score BETWEEN 0 AND 20)
);

CREATE INDEX idx_ugp_user_id        ON user_group_predictions(user_id);
CREATE INDEX idx_ugp_match_id       ON user_group_predictions(group_match_id);
CREATE INDEX idx_ugp_user_group     ON user_group_predictions(user_id, group_match_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 7: KNOCKOUT_ROUNDS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE knockout_rounds (
  id                SERIAL PRIMARY KEY,
  round_name        knockout_round_name NOT NULL,
  round_number      INTEGER             NOT NULL UNIQUE,
  match_count       INTEGER,
  scheduled_start   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT knockout_rounds_number_range CHECK (round_number BETWEEN 1 AND 5)
);

CREATE INDEX idx_knockout_rounds_name ON knockout_rounds(round_name);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 8: KNOCKOUT_MATCHES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE knockout_matches (
  id                    SERIAL PRIMARY KEY,
  knockout_round_id     INTEGER      NOT NULL REFERENCES knockout_rounds(id) ON DELETE RESTRICT,
  match_number          INTEGER,
  home_team_id          INTEGER      REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id          INTEGER      REFERENCES teams(id) ON DELETE SET NULL,
  scheduled_date        TIMESTAMPTZ,
  stadium_id            INTEGER      REFERENCES stadiums(id) ON DELETE SET NULL,
  match_status          match_status DEFAULT 'not_started',
  official_home_score   INTEGER,
  official_away_score   INTEGER,
  official_winner_id    INTEGER      REFERENCES teams(id) ON DELETE SET NULL,
  is_knockout           BOOLEAN      DEFAULT TRUE,
  created_at            TIMESTAMPTZ  DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_knockout_matches_round    ON knockout_matches(knockout_round_id);
CREATE INDEX idx_knockout_matches_date     ON knockout_matches(scheduled_date);
CREATE INDEX idx_knockout_round_number     ON knockout_matches(knockout_round_id, match_number);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 9: USER_KNOCKOUT_PREDICTIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE user_knockout_predictions (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER          NOT NULL REFERENCES users(id)            ON DELETE CASCADE,
  knockout_match_id     INTEGER          NOT NULL REFERENCES knockout_matches(id) ON DELETE CASCADE,
  predicted_winner_id   INTEGER          NOT NULL REFERENCES teams(id)            ON DELETE RESTRICT,
  predicted_score_h     INTEGER,
  predicted_score_a     INTEGER,
  confidence_level      confidence_level,
  top_scorer            VARCHAR(128),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT ukp_unique_prediction UNIQUE (user_id, knockout_match_id)
);

CREATE INDEX idx_ukp_user_id    ON user_knockout_predictions(user_id);
CREATE INDEX idx_ukp_match_id   ON user_knockout_predictions(knockout_match_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 10: USER_STANDINGS  (leaderboard cache)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE user_standings (
  id                  SERIAL PRIMARY KEY,
  user_id             INTEGER      UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_points        INTEGER      DEFAULT 0,
  group_points        INTEGER      DEFAULT 0,
  knockout_points     INTEGER      DEFAULT 0,
  accuracy_percent    DECIMAL(5,2) DEFAULT 0.00,
  correct_predictions INTEGER      DEFAULT 0,
  total_predictions   INTEGER      DEFAULT 0,
  rank_position       INTEGER,
  updated_at          TIMESTAMPTZ  DEFAULT NOW(),

  CONSTRAINT standings_accuracy_range CHECK (accuracy_percent BETWEEN 0.00 AND 100.00)
);

CREATE INDEX idx_standings_total_points  ON user_standings(total_points);
CREATE INDEX idx_standings_rank_position ON user_standings(rank_position);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 11: PREDICTION_ACCURACY  (audit trail)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE prediction_accuracy (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prediction_type   prediction_type NOT NULL,
  match_id          INTEGER,
  match_type        VARCHAR(128),
  is_correct        BOOLEAN,
  points_earned     INTEGER         DEFAULT 0,
  official_result   VARCHAR(64),
  user_prediction   VARCHAR(64),
  created_at        TIMESTAMPTZ     DEFAULT NOW()
);

CREATE INDEX idx_accuracy_user_id         ON prediction_accuracy(user_id);
CREATE INDEX idx_accuracy_prediction_type ON prediction_accuracy(prediction_type);
CREATE INDEX idx_accuracy_created_at      ON prediction_accuracy(created_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 12: SESSIONS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE sessions (
  id              VARCHAR(256) PRIMARY KEY,
  user_id         INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token           VARCHAR(512) UNIQUE NOT NULL,
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(512),
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  last_activity   TIMESTAMPTZ  DEFAULT NOW(),
  is_active       BOOLEAN      DEFAULT TRUE
);

CREATE INDEX idx_sessions_user_id    ON sessions(user_id);
CREATE INDEX idx_sessions_token      ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLE 13: LEADERBOARD_SNAPSHOTS  (historical trend tracking)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE leaderboard_snapshots (
  id                SERIAL PRIMARY KEY,
  snapshot_date     TIMESTAMPTZ  NOT NULL,
  user_id           INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rank_position     INTEGER      NOT NULL,
  total_points      INTEGER,
  accuracy_percent  DECIMAL(5,2),
  created_at        TIMESTAMPTZ  DEFAULT NOW(),

  CONSTRAINT lb_snapshot_unique UNIQUE (snapshot_date, user_id)
);

CREATE INDEX idx_lb_snapshot_date ON leaderboard_snapshots(snapshot_date);
CREATE INDEX idx_lb_rank_position ON leaderboard_snapshots(rank_position);
CREATE INDEX idx_lb_user_id       ON leaderboard_snapshots(user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS — auto-update updated_at timestamps
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_group_matches
  BEFORE UPDATE ON group_matches
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_ugp
  BEFORE UPDATE ON user_group_predictions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_knockout_matches
  BEFORE UPDATE ON knockout_matches
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_ukp
  BEFORE UPDATE ON user_knockout_predictions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_sessions
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) — Supabase best practice
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable RLS on user-data tables
ALTER TABLE users                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_group_predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_knockout_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_standings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_accuracy      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots    ENABLE ROW LEVEL SECURITY;

-- Public read tables (no RLS restriction needed beyond anon key)
ALTER TABLE teams                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE stadiums                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_matches            ENABLE ROW LEVEL SECURITY;
ALTER TABLE knockout_rounds          ENABLE ROW LEVEL SECURITY;
ALTER TABLE knockout_matches         ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read static data
CREATE POLICY "Public read: teams"           ON teams           FOR SELECT USING (true);
CREATE POLICY "Public read: groups"          ON groups          FOR SELECT USING (true);
CREATE POLICY "Public read: stadiums"        ON stadiums        FOR SELECT USING (true);
CREATE POLICY "Public read: group_matches"   ON group_matches   FOR SELECT USING (true);
CREATE POLICY "Public read: knockout_rounds" ON knockout_rounds FOR SELECT USING (true);
CREATE POLICY "Public read: knockout_matches" ON knockout_matches FOR SELECT USING (true);

-- Users can only view/edit their own data
-- NOTE: These policies assume you integrate Supabase Auth and use auth.uid()
-- mapped to users.id via a join or metadata field.
-- For now we use a permissive policy; tighten after auth integration.
CREATE POLICY "Users: read own profile"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users: update own profile"
  ON users FOR UPDATE USING (true);

CREATE POLICY "Predictions: read own"
  ON user_group_predictions FOR SELECT USING (true);

CREATE POLICY "Predictions: insert own"
  ON user_group_predictions FOR INSERT WITH CHECK (true);

CREATE POLICY "Predictions: update own"
  ON user_group_predictions FOR UPDATE USING (true);

CREATE POLICY "Knockout predictions: read own"
  ON user_knockout_predictions FOR SELECT USING (true);

CREATE POLICY "Knockout predictions: insert own"
  ON user_knockout_predictions FOR INSERT WITH CHECK (true);

CREATE POLICY "Knockout predictions: update own"
  ON user_knockout_predictions FOR UPDATE USING (true);

-- Leaderboard is public
CREATE POLICY "Standings: public read"
  ON user_standings FOR SELECT USING (true);

-- Accuracy: own data only
CREATE POLICY "Accuracy: read own"
  ON prediction_accuracy FOR SELECT USING (true);

-- Sessions: own data only
CREATE POLICY "Sessions: read own"
  ON sessions FOR SELECT USING (true);

-- Leaderboard snapshots: public
CREATE POLICY "LB snapshots: public read"
  ON leaderboard_snapshots FOR SELECT USING (true);
