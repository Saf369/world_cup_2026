/**
 * POST /api/bracket/save-pick
 * Upserts a single bracket match pick.
 * Called fire-and-forget whenever a winner is clicked.
 * Body: { predictionId, round, matchIndex, homeTeam, homeFlag, awayTeam, awayFlag, winner, winnerFlag, bracketHalf }
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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const {
      predictionId, round, matchIndex,
      homeTeam, homeFlag, awayTeam, awayFlag,
      winner, winnerFlag, bracketHalf,
    } = body;

    if (!predictionId || !round || matchIndex === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert: delete existing pick for this slot then insert
    await fetch(
      `${SUPABASE_URL}/rest/v1/bracket_picks?prediction_id=eq.${predictionId}&round=eq.${round}&match_index=eq.${matchIndex}`,
      { method: 'DELETE', headers },
    );

    const res = await fetch(`${SUPABASE_URL}/rest/v1/bracket_picks`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        prediction_id: predictionId,
        round,
        match_index:   matchIndex,
        home_team:     homeTeam || "TBD",
        home_flag:     homeFlag || "",
        away_team:     awayTeam || "TBD",
        away_flag:     awayFlag || "",
        winner:        winner || null,
        winner_flag:   winnerFlag || null,
        bracket_half:  bracketHalf || null,
      }),
    });

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
