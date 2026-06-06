/**
 * GET /api/standings
 * Live group standings for all 12 groups based on the authenticated user's predictions.
 * Also returns the best 8 third-place teams for bracket qualification.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, unauthorized, serverError } from '@/lib/utils/response';
import { calcStandings, calcBestThird } from '@/lib/utils/calcStandings';
import type { TeamRow } from '@/lib/database.types';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const { data: dbUser } = await (supabase as any)
      .from('users').select('id').eq('email', user.email).single();
    if (!dbUser) return unauthorized('Profile not found');

    // Fetch all groups A–L
    const { data: groups } = await (supabase as any)
      .from('groups')
      .select('id, group_letter')
      .order('group_letter', { ascending: true });

    // Fetch all teams
    const { data: allTeams } = await (supabase as any)
      .from('teams')
      .select('*');

    // Fetch all group matches with this user's predictions
    const { data: allMatches } = await (supabase as any)
      .from('group_matches')
      .select('id, group_id, home_team_id, away_team_id');

    const matchIds = (allMatches ?? []).map((m: { id: number }) => m.id);

    const { data: preds } = await (supabase as any)
      .from('user_group_predictions')
      .select('group_match_id, predicted_home_score, predicted_away_score')
      .eq('user_id', dbUser.id)
      .in('group_match_id', matchIds);

    const predMap = new Map(
      (preds ?? []).map((p: { group_match_id: number }) => [p.group_match_id, p]),
    );

    const teamMap = new Map(
      (allTeams ?? []).map((t: TeamRow) => [t.id, t]),
    );

    // Compute standings per group
    const allGroupStandings = (groups ?? []).map((g: { id: number; group_letter: string }) => {
      const groupMatches = (allMatches ?? []).filter((m: { group_id: number }) => m.group_id === g.id);

      const teamIdSet = new Set<number>(
        groupMatches.flatMap((m: { home_team_id: number; away_team_id: number }) => [
          m.home_team_id,
          m.away_team_id,
        ]),
      );
      const teamIds: number[] = Array.from(teamIdSet);

      const teams = teamIds.map((id) => teamMap.get(id)).filter(Boolean) as TeamRow[];

      const matchesForCalc = groupMatches.map((m: { id: number; home_team_id: number; away_team_id: number }) => {
        const pred = predMap.get(m.id) as
          | { predicted_home_score: number | null; predicted_away_score: number | null }
          | undefined;
        return {
          homeTeamId:          m.home_team_id,
          awayTeamId:          m.away_team_id,
          predictedHomeScore:  pred?.predicted_home_score ?? null,
          predictedAwayScore:  pred?.predicted_away_score ?? null,
        };
      });

      return {
        groupLetter: g.group_letter,
        standings:   calcStandings(teams, matchesForCalc),
      };
    });

    const { qualifies, eliminated } = calcBestThird(
      allGroupStandings.map((g: { standings: ReturnType<typeof calcStandings> }) => g.standings),
    );

    return ok({
      groups: allGroupStandings,
      bestThird: { qualifies, eliminated },
    });
  } catch (err) {
    logger.error('GET /api/standings error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
