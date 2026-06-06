/**
 * GET /api/predictions/group/[letter]
 * Returns the authenticated user's predictions for all 6 matches in a group.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, unauthorized, notFound, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ letter: string }> },
): Promise<Response> {
  try {
    const { letter } = await ctx.params;
    const groupLetter = letter.toUpperCase();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    // Resolve our custom user id
    const { data: dbUser } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!dbUser) return unauthorized('Profile not found');

    // Resolve group
    const { data: group, error: gErr } = await (supabase as any)
      .from('groups')
      .select('id')
      .eq('group_letter', groupLetter)
      .single();
    if (gErr || !group) return notFound(`Group ${groupLetter} not found`);

    // Get match IDs for this group
    const { data: matches } = await (supabase as any)
      .from('group_matches')
      .select('id, match_number, home_team_id, away_team_id, match_status')
      .eq('group_id', group.id)
      .order('match_number', { ascending: true });

    const matchIds = (matches ?? []).map((m: { id: number }) => m.id);

    const { data: predictions } = await (supabase as any)
      .from('user_group_predictions')
      .select(`
        id, predicted_home_score, predicted_away_score,
        predicted_winner, confidence_level, is_confirmed,
        group_match_id, created_at, updated_at
      `)
      .eq('user_id', dbUser.id)
      .in('group_match_id', matchIds);

    return ok({ groupLetter, matches: matches ?? [], predictions: predictions ?? [] });
  } catch (err) {
    logger.error('GET /api/predictions/group/[letter] error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
