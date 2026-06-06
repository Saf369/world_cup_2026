-- ═══════════════════════════════════════════════════════════════════════════
-- MUNDIAL — Migration 003: Backend additions
-- Adds is_confirmed to user_group_predictions (needed by confirm route)
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE user_group_predictions
  ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT FALSE;

-- Composite index for confirmed predictions lookup
CREATE INDEX IF NOT EXISTS idx_ugp_confirmed
  ON user_group_predictions(user_id, is_confirmed);
