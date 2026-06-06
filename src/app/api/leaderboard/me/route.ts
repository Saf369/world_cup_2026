/**
 * GET /api/leaderboard/me
 * Returns the authenticated user's rank, points, and accuracy.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, unauthorized, notFound, serverError } from '@/lib/utils/response';
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

    const { data: standing } = await (supabase as any)
      .from('user_standings')
      .select('*')
      .eq('user_id', dbUser.id)
      .single();

    if (!standing) return notFound('Standing not found');

    // Compute live rank (count users with more points)
    const { count } = await (supabase as any)
      .from('user_standings')
      .select('id', { count: 'exact', head: true })
      .gt('total_points', standing.total_points);

    return ok({ standing, rank: (count ?? 0) + 1 });
  } catch (err) {
    logger.error('GET /api/leaderboard/me error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
