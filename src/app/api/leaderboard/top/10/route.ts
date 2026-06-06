/**
 * GET /api/leaderboard/top/10
 * Returns the top 10 users — convenience shortcut for the homepage widget.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();

    const { data, error } = await (supabase as any)
      .from('user_standings')
      .select(`
        rank_position, total_points, accuracy_percent,
        correct_predictions, total_predictions,
        user:users!user_standings_user_id_fkey(
          id, username, display_name, avatar_url, preferred_team
        )
      `)
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) throw error;

    return ok({ top10: data ?? [] });
  } catch (err) {
    logger.error('GET /api/leaderboard/top/10 error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
