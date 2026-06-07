/**
 * POST /api/bracket/save-champion
 * Finalizes the prediction with the confirmed champion.
 * Body: { predictionId, championTeam, championFlag }
 * Returns: { success: boolean }
 */

import { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { predictionId, championTeam, championFlag } = body;

    if (!predictionId || !championTeam) {
      return Response.json({ error: 'Missing predictionId or championTeam' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/predictions?id=eq.${predictionId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          champion_team: championTeam,
          champion_flag: championFlag ?? null,
          is_complete:   true,
          updated_at:    new Date().toISOString(),
        }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
