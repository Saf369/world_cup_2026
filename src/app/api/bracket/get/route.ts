/**
 * GET /api/bracket/get?predictionId=xxx
 * Returns the full prediction state for DB hydration on page load.
 * Returns: { prediction, groupPicks, best8Ranking, bracketPicks }
 */

import { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
};

export const dynamic = 'force-dynamic';

async function get(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, { headers });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const predictionId = searchParams.get('predictionId');

    if (!predictionId) {
      return Response.json({ error: 'Missing predictionId' }, { status: 400 });
    }

    const [predictions, groupPicks, best8Ranking, bracketPicks] = await Promise.all([
      get(`/predictions?id=eq.${predictionId}&limit=1`),
      get(`/group_picks?prediction_id=eq.${predictionId}&order=group_letter.asc`),
      get(`/best8_ranking?prediction_id=eq.${predictionId}&order=rank.asc`),
      get(`/bracket_picks?prediction_id=eq.${predictionId}&order=round.asc,match_index.asc`),
    ]);

    if (!predictions || predictions.length === 0) {
      return Response.json({ error: 'Prediction not found' }, { status: 404 });
    }

    return Response.json({
      prediction:   predictions[0],
      groupPicks:   groupPicks   ?? [],
      best8Ranking: best8Ranking ?? [],
      bracketPicks: bracketPicks ?? [],
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
