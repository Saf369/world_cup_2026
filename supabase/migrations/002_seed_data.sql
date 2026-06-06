-- ═══════════════════════════════════════════════════════════════════════════
-- MUNDIAL — Seed Data
-- Migration: 002_seed_data.sql
-- Run AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── GROUPS (A–L) ───────────────────────────────────────────────────────────

INSERT INTO groups (group_letter) VALUES
  ('A'), ('B'), ('C'), ('D'),
  ('E'), ('F'), ('G'), ('H'),
  ('I'), ('J'), ('K'), ('L');

-- ─── STADIUMS (16 venues) ───────────────────────────────────────────────────

INSERT INTO stadiums (name, city, country, capacity, latitude, longitude, timezone) VALUES
  -- USA (11)
  ('MetLife Stadium',          'East Rutherford', 'USA',    82500, 40.81359, -74.07433, 'America/New_York'),
  ('AT&T Stadium',             'Arlington',        'USA',   100000, 32.74787, -97.09329, 'America/Chicago'),
  ('SoFi Stadium',             'Inglewood',        'USA',   100240, 33.95324, -118.33868,'America/Los_Angeles'),
  ('Mercedes-Benz Stadium',    'Atlanta',           'USA',   71000, 33.75534, -84.40098, 'America/New_York'),
  ('NRG Stadium',              'Houston',           'USA',   72220, 29.68479, -95.41057, 'America/Chicago'),
  ('Lumen Field',              'Seattle',           'USA',   69000, 47.59514, -122.33173,'America/Los_Angeles'),
  ('Levi''s Stadium',          'Santa Clara',       'USA',   68500, 37.40296, -121.96990,'America/Los_Angeles'),
  ('Hard Rock Stadium',        'Miami Gardens',     'USA',   65326, 25.95797, -80.23886, 'America/New_York'),
  ('Arrowhead Stadium',        'Kansas City',       'USA',   76416, 39.04897, -94.48393, 'America/Chicago'),
  ('Gillette Stadium',         'Foxborough',        'USA',   65878, 42.09094, -71.26440, 'America/New_York'),
  ('Lincoln Financial Field',  'Philadelphia',      'USA',   69796, 39.90082, -75.16765, 'America/New_York'),
  -- Mexico (3)
  ('Estadio Azteca',           'Mexico City',       'Mexico',87523, 19.30289, -99.15066, 'America/Mexico_City'),
  ('Estadio BBVA',             'Monterrey',         'Mexico',53500, 25.66935, -100.24613,'America/Monterrey'),
  ('Estadio Akron',            'Guadalajara',       'Mexico',49850, 20.67264, -103.61666,'America/Mazatlan'),
  -- Canada (2)
  ('BMO Field',                'Toronto',           'Canada',30000, 43.63341, -79.41864, 'America/Toronto'),
  ('BC Place',                 'Vancouver',         'Canada',54500, 49.27671, -123.11186,'America/Vancouver');

-- ─── KNOCKOUT ROUNDS ────────────────────────────────────────────────────────

INSERT INTO knockout_rounds (round_name, round_number, match_count, scheduled_start) VALUES
  ('R32',   1, 32, '2026-07-04 19:00:00+00'),
  ('R16',   2, 16, '2026-07-11 19:00:00+00'),
  ('QF',    3,  8, '2026-07-18 19:00:00+00'),
  ('SF',    4,  4, '2026-07-22 19:00:00+00'),
  ('FINAL', 5,  2, '2026-07-26 19:00:00+00');

-- ─── TEAMS (48 teams — all 2026 qualifiers) ──────────────────────────────────
-- Sources: FIFA.com, group draw results (May 2026)
-- FIFA ranks as of April 2026 draw

