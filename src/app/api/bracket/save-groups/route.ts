/**
 * POST /api/bracket/save-groups
 * Upserts all 12 group picks for a prediction.
 * Body: { predictionId: string, groups: GroupPick[] }
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

export interface GroupPick {
  groupLetter: string;
  firstTeam:   string;
  firstFlag:   string;
  secondTeam:  string;
  secondFlag:  string;
  thirdTeam?:  string | null;
  thirdFlag?:  string | null;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { predictionId, groups }: { predictionId: string; groups: GroupPick[] } = body;

    if (!predictionId || !Array.isArray(groups)) {
      return Response.json({ error: 'Missing predictionId or groups' }, { status: 400 });
    }

    // Delete existing group picks for this prediction, BUT ONLY for the groups being updated
    const groupLetters = groups.map(g => g.groupLetter).join(',');
    await fetch(`${SUPABASE_URL}/rest/v1/group_picks?prediction_id=eq.${predictionId}&group_letter=in.(${groupLetters})`, {
      method: 'DELETE',
      headers,
    });

    // Insert fresh
    const rows = groups.map((g) => ({
      prediction_id: predictionId,
      group_letter:  g.groupLetter || "N/A",
      first_team:    g.firstTeam || "TBD",
      first_flag:    g.firstFlag || "",
      second_team:   g.secondTeam || "TBD",
      second_flag:   g.secondFlag || "",
      third_team:    g.thirdTeam || null,
      third_flag:    g.thirdFlag || null,
    }));

    const res = await fetch(`${SUPABASE_URL}/rest/v1/group_picks`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(rows),
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
