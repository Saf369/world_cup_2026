/**
 * GET /api/groups
 * Returns all 12 groups with their teams.
 * Public — no auth required.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ok, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();

    const { data: groups, error } = await (supabase as any)
      .from('groups')
      .select('id, group_letter')
      .order('group_letter', { ascending: true });

    if (error) throw error;

    // Attach teams to each group
    const { data: teams } = await (supabase as any)
      .from('teams')
      .select('id, name, flag_emoji, abbreviation, confederation, fifa_rank, group_id')
      .order('fifa_rank', { ascending: true });

    const result = (groups ?? []).map((g: { id: number; group_letter: string }) => ({
      ...g,
      teams: (teams ?? []).filter((t: { group_id: string }) => t.group_id === g.group_letter),
    }));

    return ok({ groups: result });
  } catch (err) {
    logger.error('GET /api/groups error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
