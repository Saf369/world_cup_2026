/**
 * XI — Database Type Definitions
 * Auto-generated TypeScript types for all 13 tables in the World Cup 2026 schema.
 * Follows Supabase naming conventions: Database['public']['Tables'][TableName]['Row']
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type MatchStatus = 'not_started' | 'in_progress' | 'completed';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type PredictionType = 'GROUP' | 'KNOCKOUT';
export type KnockoutRoundName = 'R32' | 'R16' | 'QF' | 'SF' | 'FINAL';
export type Confederation = 'UEFA' | 'CONMEBOL' | 'CAF' | 'AFC' | 'CONCACAF' | 'OFC';

// ─── Row Types (read from DB) ─────────────────────────────────────────────────

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
  preferred_team: string | null;
}

export interface TeamRow {
  id: number;
  name: string;
  flag_emoji: string | null;
  abbreviation: string;
  confederation: Confederation | null;
  fifa_rank: number | null;
  group_id: string | null;
  seed_position: string | null;
  created_at: string;
}

export interface GroupRow {
  id: number;
  group_letter: string;
  created_at: string;
}

export interface StadiumRow {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: number | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  created_at: string;
}

export interface GroupMatchRow {
  id: number;
  group_id: number;
  match_number: number | null;
  home_team_id: number;
  away_team_id: number;
  scheduled_date: string | null;
  stadium_id: number | null;
  match_status: MatchStatus;
  official_home_score: number | null;
  official_away_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserGroupPredictionRow {
  id: number;
  user_id: number;
  group_match_id: number;
  predicted_home_score: number | null;
  predicted_away_score: number | null;
  predicted_winner: number | null;
  confidence_level: ConfidenceLevel | null;
  created_at: string;
  updated_at: string;
}

export interface KnockoutRoundRow {
  id: number;
  round_name: KnockoutRoundName;
  round_number: number;
  match_count: number | null;
  scheduled_start: string | null;
  created_at: string;
}

export interface KnockoutMatchRow {
  id: number;
  knockout_round_id: number;
  match_number: number | null;
  home_team_id: number | null;
  away_team_id: number | null;
  scheduled_date: string | null;
  stadium_id: number | null;
  match_status: MatchStatus | null;
  official_home_score: number | null;
  official_away_score: number | null;
  official_winner_id: number | null;
  is_knockout: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserKnockoutPredictionRow {
  id: number;
  user_id: number;
  knockout_match_id: number;
  predicted_winner_id: number;
  predicted_score_h: number | null;
  predicted_score_a: number | null;
  confidence_level: ConfidenceLevel | null;
  top_scorer: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStandingRow {
  id: number;
  user_id: number;
  total_points: number;
  group_points: number;
  knockout_points: number;
  accuracy_percent: number;
  correct_predictions: number;
  total_predictions: number;
  rank_position: number | null;
  updated_at: string;
}

export interface PredictionAccuracyRow {
  id: number;
  user_id: number;
  prediction_type: PredictionType;
  match_id: number | null;
  match_type: string | null;
  is_correct: boolean | null;
  points_earned: number;
  official_result: string | null;
  user_prediction: string | null;
  created_at: string;
}

export interface SessionRow {
  id: string;
  user_id: number;
  token: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  expires_at: string | null;
  last_activity: string;
  is_active: boolean;
}

export interface LeaderboardSnapshotRow {
  id: number;
  snapshot_date: string;
  user_id: number;
  rank_position: number;
  total_points: number | null;
  accuracy_percent: number | null;
  created_at: string;
}

// ─── Insert Types (create new records) ───────────────────────────────────────

export type InsertUser = Omit<UserRow, 'id' | 'created_at' | 'updated_at'>;
export type InsertTeam = Omit<TeamRow, 'id' | 'created_at'>;
export type InsertGroup = Omit<GroupRow, 'id' | 'created_at'>;
export type InsertStadium = Omit<StadiumRow, 'id' | 'created_at'>;
export type InsertGroupMatch = Omit<GroupMatchRow, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserGroupPrediction = Omit<UserGroupPredictionRow, 'id' | 'created_at' | 'updated_at'>;
export type InsertKnockoutRound = Omit<KnockoutRoundRow, 'id' | 'created_at'>;
export type InsertKnockoutMatch = Omit<KnockoutMatchRow, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserKnockoutPrediction = Omit<UserKnockoutPredictionRow, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserStanding = Omit<UserStandingRow, 'id' | 'updated_at'>;
export type InsertPredictionAccuracy = Omit<PredictionAccuracyRow, 'id' | 'created_at'>;
export type InsertSession = Omit<SessionRow, 'created_at' | 'last_activity'>;
export type InsertLeaderboardSnapshot = Omit<LeaderboardSnapshotRow, 'id' | 'created_at'>;

// ─── Update Types (partial updates) ──────────────────────────────────────────

export type UpdateUser = Partial<Omit<UserRow, 'id' | 'created_at'>>;
export type UpdateGroupPrediction = Partial<Pick<
  UserGroupPredictionRow,
  'predicted_home_score' | 'predicted_away_score' | 'predicted_winner' | 'confidence_level'
>>;
export type UpdateKnockoutPrediction = Partial<Pick<
  UserKnockoutPredictionRow,
  'predicted_winner_id' | 'predicted_score_h' | 'predicted_score_a' | 'confidence_level' | 'top_scorer'
>>;
export type UpdateGroupMatch = Partial<Pick<
  GroupMatchRow,
  'official_home_score' | 'official_away_score' | 'match_status'
>>;
export type UpdateKnockoutMatch = Partial<Pick<
  KnockoutMatchRow,
  'home_team_id' | 'away_team_id' | 'official_home_score' | 'official_away_score' | 'official_winner_id' | 'match_status'
>>;

// ─── Supabase Database Schema Type ────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: InsertUser;
        Update: UpdateUser;
      };
      teams: {
        Row: TeamRow;
        Insert: InsertTeam;
        Update: Partial<InsertTeam>;
      };
      groups: {
        Row: GroupRow;
        Insert: InsertGroup;
        Update: Partial<InsertGroup>;
      };
      stadiums: {
        Row: StadiumRow;
        Insert: InsertStadium;
        Update: Partial<InsertStadium>;
      };
      group_matches: {
        Row: GroupMatchRow;
        Insert: InsertGroupMatch;
        Update: UpdateGroupMatch;
      };
      user_group_predictions: {
        Row: UserGroupPredictionRow;
        Insert: InsertUserGroupPrediction;
        Update: UpdateGroupPrediction;
      };
      knockout_rounds: {
        Row: KnockoutRoundRow;
        Insert: InsertKnockoutRound;
        Update: Partial<InsertKnockoutRound>;
      };
      knockout_matches: {
        Row: KnockoutMatchRow;
        Insert: InsertKnockoutMatch;
        Update: UpdateKnockoutMatch;
      };
      user_knockout_predictions: {
        Row: UserKnockoutPredictionRow;
        Insert: InsertUserKnockoutPrediction;
        Update: UpdateKnockoutPrediction;
      };
      user_standings: {
        Row: UserStandingRow;
        Insert: InsertUserStanding;
        Update: Partial<InsertUserStanding>;
      };
      prediction_accuracy: {
        Row: PredictionAccuracyRow;
        Insert: InsertPredictionAccuracy;
        Update: Partial<InsertPredictionAccuracy>;
      };
      sessions: {
        Row: SessionRow;
        Insert: InsertSession;
        Update: Partial<InsertSession>;
      };
      leaderboard_snapshots: {
        Row: LeaderboardSnapshotRow;
        Insert: InsertLeaderboardSnapshot;
        Update: Partial<InsertLeaderboardSnapshot>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      match_status: MatchStatus;
      confidence_level: ConfidenceLevel;
      prediction_type: PredictionType;
      knockout_round_name: KnockoutRoundName;
      confederation: Confederation;
    };
  };
}

// ─── Joined / Rich Types (for API responses) ─────────────────────────────────

export interface GroupMatchWithTeams extends GroupMatchRow {
  home_team: TeamRow;
  away_team: TeamRow;
  stadium?: StadiumRow;
}

export interface GroupMatchWithPrediction extends GroupMatchWithTeams {
  prediction?: UserGroupPredictionRow;
}

export interface KnockoutMatchWithTeams extends KnockoutMatchRow {
  home_team?: TeamRow;
  away_team?: TeamRow;
  official_winner?: TeamRow;
  knockout_round: KnockoutRoundRow;
}

export interface KnockoutMatchWithPrediction extends KnockoutMatchWithTeams {
  prediction?: UserKnockoutPredictionRow & { predicted_team: TeamRow };
}

export interface LeaderboardEntry {
  rank_position: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_points: number;
  accuracy_percent: number;
  correct_predictions: number;
  total_predictions: number;
}

export interface GroupStanding {
  team: TeamRow;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}
