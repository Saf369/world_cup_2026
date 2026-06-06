/**
 * GET /api/teams/[id]
 * Returns a single team by numeric ID.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, notFound, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const teamId = Number(id);
    if (isNaN(teamId)) return notFound('Invalid team ID');

    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();

    if (error || !data) return notFound('Team not found');
    return ok({ team: data });
  } catch (err) {
    logger.error('GET /api/teams/[id] error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
