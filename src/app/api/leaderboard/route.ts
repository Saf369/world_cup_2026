/**
 * GET /api/leaderboard          — Paginated leaderboard (top 50 by default)
 * GET /api/leaderboard/me       — Authenticated user's rank + stats
 * GET /api/leaderboard/top/10   — Top 10 (convenience alias)
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, unauthorized, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const supabase  = await createClient();
    const url       = new URL(req.url);
    const page      = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const limit     = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') ?? '50')));
    const offset    = (page - 1) * limit;

    const { data, error } = await (supabase as any)
      .from('user_standings')
      .select(`
        rank_position, total_points, group_points, knockout_points,
        accuracy_percent, correct_predictions, total_predictions,
        user:users!user_standings_user_id_fkey(
          id, username, display_name, avatar_url, preferred_team
        )
      `)
      .order('total_points', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const { count } = await (supabase as any)
      .from('user_standings')
      .select('id', { count: 'exact', head: true });

    return ok({
      leaderboard: data ?? [],
      pagination: { page, limit, total: count ?? 0, pages: Math.ceil((count ?? 0) / limit) },
    });
  } catch (err) {
    logger.error('GET /api/leaderboard error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
