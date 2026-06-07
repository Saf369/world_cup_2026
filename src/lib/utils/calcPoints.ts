/**
 * XI — Prediction Points Calculator
 * Pure functions — no side effects, easily unit-testable.
 */

export const POINTS = {
  GROUP_CORRECT_RESULT: 2,   // Correct win / draw / loss
  GROUP_EXACT_SCORE:    5,   // Exact scoreline
  KO_CORRECT_WINNER:    3,   // Correct knockout winner
  KO_EXACT_SCORE:       7,   // Exact knockout scoreline
  BONUS_CHAMPION:       15,  // Predicted overall tournament winner
} as const;

type MatchResult = 'HOME' | 'AWAY' | 'DRAW';

function getResult(home: number, away: number): MatchResult {
  if (home > away) return 'HOME';
  if (away > home) return 'AWAY';
  return 'DRAW';
}

export interface GroupPrediction {
  homeScore: number;
  awayScore: number;
}

export interface OfficialGroupResult {
  homeScore: number;
  awayScore: number;
}

/** Returns points earned for a group stage prediction. */
export function calcGroupPoints(
  prediction: GroupPrediction,
  official: OfficialGroupResult,
): number {
  let pts = 0;
  const predResult = getResult(prediction.homeScore, prediction.awayScore);
  const offResult  = getResult(official.homeScore,  official.awayScore);

  if (predResult === offResult) pts += POINTS.GROUP_CORRECT_RESULT;
  if (
    prediction.homeScore === official.homeScore &&
    prediction.awayScore === official.awayScore
  ) {
    pts += POINTS.GROUP_EXACT_SCORE;
  }
  return pts;
}

export interface KOPrediction {
  winnerId: number;
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface OfficialKOResult {
  winnerId: number;
  homeScore?: number | null;
  awayScore?: number | null;
}

/** Returns points earned for a knockout stage prediction. */
export function calcKOPoints(prediction: KOPrediction, official: OfficialKOResult): number {
  let pts = 0;
  if (prediction.winnerId === official.winnerId) pts += POINTS.KO_CORRECT_WINNER;
  if (
    prediction.homeScore != null &&
    prediction.awayScore != null &&
    prediction.homeScore === official.homeScore &&
    prediction.awayScore === official.awayScore
  ) {
    pts += POINTS.KO_EXACT_SCORE;
  }
  return pts;
}

/** Determine predicted winner from a score (returns null for draw). */
export function derivePredictedWinner(
  homeScore: number,
  awayScore: number,
  homeTeamId: number,
  awayTeamId: number,
): number | null {
  if (homeScore > awayScore) return homeTeamId;
  if (awayScore > homeScore) return awayTeamId;
  return null; // draw
}
