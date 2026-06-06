/**
 * MUNDIAL — Group Standings Calculator
 * Pure function: takes teams + matches (with user predictions) and returns
 * sorted standings following the 2026 FIFA World Cup tiebreaker rules:
 *   1. Points
 *   2. Goal Difference
 *   3. Goals For
 *   4. Head-to-Head Points
 *   5. Head-to-Head GD
 *   6. Head-to-Head GF
 *   7. Random draw (represented as 0 / no change)
 */

import type { TeamRow } from '../database.types';

export interface MatchForStandings {
  homeTeamId: number;
  awayTeamId: number;
  predictedHomeScore: number | null;
  predictedAwayScore: number | null;
}

export interface StandingRow {
  team: TeamRow;
  p: number;   // played
  w: number;   // won
  d: number;   // drawn
  l: number;   // lost
  gf: number;  // goals for
  ga: number;  // goals against
  gd: number;  // goal difference
  pts: number; // points
}

export function calcStandings(teams: TeamRow[], matches: MatchForStandings[]): StandingRow[] {
  // Build index map for O(1) lookups
  const idx: Record<number, number> = {};
  const table: StandingRow[] = teams.map((team, i) => {
    idx[team.id] = i;
    return { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });

  for (const m of matches) {
    if (m.predictedHomeScore === null || m.predictedAwayScore === null) continue;
    const hs = m.predictedHomeScore;
    const as = m.predictedAwayScore;
    const hi = idx[m.homeTeamId];
    const ai = idx[m.awayTeamId];
    if (hi === undefined || ai === undefined) continue;

    table[hi].p++; table[ai].p++;
    table[hi].gf += hs; table[hi].ga += as;
    table[ai].gf += as; table[ai].ga += hs;

    if (hs > as) {
      table[hi].w++; table[hi].pts += 3;
      table[ai].l++;
    } else if (as > hs) {
      table[ai].w++; table[ai].pts += 3;
      table[hi].l++;
    } else {
      table[hi].d++; table[hi].pts++;
      table[ai].d++; table[ai].pts++;
    }
  }

  // Compute GD
  for (const row of table) row.gd = row.gf - row.ga;

  // Sort with full tiebreaker chain
  table.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd  !== a.gd)  return b.gd  - a.gd;
    if (b.gf  !== a.gf)  return b.gf  - a.gf;
    return calcH2H(a, b, matches);
  });

  return table;
}

function calcH2H(a: StandingRow, b: StandingRow, matches: MatchForStandings[]): number {
  const m = matches.find(
    (m) =>
      (m.homeTeamId === a.team.id && m.awayTeamId === b.team.id) ||
      (m.homeTeamId === b.team.id && m.awayTeamId === a.team.id),
  );

  if (!m || m.predictedHomeScore === null || m.predictedAwayScore === null) return 0;

  const hs = m.predictedHomeScore;
  const as = m.predictedAwayScore;

  if (m.homeTeamId === a.team.id) {
    // a is home
    if (hs > as) return -1; // a wins h2h → a first
    if (as > hs) return 1;  // b wins h2h → b first
  } else {
    // b is home
    if (as > hs) return -1; // a wins h2h → a first
    if (hs > as) return 1;  // b wins h2h → b first
  }

  // H2H GD
  const aGD = m.homeTeamId === a.team.id ? hs - as : as - hs;
  const bGD = -aGD;
  if (aGD !== bGD) return bGD - aGD;

  return 0; // draw — FIFA uses random draw
}

/**
 * Find the 8 best third-place teams from 12 groups.
 * Used for R32 qualification in the 2026 format.
 */
export interface ThirdPlaceResult {
  qualifies: StandingRow[];
  eliminated: StandingRow[];
}

export function calcBestThird(allGroupStandings: StandingRow[][]): ThirdPlaceResult {
  const thirds = allGroupStandings.map((g) => g[2]).filter(Boolean) as StandingRow[];

  thirds.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd  !== a.gd)  return b.gd  - a.gd;
    return b.gf - a.gf;
  });

  return {
    qualifies:  thirds.slice(0, 8),
    eliminated: thirds.slice(8),
  };
}
