/**
 * GET /api/groups/[letter]
 * Returns a group with its matches + the authenticated user's predictions,
 * and live standings calculated from those predictions.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, notFound, serverError } from '@/lib/utils/response';
import { calcStandings } from '@/lib/utils/calcStandings';
import type { TeamRow } from '@/lib/database.types';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ letter: string }> },
): Promise<Response> {
  try {
    const { letter } = await ctx.params;
    const groupLetter = letter.toUpperCase();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Resolve group
    const { data: group, error: gErr } = await (supabase as any)
      .from('groups')
      .select('id, group_letter')
      .eq('group_letter', groupLetter)
      .single();

    if (gErr || !group) return notFound(`Group ${groupLetter} not found`);

    // Get teams in this group
    const { data: teams } = await (supabase as any)
      .from('teams')
      .select('*')
      .eq('group_id', groupLetter)
      .order('fifa_rank', { ascending: true });

    // Get matches with user predictions (if logged in)
    let matchQuery = (supabase as any)
      .from('group_matches')
      .select(`
        *,
        home_team:teams!group_matches_home_team_id_fkey(id, name, flag_emoji, abbreviation),
        away_team:teams!group_matches_away_team_id_fkey(id, name, flag_emoji, abbreviation),
        stadium:stadiums(name, city, country),
        prediction:user_group_predictions!left(
          predicted_home_score, predicted_away_score, confidence_level, is_confirmed
        )
      `)
      .eq('group_id', group.id)
      .order('match_number', { ascending: true });

    // Filter predictions by user if authenticated
    if (user) {
      // NOTE: Supabase filter on join — use separate query if join filter isn't working
      const { data: matches } = await matchQuery;

      // Fetch user's predictions separately to avoid join filter issues
      const matchIds = (matches ?? []).map((m: { id: number }) => m.id);
      const { data: preds } = user
        ? await (supabase as any)
            .from('user_group_predictions')
            .select('group_match_id, predicted_home_score, predicted_away_score, confidence_level, is_confirmed:is_confirmed')
            .eq('user_id', user.id)  // NOTE: our users table uses numeric id, not auth uuid
            .in('group_match_id', matchIds)
        : { data: [] };

      const predMap = new Map((preds ?? []).map((p: { group_match_id: number }) => [p.group_match_id, p]));

      const enrichedMatches = (matches ?? []).map((m: { id: number; home_team_id: number; away_team_id: number }) => ({
        ...m,
        userPrediction: predMap.get(m.id) ?? null,
      }));

      // Calculate standings
      const matchesForCalc = enrichedMatches.map((m: {
        home_team_id: number;
        away_team_id: number;
        userPrediction: { predicted_home_score: number | null; predicted_away_score: number | null } | null;
      }) => ({
        homeTeamId:          m.home_team_id,
        awayTeamId:          m.away_team_id,
        predictedHomeScore:  m.userPrediction?.predicted_home_score ?? null,
        predictedAwayScore:  m.userPrediction?.predicted_away_score ?? null,
      }));

      const standings = calcStandings(teams as TeamRow[], matchesForCalc);

      return ok({ group, teams, matches: enrichedMatches, standings });
    }

    // Unauthenticated — no predictions, no standings
    const { data: matches } = await matchQuery;
    return ok({ group, teams, matches: matches ?? [], standings: [] });
  } catch (err) {
    logger.error('GET /api/groups/[letter] error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
