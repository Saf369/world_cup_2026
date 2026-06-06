export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      group_matches: {
        Row: {
          away_team_id: number
          created_at: string | null
          group_id: number
          home_team_id: number
          id: number
          match_number: number | null
          match_status: Database["public"]["Enums"]["match_status"] | null
          official_away_score: number | null
          official_home_score: number | null
          scheduled_date: string | null
          stadium_id: number | null
          updated_at: string | null
        }
        Insert: {
          away_team_id: number
          created_at?: string | null
          group_id: number
          home_team_id: number
          id?: number
          match_number?: number | null
          match_status?: Database["public"]["Enums"]["match_status"] | null
          official_away_score?: number | null
          official_home_score?: number | null
          scheduled_date?: string | null
          stadium_id?: number | null
          updated_at?: string | null
        }
        Update: {
          away_team_id?: number
          created_at?: string | null
          group_id?: number
          home_team_id?: number
          id?: number
          match_number?: number | null
          match_status?: Database["public"]["Enums"]["match_status"] | null
          official_away_score?: number | null
          official_home_score?: number | null
          scheduled_date?: string | null
          stadium_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_matches_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_matches_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadiums"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          group_letter: string
          id: number
        }
        Insert: {
          created_at?: string | null
          group_letter: string
          id?: number
        }
        Update: {
          created_at?: string | null
          group_letter?: string
          id?: number
        }
        Relationships: []
      }
      knockout_matches: {
        Row: {
          away_team_id: number | null
          created_at: string | null
          home_team_id: number | null
          id: number
          is_knockout: boolean | null
          knockout_round_id: number
          match_number: number | null
          match_status: Database["public"]["Enums"]["match_status"] | null
          official_away_score: number | null
          official_home_score: number | null
          official_winner_id: number | null
          scheduled_date: string | null
          stadium_id: number | null
          updated_at: string | null
        }
        Insert: {
          away_team_id?: number | null
          created_at?: string | null
          home_team_id?: number | null
          id?: number
          is_knockout?: boolean | null
          knockout_round_id: number
          match_number?: number | null
          match_status?: Database["public"]["Enums"]["match_status"] | null
          official_away_score?: number | null
          official_home_score?: number | null
          official_winner_id?: number | null
          scheduled_date?: string | null
          stadium_id?: number | null
          updated_at?: string | null
        }
        Update: {
          away_team_id?: number | null
          created_at?: string | null
          home_team_id?: number | null
          id?: number
          is_knockout?: boolean | null
          knockout_round_id?: number
          match_number?: number | null
          match_status?: Database["public"]["Enums"]["match_status"] | null
          official_away_score?: number | null
          official_home_score?: number | null
          official_winner_id?: number | null
          scheduled_date?: string | null
          stadium_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knockout_matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knockout_matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knockout_matches_knockout_round_id_fkey"
            columns: ["knockout_round_id"]
            isOneToOne: false
            referencedRelation: "knockout_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knockout_matches_official_winner_id_fkey"
            columns: ["official_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knockout_matches_stadium_id_fkey"
            columns: ["stadium_id"]
            isOneToOne: false
            referencedRelation: "stadiums"
            referencedColumns: ["id"]
          },
        ]
      }
      knockout_rounds: {
        Row: {
          created_at: string | null
          id: number
          match_count: number | null
          round_name: Database["public"]["Enums"]["knockout_round_name"]
          round_number: number
          scheduled_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          match_count?: number | null
          round_name: Database["public"]["Enums"]["knockout_round_name"]
          round_number: number
          scheduled_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          match_count?: number | null
          round_name?: Database["public"]["Enums"]["knockout_round_name"]
          round_number?: number
          scheduled_start?: string | null
        }
        Relationships: []
      }
      leaderboard_snapshots: {
        Row: {
          accuracy_percent: number | null
          created_at: string | null
          id: number
          rank_position: number
          snapshot_date: string
          total_points: number | null
          user_id: number
        }
        Insert: {
          accuracy_percent?: number | null
          created_at?: string | null
          id?: number
          rank_position: number
          snapshot_date: string
          total_points?: number | null
          user_id: number
        }
        Update: {
          accuracy_percent?: number | null
          created_at?: string | null
          id?: number
          rank_position?: number
          snapshot_date?: string
          total_points?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_snapshots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_accuracy: {
        Row: {
          created_at: string | null
          id: number
          is_correct: boolean | null
          match_id: number | null
          match_type: string | null
          official_result: string | null
          points_earned: number | null
          prediction_type: Database["public"]["Enums"]["prediction_type"]
          user_id: number
          user_prediction: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          match_id?: number | null
          match_type?: string | null
          official_result?: string | null
          points_earned?: number | null
          prediction_type: Database["public"]["Enums"]["prediction_type"]
          user_id: number
          user_prediction?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          match_id?: number | null
          match_type?: string | null
          official_result?: string | null
          points_earned?: number | null
          prediction_type?: Database["public"]["Enums"]["prediction_type"]
          user_id?: number
          user_prediction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prediction_accuracy_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity: string | null
          token: string
          user_agent: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          token: string
          user_agent?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity?: string | null
          token?: string
          user_agent?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stadiums: {
        Row: {
          capacity: number | null
          city: string
          country: string
          created_at: string | null
          id: number
          latitude: number | null
          longitude: number | null
          name: string
          timezone: string | null
        }
        Insert: {
          capacity?: number | null
          city: string
          country: string
          created_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name: string
          timezone?: string | null
        }
        Update: {
          capacity?: number | null
          city?: string
          country?: string
          created_at?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          name?: string
          timezone?: string | null
        }
        Relationships: []
      }
      teams: {
        Row: {
          abbreviation: string
          confederation: Database["public"]["Enums"]["confederation"] | null
          created_at: string | null
          fifa_rank: number | null
          flag_emoji: string | null
          group_id: string | null
          id: number
          name: string
          seed_position: string | null
        }
        Insert: {
          abbreviation: string
          confederation?: Database["public"]["Enums"]["confederation"] | null
          created_at?: string | null
          fifa_rank?: number | null
          flag_emoji?: string | null
          group_id?: string | null
          id?: number
          name: string
          seed_position?: string | null
        }
        Update: {
          abbreviation?: string
          confederation?: Database["public"]["Enums"]["confederation"] | null
          created_at?: string | null
          fifa_rank?: number | null
          flag_emoji?: string | null
          group_id?: string | null
          id?: number
          name?: string
          seed_position?: string | null
        }
        Relationships: []
      }
      user_group_predictions: {
        Row: {
          confidence_level:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at: string | null
          group_match_id: number
          id: number
          predicted_away_score: number | null
          predicted_home_score: number | null
          predicted_winner: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          group_match_id: number
          id?: number
          predicted_away_score?: number | null
          predicted_home_score?: number | null
          predicted_winner?: number | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          group_match_id?: number
          id?: number
          predicted_away_score?: number | null
          predicted_home_score?: number | null
          predicted_winner?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_group_predictions_group_match_id_fkey"
            columns: ["group_match_id"]
            isOneToOne: false
            referencedRelation: "group_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_predictions_predicted_winner_fkey"
            columns: ["predicted_winner"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_knockout_predictions: {
        Row: {
          confidence_level:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at: string | null
          id: number
          knockout_match_id: number
          predicted_score_a: number | null
          predicted_score_h: number | null
          predicted_winner_id: number
          top_scorer: string | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          id?: number
          knockout_match_id: number
          predicted_score_a?: number | null
          predicted_score_h?: number | null
          predicted_winner_id: number
          top_scorer?: string | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          confidence_level?:
            | Database["public"]["Enums"]["confidence_level"]
            | null
          created_at?: string | null
          id?: number
          knockout_match_id?: number
          predicted_score_a?: number | null
          predicted_score_h?: number | null
          predicted_winner_id?: number
          top_scorer?: string | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_knockout_predictions_knockout_match_id_fkey"
            columns: ["knockout_match_id"]
            isOneToOne: false
            referencedRelation: "knockout_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_knockout_predictions_predicted_winner_id_fkey"
            columns: ["predicted_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_knockout_predictions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_standings: {
        Row: {
          accuracy_percent: number | null
          correct_predictions: number | null
          group_points: number | null
          id: number
          knockout_points: number | null
          rank_position: number | null
          total_points: number | null
          total_predictions: number | null
          updated_at: string | null
          user_id: number
        }
        Insert: {
          accuracy_percent?: number | null
          correct_predictions?: number | null
          group_points?: number | null
          id?: number
          knockout_points?: number | null
          rank_position?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id: number
        }
        Update: {
          accuracy_percent?: number | null
          correct_predictions?: number | null
          group_points?: number | null
          id?: number
          knockout_points?: number | null
          rank_position?: number | null
          total_points?: number | null
          total_predictions?: number | null
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_standings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: number
          is_active: boolean | null
          last_login: string | null
          password_hash: string
          preferred_team: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: number
          is_active?: boolean | null
          last_login?: string | null
          password_hash: string
          preferred_team?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: number
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string
          preferred_team?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      confederation: "UEFA" | "CONMEBOL" | "CAF" | "AFC" | "CONCACAF" | "OFC"
      confidence_level: "LOW" | "MEDIUM" | "HIGH"
      knockout_round_name: "R32" | "R16" | "QF" | "SF" | "FINAL"
      match_status: "not_started" | "in_progress" | "completed"
      prediction_type: "GROUP" | "KNOCKOUT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      confederation: ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"],
      confidence_level: ["LOW", "MEDIUM", "HIGH"],
      knockout_round_name: ["R32", "R16", "QF", "SF", "FINAL"],
      match_status: ["not_started", "in_progress", "completed"],
      prediction_type: ["GROUP", "KNOCKOUT"],
    },
  },
} as const
