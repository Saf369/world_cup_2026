/**
 * GET  /api/teams        — All 48 teams
 * GET  /api/teams/[id]   — Single team by ID
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, notFound, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('teams')
      .select('*')
      .order('fifa_rank', { ascending: true });

    if (error) throw error;
    return ok({ teams: data ?? [] });
  } catch (err) {
    logger.error('GET /api/teams error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
