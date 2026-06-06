/**
 * GET  /api/predictions/group/[letter]  — get user's predictions for a group
 * POST /api/predictions/group           — save / update a group match prediction
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validate } from '@/lib/middleware/withValidation';
import { groupPredictionSchema } from '@/lib/schemas';
import { ok, created, unauthorized, notFound, serverError } from '@/lib/utils/response';
import { derivePredictedWinner } from '@/lib/utils/calcPoints';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

/** POST /api/predictions/group — upsert a group match prediction */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const v = validate(groupPredictionSchema, body);
    if (!v.ok) return v.error;

    const { groupMatchId, predictedHomeScore, predictedAwayScore, confidenceLevel } = v.data;

    // Get match to derive winner
    const { data: match, error: mErr } = await (supabase as any)
      .from('group_matches')
      .select('id, home_team_id, away_team_id')
      .eq('id', groupMatchId)
      .single();

    if (mErr || !match) return notFound('Match not found');

    const predictedWinner = derivePredictedWinner(
      predictedHomeScore,
      predictedAwayScore,
      match.home_team_id,
      match.away_team_id,
    );

    // Resolve our custom user_id from email
    const { data: dbUser } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!dbUser) return unauthorized('User profile not found');

    // Upsert prediction
    const { data: prediction, error } = await (supabase as any)
      .from('user_group_predictions')
      .upsert(
        {
          user_id:              dbUser.id,
          group_match_id:       groupMatchId,
          predicted_home_score: predictedHomeScore,
          predicted_away_score: predictedAwayScore,
          predicted_winner:     predictedWinner,
          confidence_level:     confidenceLevel ?? null,
          updated_at:           new Date().toISOString(),
        },
        { onConflict: 'user_id,group_match_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return created({ prediction });
  } catch (err) {
    logger.error('POST /api/predictions/group error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
