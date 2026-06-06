/**
 * POST /api/predictions/group/confirm
 * Marks all 6 group predictions as confirmed (locked in).
 * Requires all 6 match predictions to exist first.
 */

import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validate } from '@/lib/middleware/withValidation';
import { confirmGroupSchema } from '@/lib/schemas';
import { ok, unauthorized, notFound, badRequest, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const body = await req.json().catch(() => ({}));
    const v = validate(confirmGroupSchema, body);
    if (!v.ok) return v.error;

    const { groupLetter } = v.data;

    const { data: dbUser } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!dbUser) return unauthorized('Profile not found');

    // Resolve group
    const { data: group } = await (supabase as any)
      .from('groups')
      .select('id')
      .eq('group_letter', groupLetter)
      .single();
    if (!group) return notFound(`Group ${groupLetter} not found`);

    // Get all match IDs for this group
    const { data: matches } = await (supabase as any)
      .from('group_matches')
      .select('id')
      .eq('group_id', group.id);

    const matchIds = (matches ?? []).map((m: { id: number }) => m.id);

    // Check user has predictions for all 6 matches
    const { data: preds } = await (supabase as any)
      .from('user_group_predictions')
      .select('id')
      .eq('user_id', dbUser.id)
      .in('group_match_id', matchIds);

    if ((preds ?? []).length < matchIds.length) {
      return badRequest(`Fill all ${matchIds.length} matches before confirming`);
    }

    // Mark all as confirmed
    const { error } = await (supabase as any)
      .from('user_group_predictions')
      .update({ is_confirmed: true, updated_at: new Date().toISOString() })
      .eq('user_id', dbUser.id)
      .in('group_match_id', matchIds);

    if (error) throw error;

    logger.info(`User ${dbUser.id} confirmed Group ${groupLetter}`);
    return ok({ confirmed: true, groupLetter, matchCount: matchIds.length });
  } catch (err) {
    logger.error('POST /api/predictions/group/confirm error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