INSERT INTO teams (name, flag_emoji, abbreviation, confederation, fifa_rank, group_id) VALUES
  -- Group A
  ('Mexico',          '🇲🇽', 'MEX', 'CONCACAF', 12, 'A'),
  ('South Africa',    '🇿🇦', 'RSA', 'CAF',       68, 'A'),
  ('South Korea',     '🇰🇷', 'KOR', 'AFC',       22, 'A'),
  ('Czechia',         '🇨🇿', 'CZE', 'UEFA',      36, 'A'),

  -- Group B
  ('Canada',          '🇨🇦', 'CAN', 'CONCACAF', 39, 'B'),
  ('Bosnia-Herz.',    '🇧🇦', 'BIH', 'UEFA',      63, 'B'),
  ('Qatar',           '🇶🇦', 'QAT', 'AFC',       58, 'B'),
  ('Switzerland',     '🇨🇭', 'SUI', 'UEFA',      20, 'B'),

  -- Group C
  ('Brazil',          '🇧🇷', 'BRA', 'CONMEBOL',  5, 'C'),
  ('Morocco',         '🇲🇦', 'MAR', 'CAF',       14, 'C'),
  ('Haiti',           '🇭🇹', 'HAI', 'CONCACAF', 85, 'C'),
  ('Scotland',        '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'SCO', 'UEFA',      37, 'C'),

  -- Group D
  ('USA',             '🇺🇸', 'USA', 'CONCACAF', 13, 'D'),
  ('Paraguay',        '🇵🇾', 'PAR', 'CONMEBOL', 52, 'D'),
  ('Australia',       '🇦🇺', 'AUS', 'AFC',       24, 'D'),
  ('Türkiye',         '🇹🇷', 'TUR', 'UEFA',      30, 'D'),

  -- Group E
  ('Germany',         '🇩🇪', 'GER', 'UEFA',       4, 'E'),
  ('Curaçao',         '🇨🇼', 'CUW', 'CONCACAF', 73, 'E'),
  ('Ivory Coast',     '🇨🇮', 'CIV', 'CAF',       44, 'E'),
  ('Ecuador',         '🇪🇨', 'ECU', 'CONMEBOL', 40, 'E'),

  -- Group F
  ('Netherlands',     '🇳🇱', 'NED', 'UEFA',       7, 'F'),
  ('Japan',           '🇯🇵', 'JPN', 'AFC',       17, 'F'),
  ('Sweden',          '🇸🇪', 'SWE', 'UEFA',      25, 'F'),
  ('Tunisia',         '🇹🇳', 'TUN', 'CAF',       32, 'F'),

  -- Group G
  ('Belgium',         '🇧🇪', 'BEL', 'UEFA',      10, 'G'),
  ('Egypt',           '🇪🇬', 'EGY', 'CAF',       29, 'G'),
  ('Iran',            '🇮🇷', 'IRN', 'AFC',       21, 'G'),
  ('New Zealand',     '🇳🇿', 'NZL', 'OFC',       96, 'G'),

  -- Group H
  ('Spain',           '🇪🇸', 'ESP', 'UEFA',       2, 'H'),
  ('Cape Verde',      '🇨🇻', 'CPV', 'CAF',       62, 'H'),
  ('Saudi Arabia',    '🇸🇦', 'KSA', 'AFC',       55, 'H'),
  ('Uruguay',         '🇺🇾', 'URU', 'CONMEBOL', 16, 'H'),

  -- Group I
  ('France',          '🇫🇷', 'FRA', 'UEFA',       3, 'I'),
  ('Senegal',         '🇸🇳', 'SEN', 'CAF',       18, 'I'),
  ('Iraq',            '🇮🇶', 'IRQ', 'AFC',       60, 'I'),
  ('Norway',          '🇳🇴', 'NOR', 'UEFA',      28, 'I'),

  -- Group J
  ('Argentina',       '🇦🇷', 'ARG', 'CONMEBOL',  1, 'J'),
  ('Algeria',         '🇩🇿', 'ALG', 'CAF',       33, 'J'),
  ('Austria',         '🇦🇹', 'AUT', 'UEFA',      26, 'J'),
  ('Jordan',          '🇯🇴', 'JOR', 'AFC',       71, 'J'),

  -- Group K
  ('Portugal',        '🇵🇹', 'POR', 'UEFA',       6, 'K'),
  ('DR Congo',        '🇨🇩', 'COD', 'CAF',       50, 'K'),
  ('Uzbekistan',      '🇺🇿', 'UZB', 'AFC',       69, 'K'),
  ('Colombia',        '🇨🇴', 'COL', 'CONMEBOL', 11, 'K'),

  -- Group L
  ('England',         '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'ENG', 'UEFA',       8, 'L'),
  ('Croatia',         '🇭🇷', 'CRO', 'UEFA',      15, 'L'),
  ('Ghana',           '🇬🇭', 'GHA', 'CAF',       57, 'L'),
  ('Panama',          '🇵🇦', 'PAN', 'CONCACAF', 78, 'L');

-- ─── GROUP MATCHES (72 total — 6 per group × 12 groups) ─────────────────────
-- Each group of 4 teams plays 6 round-robin matches.
-- Teams within each group:  P1 vs P2, P1 vs P3, P1 vs P4, P2 vs P3, P2 vs P4, P3 vs P4
-- match_number = 1–6 within each group

-- Helper: resolve team IDs by abbreviation within each group
-- NOTE: Supabase executes SQL procedurally; we use CTEs to keep it readable.

WITH group_ids AS (
  SELECT id, group_letter FROM groups
),
team_lookup AS (
  SELECT id, abbreviation, group_id FROM teams
)
INSERT INTO group_matches (group_id, match_number, home_team_id, away_team_id)
SELECT
  g.id,
  matches.match_number,
  t1.id AS home_team_id,
  t2.id AS away_team_id
FROM (
  VALUES
  -- Group A
  ('A', 1, 'MEX', 'RSA'), ('A', 2, 'KOR', 'CZE'),
  ('A', 3, 'MEX', 'KOR'), ('A', 4, 'RSA', 'CZE'),
  ('A', 5, 'MEX', 'CZE'), ('A', 6, 'RSA', 'KOR'),
  -- Group B
  ('B', 1, 'CAN', 'BIH'), ('B', 2, 'QAT', 'SUI'),
  ('B', 3, 'CAN', 'QAT'), ('B', 4, 'BIH', 'SUI'),
  ('B', 5, 'CAN', 'SUI'), ('B', 6, 'BIH', 'QAT'),
  -- Group C
  ('C', 1, 'BRA', 'MAR'), ('C', 2, 'HAI', 'SCO'),
  ('C', 3, 'BRA', 'HAI'), ('C', 4, 'MAR', 'SCO'),
  ('C', 5, 'BRA', 'SCO'), ('C', 6, 'MAR', 'HAI'),
  -- Group D
  ('D', 1, 'USA', 'PAR'), ('D', 2, 'AUS', 'TUR'),
  ('D', 3, 'USA', 'AUS'), ('D', 4, 'PAR', 'TUR'),
  ('D', 5, 'USA', 'TUR'), ('D', 6, 'PAR', 'AUS'),
  -- Group E
  ('E', 1, 'GER', 'CUW'), ('E', 2, 'CIV', 'ECU'),
  ('E', 3, 'GER', 'CIV'), ('E', 4, 'CUW', 'ECU'),
  ('E', 5, 'GER', 'ECU'), ('E', 6, 'CUW', 'CIV'),
  -- Group F
  ('F', 1, 'NED', 'JPN'), ('F', 2, 'SWE', 'TUN'),
  ('F', 3, 'NED', 'SWE'), ('F', 4, 'JPN', 'TUN'),
  ('F', 5, 'NED', 'TUN'), ('F', 6, 'JPN', 'SWE'),
  -- Group G
  ('G', 1, 'BEL', 'EGY'), ('G', 2, 'IRN', 'NZL'),
  ('G', 3, 'BEL', 'IRN'), ('G', 4, 'EGY', 'NZL'),
  ('G', 5, 'BEL', 'NZL'), ('G', 6, 'EGY', 'IRN'),
  -- Group H
  ('H', 1, 'ESP', 'CPV'), ('H', 2, 'KSA', 'URU'),
  ('H', 3, 'ESP', 'KSA'), ('H', 4, 'CPV', 'URU'),
  ('H', 5, 'ESP', 'URU'), ('H', 6, 'CPV', 'KSA'),
  -- Group I
  ('I', 1, 'FRA', 'SEN'), ('I', 2, 'IRQ', 'NOR'),
  ('I', 3, 'FRA', 'IRQ'), ('I', 4, 'SEN', 'NOR'),
  ('I', 5, 'FRA', 'NOR'), ('I', 6, 'SEN', 'IRQ'),
  -- Group J
  ('J', 1, 'ARG', 'ALG'), ('J', 2, 'AUT', 'JOR'),
  ('J', 3, 'ARG', 'AUT'), ('J', 4, 'ALG', 'JOR'),
  ('J', 5, 'ARG', 'JOR'), ('J', 6, 'ALG', 'AUT'),
  -- Group K
  ('K', 1, 'POR', 'COD'), ('K', 2, 'UZB', 'COL'),
  ('K', 3, 'POR', 'UZB'), ('K', 4, 'COD', 'COL'),
  ('K', 5, 'POR', 'COL'), ('K', 6, 'COD', 'UZB'),
  -- Group L
  ('L', 1, 'ENG', 'CRO'), ('L', 2, 'GHA', 'PAN'),
  ('L', 3, 'ENG', 'GHA'), ('L', 4, 'CRO', 'PAN'),
  ('L', 5, 'ENG', 'PAN'), ('L', 6, 'CRO', 'GHA')
) AS matches(group_letter, match_number, home_abbr, away_abbr)
JOIN group_ids g  ON g.group_letter = matches.group_letter
JOIN team_lookup t1 ON t1.abbreviation = matches.home_abbr
JOIN team_lookup t2 ON t2.abbreviation = matches.away_abbr;

-- ─── KNOCKOUT MATCH STUBS (R32 = 32 matches, teams TBD) ─────────────────────
-- Slots are pre-created so users can start bracket predictions.
-- home_team_id / away_team_id remain NULL until group stage results are loaded.

WITH r32 AS (SELECT id FROM knockout_rounds WHERE round_name = 'R32'),
     r16 AS (SELECT id FROM knockout_rounds WHERE round_name = 'R16'),
     qf  AS (SELECT id FROM knockout_rounds WHERE round_name = 'QF'),
     sf  AS (SELECT id FROM knockout_rounds WHERE round_name = 'SF'),
     fin AS (SELECT id FROM knockout_rounds WHERE round_name = 'FINAL')
INSERT INTO knockout_matches (knockout_round_id, match_number)
SELECT r32.id, generate_series(1, 32) FROM r32
UNION ALL
SELECT r16.id, generate_series(1, 16) FROM r16
UNION ALL
SELECT qf.id,  generate_series(1, 8)  FROM qf
UNION ALL
SELECT sf.id,  generate_series(1, 4)  FROM sf
UNION ALL
SELECT fin.id, generate_series(1, 2)  FROM fin;

-- ═══════════════════════════════════════════════════════════════════════════
-- COMPOSITE INDICES (performance tuning)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_ugp_user_group_composite
  ON user_group_predictions(user_id, group_match_id);

CREATE INDEX IF NOT EXISTS idx_ukp_round_composite
  ON knockout_matches(knockout_round_id, match_number);

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFY COUNTS
-- ═══════════════════════════════════════════════════════════════════════════
-- Expected: 12 groups, 48 teams, 16 stadiums, 5 knockout rounds, 72 group matches, 62 knockout match stubs
-- SELECT 'groups' AS tbl, COUNT(*) FROM groups
-- UNION ALL SELECT 'teams', COUNT(*) FROM teams
-- UNION ALL SELECT 'stadiums', COUNT(*) FROM stadiums
-- UNION ALL SELECT 'knockout_rounds', COUNT(*) FROM knockout_rounds
-- UNION ALL SELECT 'group_matches', COUNT(*) FROM group_matches
-- UNION ALL SELECT 'knockout_matches', COUNT(*) FROM knockout_matches;
