/**
 * POST /api/bracket/create
 * Creates a new prediction record.
 * If the caller is authenticated, stamps the auth user_id (UUID) on the
 * prediction so it can be joined back to the user for champion tracing.
 * Returns: { predictionId: string }
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const serviceHeaders = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const userName: string = body.userName ?? null;

    // Resolve authenticated user (if any) — reads session cookie
    // predictions.user_id is a UUID FK referencing auth.users.id
    let authUserId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      authUserId = user?.id ?? null;
    } catch { /* not authenticated — anonymous prediction */ }

    // Insert via service-role key so RLS doesn't block anonymous inserts
    const insertBody: Record<string, unknown> = { user_name: userName };
    if (authUserId) insertBody.user_id = authUserId;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/predictions`, {
      method: 'POST',
      headers: { ...serviceHeaders, 'Prefer': 'return=representation' },
      body: JSON.stringify(insertBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[bracket/create] DB Error:', err);
      return Response.json({ error: err }, { status: 500 });
    }

    let row;
    try {
      const parsed = await res.json();
      row = parsed[0];
    } catch {
      return Response.json({ error: 'Upstream returned invalid JSON' }, { status: 502 });
    }
    return Response.json({ predictionId: row?.id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
