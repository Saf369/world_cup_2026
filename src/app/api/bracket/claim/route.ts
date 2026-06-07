/**
 * POST /api/bracket/claim
 * Links an existing anonymous prediction to the currently logged-in user.
 * Call this from the client when the user logs in and already has a predictionId in localStorage.
 * Body: { predictionId: string }
 * Returns: { success: boolean }
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Must be authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { predictionId } = body;
    if (!predictionId) {
      return Response.json({ error: 'Missing predictionId' }, { status: 400 });
    }

    // PATCH the prediction row to set user_id (only if it isn't already claimed by someone else)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/predictions?id=eq.${predictionId}&user_id=is.null`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ user_id: user.id }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true, userId: user.id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
