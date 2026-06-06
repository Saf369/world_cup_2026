/**
 * MUNDIAL — Database Service Layer
 * All DB operations, grouped by domain. Uses server client by default.
 * Import specific helpers in Route Handlers and Server Components.
 *
 * Type Strategy:
 * - Supabase's typed generic requires CLI-generated types (`supabase gen types typescript`).
 * - Until the CLI is run against the live DB, we use the untyped client and
 *   cast return values explicitly. This gives full type safety at call sites
 *   without requiring CLI setup.
 * - After running `supabase gen types`, replace the manual casts with the
 *   generated Database type in server.ts / client.ts.
 */

import { createClient } from './supabase/server';
import type {
  GroupMatchRow,
  GroupRow,
  GroupStanding,
  InsertUserGroupPrediction,
  InsertUserKnockoutPrediction,
  KnockoutMatchRow,
  KnockoutRoundName,
  KnockoutRoundRow,
  LeaderboardEntry,
  StadiumRow,
  TeamRow,
  UpdateGroupPrediction,
  UpdateKnockoutPrediction,
  UserGroupPredictionRow,
  UserKnockoutPredictionRow,
  UserStandingRow,
} from './database.types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertNoError(error: any, context: string): void {
  if (error) throw new Error(`[DB:${context}] ${error.message}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

// ─── AUTH / USERS ─────────────────────────────────────────────────────────────

type UserPublicProfile = {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_team: string | null;
  created_at: string;
};

/** Fetch a single user by ID (public profile fields only). */
export async function getUserById(userId: number): Promise<UserPublicProfile | null> {
  const supabase: AnyClient = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, username, display_name, avatar_url, preferred_team, created_at')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  assertNoError(error, 'getUserById');
  return data as UserPublicProfile | null;
}

/** Update user profile fields. */
export async function updateUserProfile(
  userId: number,
  fields: { display_name?: string; avatar_url?: string; preferred_team?: string },
) {
  const supabase: AnyClient = await createClient();
  const { data, error } = await supabase
    .from('users')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  assertNoError(error, 'updateUserProfile');
  return data as UserPublicProfile | null;
}

// ─── TEAMS & GROUPS ───────────────────────────────────────────────────────────

/** Fetch all teams for a specific group letter (A–L). */
export async function getTeamsByGroup(groupLetter: string): Promise<TeamRow[]> {
  const supabase: AnyClient = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('group_id', groupLetter)
    .order('fifa_rank', { ascending: true });

  assertNoError(error, 'getTeamsByGroup');
  return (data ?? []) as TeamRow[];
}

/** Fetch all 48 teams. */
export async function getAllTeams(): Promise<TeamRow[]> {
  const supabase: AnyClient = await createClient();
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('fifa_rank', { ascending: true });

  assertNoError(error, 'getAllTeams');
  return (data ?? []) as TeamRow[];
}

/** Fetch all 12 groups. */
export async function getAllGroups(): Promise<GroupRow[]> {
  const supabase: AnyClient = await createClient();
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('group_letter', { ascending: true });

  assertNoError(error, 'getAllGroups');
  return (data ?? []) as GroupRow[];
}

// ─── GROUP MATCHES ────────────────────────────────────────────────────────────

/** Resolve group letter → group.id */
async function resolveGroupId(supabase: AnyClient, groupLetter: string): Promise<number> {
  const { data, error } = await supabase
    .from('groups')
    .select('id')
    .eq('group_letter', groupLetter)
    .single();

  if (error || !data) throw new Error(`Group "${groupLetter}" not found`);
  return (data as { id: number }).id;
}

/**
 * Fetch all 6 matches for a group with team info.
 * GET /api/groups/:groupLetter
 */
export async function getGroupMatches(groupLetter: string) {
  const supabase: AnyClient = await createClient();
  const groupId = await resolveGroupId(supabase, groupLetter);

  const { data, error } = await supabase
    .from('group_matches')
    .select(`
      *,
      home_team:teams!group_matches_home_team_id_fkey(*),
      away_team:teams!group_matches_away_team_id_fkey(*),
      stadium:stadiums(*)
    `)
    .eq('group_id', groupId)
    .order('match_number', { ascending: true });

  assertNoError(error, 'getGroupMatches');
  return (data ?? []) as (GroupMatchRow & {
    home_team: TeamRow;
    away_team: TeamRow;
    stadium: StadiumRow | null;
  })[];
}

/**
 * Fetch group matches WITH the user's predictions for each match.
 */
export async function getGroupMatchesWithPredictions(groupLetter: string, userId: number) {
  const supabase: AnyClient = await createClient();
  const groupId = await resolveGroupId(supabase, groupLetter);

  const { data, error } = await supabase
    .from('group_matches')
    .select(`
      *,
      home_team:teams!group_matches_home_team_id_fkey(*),
      away_team:teams!group_matches_away_team_id_fkey(*),
      prediction:user_group_predictions!left(*)
    `)
    .eq('group_id', groupId)
    .eq('user_group_predictions.user_id', userId)
    .order('match_number', { ascending: true });

  assertNoError(error, 'getGroupMatchesWithPredictions');
  return (data ?? []) as (GroupMatchRow & {
    home_team: TeamRow;
    away_team: TeamRow;
    prediction: UserGroupPredictionRow[] | null;
  })[];
}

// ─── GROUP STANDINGS ──────────────────────────────────────────────────────────

/**
 * Calculate live group standings from a user's predictions.
 * W=3pts, D=1pt, L=0pts. Sorted by pts → GD → GF.
 */
export async function calculateGroupStandings(
  groupLetter: string,
  userId: number,
): Promise<GroupStanding[]> {
  const supabase: AnyClient = await createClient();
  const groupId = await resolveGroupId(supabase, groupLetter);

  const { data: matches, error } = await supabase
    .from('group_matches')
    .select(`
      id, home_team_id, away_team_id,
      home_team:teams!group_matches_home_team_id_fkey(*),
      away_team:teams!group_matches_away_team_id_fkey(*),
      user_group_predictions!inner(predicted_home_score, predicted_away_score)
    `)
    .eq('group_id', groupId)
    .eq('user_group_predictions.user_id', userId);

  assertNoError(error, 'calculateGroupStandings');
  if (!matches || matches.length === 0) return [];

  type MatchRow = {
    home_team: TeamRow;
    away_team: TeamRow;
    user_group_predictions: { predicted_home_score: number | null; predicted_away_score: number | null }[];
  };

  const teamMap = new Map<number, GroupStanding>();

  const addTeam = (team: TeamRow) => {
    if (!teamMap.has(team.id)) {
      teamMap.set(team.id, {
        team,
        played: 0, won: 0, drawn: 0, lost: 0,
        goals_for: 0, goals_against: 0, goal_diff: 0, points: 0,
      });
    }
  };

  for (const m of (matches as MatchRow[])) {
    const pred = m.user_group_predictions?.[0];
    if (!pred || pred.predicted_home_score === null || pred.predicted_away_score === null) continue;

    addTeam(m.home_team);
    addTeam(m.away_team);

    const h = pred.predicted_home_score;
    const a = pred.predicted_away_score;
    const homeS = teamMap.get(m.home_team.id)!;
    const awayS = teamMap.get(m.away_team.id)!;

    homeS.played++; awayS.played++;
    homeS.goals_for += h; homeS.goals_against += a;
    awayS.goals_for += a; awayS.goals_against += h;

    if (h > a)      { homeS.won++; homeS.points += 3; awayS.lost++; }
    else if (h < a) { awayS.won++; awayS.points += 3; homeS.lost++; }
    else            { homeS.drawn++; homeS.points++; awayS.drawn++; awayS.points++; }
  }

  return Array.from(teamMap.values())
    .map((s) => ({ ...s, goal_diff: s.goals_for - s.goals_against }))
    .sort((a, b) =>
      b.points - a.points ||
      b.goal_diff - a.goal_diff ||
      b.goals_for - a.goals_for,
    );
}

// ─── USER GROUP PREDICTIONS ───────────────────────────────────────────────────

/**
 * Upsert a group match prediction (insert or update).
 * POST /api/predictions/group
 */
export async function upsertGroupPrediction(prediction: InsertUserGroupPrediction) {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_group_predictions')
    .upsert(
      { ...prediction, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,group_match_id' },
    )
    .select()
    .single();

  assertNoError(error, 'upsertGroupPrediction');
  return data as UserGroupPredictionRow | null;
}

/** Update an existing group prediction. */
export async function updateGroupPrediction(
  userId: number,
  groupMatchId: number,
  fields: UpdateGroupPrediction,
) {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_group_predictions')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('group_match_id', groupMatchId)
    .select()
    .single();

  assertNoError(error, 'updateGroupPrediction');
  return data as UserGroupPredictionRow | null;
}

/** Get all of a user's group predictions for one group. */
export async function getUserGroupPredictions(userId: number, groupLetter: string) {
  const supabase: AnyClient = await createClient();
  const groupId = await resolveGroupId(supabase, groupLetter);

  const { data, error } = await supabase
    .from('user_group_predictions')
    .select(`
      *,
      group_match:group_matches!inner(
        *,
        home_team:teams!group_matches_home_team_id_fkey(*),
        away_team:teams!group_matches_away_team_id_fkey(*)
      )
    `)
    .eq('user_id', userId)
    .eq('group_matches.group_id', groupId)
    .order('group_matches.match_number', { ascending: true });

  assertNoError(error, 'getUserGroupPredictions');
  return (data ?? []) as (UserGroupPredictionRow & {
    group_match: GroupMatchRow & { home_team: TeamRow; away_team: TeamRow };
  })[];
}

// ─── KNOCKOUT MATCHES ─────────────────────────────────────────────────────────

/** Resolve round name → knockout_rounds.id */
async function resolveRoundId(supabase: AnyClient, roundName: KnockoutRoundName): Promise<number> {
  const { data, error } = await supabase
    .from('knockout_rounds')
    .select('id')
    .eq('round_name', roundName)
    .single();

  if (error || !data) throw new Error(`Knockout round "${roundName}" not found`);
  return (data as { id: number }).id;
}

/**
 * Fetch knockout matches for a round with team data.
 */
export async function getKnockoutMatchesByRound(roundName: KnockoutRoundName) {
  const supabase: AnyClient = await createClient();
  const roundId = await resolveRoundId(supabase, roundName);

  const { data, error } = await supabase
    .from('knockout_matches')
    .select(`
      *,
      home_team:teams!knockout_matches_home_team_id_fkey(*),
      away_team:teams!knockout_matches_away_team_id_fkey(*),
      official_winner:teams!knockout_matches_official_winner_id_fkey(*),
      knockout_round:knockout_rounds(*)
    `)
    .eq('knockout_round_id', roundId)
    .order('match_number', { ascending: true });

  assertNoError(error, 'getKnockoutMatchesByRound');
  return (data ?? []) as (KnockoutMatchRow & {
    home_team: TeamRow | null;
    away_team: TeamRow | null;
    official_winner: TeamRow | null;
    knockout_round: KnockoutRoundRow;
  })[];
}

// ─── USER KNOCKOUT PREDICTIONS ────────────────────────────────────────────────

/**
 * Upsert a knockout match prediction.
 * POST /api/predictions/bracket/:roundName
 */
export async function upsertKnockoutPrediction(prediction: InsertUserKnockoutPrediction) {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_knockout_predictions')
    .upsert(
      { ...prediction, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,knockout_match_id' },
    )
    .select()
    .single();

  assertNoError(error, 'upsertKnockoutPrediction');
  return data as UserKnockoutPredictionRow | null;
}

/** Update an existing knockout prediction. */
export async function updateKnockoutPrediction(
  userId: number,
  knockoutMatchId: number,
  fields: UpdateKnockoutPrediction,
) {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_knockout_predictions')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('knockout_match_id', knockoutMatchId)
    .select()
    .single();

  assertNoError(error, 'updateKnockoutPrediction');
  return data as UserKnockoutPredictionRow | null;
}

/**
 * Fetch user's bracket predictions for a specific knockout round.
 * GET /api/bracket/:userId/:roundName
 */
export async function getUserKnockoutPredictions(userId: number, roundName: KnockoutRoundName) {
  const supabase: AnyClient = await createClient();
  const roundId = await resolveRoundId(supabase, roundName);

  const { data, error } = await supabase
    .from('user_knockout_predictions')
    .select(`
      *,
      knockout_match:knockout_matches!inner(
        *,
        home_team:teams!knockout_matches_home_team_id_fkey(*),
        away_team:teams!knockout_matches_away_team_id_fkey(*)
      ),
      predicted_team:teams!user_knockout_predictions_predicted_winner_id_fkey(*)
    `)
    .eq('user_id', userId)
    .eq('knockout_matches.knockout_round_id', roundId)
    .order('knockout_matches.match_number', { ascending: true });

  assertNoError(error, 'getUserKnockoutPredictions');
  return (data ?? []) as (UserKnockoutPredictionRow & {
    knockout_match: KnockoutMatchRow & { home_team: TeamRow | null; away_team: TeamRow | null };
    predicted_team: TeamRow;
  })[];
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────

/**
 * Fetch top N users from the leaderboard cache.
 * GET /api/leaderboard
 */
export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_standings')
    .select(`
      rank_position,
      total_points,
      accuracy_percent,
      correct_predictions,
      total_predictions,
      user:users!user_standings_user_id_fkey(username, display_name, avatar_url)
    `)
    .order('total_points', { ascending: false })
    .limit(limit);

  assertNoError(error, 'getLeaderboard');

  type RawRow = {
    rank_position: number | null;
    total_points: number;
    accuracy_percent: number;
    correct_predictions: number;
    total_predictions: number;
    user: { username: string; display_name: string | null; avatar_url: string | null };
  };

  return ((data ?? []) as RawRow[]).map((row) => ({
    rank_position: row.rank_position ?? 0,
    username: row.user.username,
    display_name: row.user.display_name,
    avatar_url: row.user.avatar_url,
    total_points: row.total_points,
    accuracy_percent: Number(row.accuracy_percent),
    correct_predictions: row.correct_predictions,
    total_predictions: row.total_predictions,
  }));
}

/** Get a single user's standing. */
export async function getUserStanding(userId: number): Promise<UserStandingRow | null> {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('user_standings')
    .select('*')
    .eq('user_id', userId)
    .single();

  assertNoError(error, 'getUserStanding');
  return data as UserStandingRow | null;
}

// ─── PREDICTION ACCURACY ──────────────────────────────────────────────────────

/**
 * Fetch prediction accuracy audit trail for a user.
 * GET /api/user/:userId/accuracy
 */
export async function getUserAccuracy(userId: number) {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('prediction_accuracy')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  assertNoError(error, 'getUserAccuracy');
  return data ?? [];
}

// ─── STADIUMS ─────────────────────────────────────────────────────────────────

/** Get all 16 stadiums. */
export async function getAllStadiums(): Promise<StadiumRow[]> {
  const supabase: AnyClient = await createClient();

  const { data, error } = await supabase
    .from('stadiums')
    .select('*')
    .order('country', { ascending: true });

  assertNoError(error, 'getAllStadiums');
  return (data ?? []) as StadiumRow[];
}

// ─── LEADERBOARD HISTORY ──────────────────────────────────────────────────────

/** Fetch daily rank history for a user (for trend charts). */
export async function getUserRankHistory(userId: number, days = 30) {
  const supabase: AnyClient = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from('leaderboard_snapshots')
    .select('snapshot_date, rank_position, total_points, accuracy_percent')
    .eq('user_id', userId)
    .gte('snapshot_date', since.toISOString())
    .order('snapshot_date', { ascending: true });

  assertNoError(error, 'getUserRankHistory');
  return (data ?? []) as {
    snapshot_date: string;
    rank_position: number;
    total_points: number | null;
    accuracy_percent: number | null;
  }[];
}
