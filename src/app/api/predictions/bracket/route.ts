/**
 * POST /api/predictions/bracket  — upsert a knockout match prediction
 * GET  /api/predictions/bracket  — get user's full bracket
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validate } from '@/lib/middleware/withValidation';
import { knockoutPredictionSchema } from '@/lib/schemas';
import { ok, created, unauthorized, notFound, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

/** GET /api/predictions/bracket — full bracket for authenticated user */
export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const { data: dbUser } = await (supabase as any)
      .from('users').select('id').eq('email', user.email).single();
    if (!dbUser) return unauthorized('Profile not found');

    const { data: predictions } = await (supabase as any)
      .from('user_knockout_predictions')
      .select(`
        id, predicted_winner_id, predicted_score_h, predicted_score_a,
        confidence_level, top_scorer, created_at, updated_at,
        knockout_match:knockout_matches(
          id, match_number, match_status, official_winner_id,
          home_team_id, away_team_id,
          knockout_round:knockout_rounds(round_name, round_number),
          home_team:teams!knockout_matches_home_team_id_fkey(id, name, flag_emoji, abbreviation),
          away_team:teams!knockout_matches_away_team_id_fkey(id, name, flag_emoji, abbreviation)
        ),
        predicted_winner:teams!user_knockout_predictions_predicted_winner_id_fkey(
          id, name, flag_emoji, abbreviation
        )
      `)
      .eq('user_id', dbUser.id)
      .order('knockout_match.match_number', { ascending: true });

    return ok({ bracket: predictions ?? [] });
  } catch (err) {
    logger.error('GET /api/predictions/bracket error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}

/** POST /api/predictions/bracket — upsert a knockout prediction */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const v = validate(knockoutPredictionSchema, body);
    if (!v.ok) return v.error;

    const {
      knockoutMatchId, predictedWinnerId,
      predictedScoreH, predictedScoreA,
      confidenceLevel, topScorer,
    } = v.data;

    // Verify match exists
    const { data: match } = await (supabase as any)
      .from('knockout_matches')
      .select('id, home_team_id, away_team_id')
      .eq('id', knockoutMatchId)
      .single();
    if (!match) return notFound('Knockout match not found');

    const { data: dbUser } = await (supabase as any)
      .from('users').select('id').eq('email', user.email).single();
    if (!dbUser) return unauthorized('Profile not found');

    const { data: prediction, error } = await (supabase as any)
      .from('user_knockout_predictions')
      .upsert(
        {
          user_id:            dbUser.id,
          knockout_match_id:  knockoutMatchId,
          predicted_winner_id: predictedWinnerId,
          predicted_score_h:  predictedScoreH ?? null,
          predicted_score_a:  predictedScoreA ?? null,
          confidence_level:   confidenceLevel ?? null,
          top_scorer:         topScorer ?? null,
          updated_at:         new Date().toISOString(),
        },
        { onConflict: 'user_id,knockout_match_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return created({ prediction });
  } catch (err) {
    logger.error('POST /api/predictions/bracket error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
