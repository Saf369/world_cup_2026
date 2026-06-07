/**
 * POST /api/bracket/save-best8
 * Upserts Best 8 third-place ranking for a prediction.
 * Body: { predictionId: string, ranking: Best8Row[] }
 * Returns: { success: boolean }
 */

import { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  'apikey': SUPABASE_SERVICE_KEY,
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

export const dynamic = 'force-dynamic';

export interface Best8Row {
  rank:        number;
  team:        string;
  flag:        string;
  groupLetter: string;
  advances:    boolean;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { predictionId, ranking }: { predictionId: string; ranking: Best8Row[] } = body;

    if (!predictionId || !Array.isArray(ranking)) {
      return Response.json({ error: 'Missing predictionId or ranking' }, { status: 400 });
    }

    // Delete existing best8 rows for this prediction
    await fetch(`${SUPABASE_URL}/rest/v1/best8_ranking?prediction_id=eq.${predictionId}`, {
      method: 'DELETE',
      headers,
    });

    // Insert fresh
    const rows = ranking.map((r) => ({
      prediction_id: predictionId,
      rank:          r.rank,
      team:          r.team || "TBD",
      flag:          r.flag || "",
      group_letter:  r.groupLetter || "N/A",
      advances:      Boolean(r.advances),
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/best8_ranking`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[save-best8] DB Error:', err);
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
