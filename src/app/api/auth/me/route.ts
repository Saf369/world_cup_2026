/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Requires a valid Supabase session cookie.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, unauthorized, notFound, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return unauthorized();

    // Fetch our custom profile (not just Supabase auth user)
    const { data: profile } = await (supabase as any)
      .from('users')
      .select(`
        id, username, display_name, avatar_url, preferred_team,
        email, created_at, last_login,
        standing:user_standings(total_points, rank_position, accuracy_percent)
      `)
      .eq('email', user.email)
      .eq('is_active', true)
      .single();

    if (!profile) return notFound('User profile not found');

    return ok({ user: profile });
  } catch (err) {
    logger.error('GET /api/auth/me error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
