/**
 * POST /api/bracket/create
 * Creates a new prediction record.
 * If the caller is authenticated, attaches user_id so the prediction is linked.
 * Returns: { predictionId: string }
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const userName: string = body.userName ?? null;

    // Resolve authenticated user (if any) — reads session cookie
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch { /* not authenticated — anonymous prediction */ }

    // Insert via service-role key so RLS doesn't block anonymous inserts
    const insertBody: Record<string, unknown> = { user_name: userName };
    if (userId) insertBody.user_id = userId;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/predictions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(insertBody),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const [row] = await res.json();
    return Response.json({ predictionId: row.id });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
