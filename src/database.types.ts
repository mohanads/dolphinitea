export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amp_configuration: {
        Row: {
          bot_password: string | null
          bot_username: string | null
          controller_url: string | null
          created_at: string
          id: number
        }
        Insert: {
          bot_password?: string | null
          bot_username?: string | null
          controller_url?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          bot_password?: string | null
          bot_username?: string | null
          controller_url?: string | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "amp_configuration_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      configuration: {
        Row: {
          created_at: string
          guild_id: number
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          guild_id: number
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          guild_id?: number
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      feature_flag_configuration: {
        Row: {
          create_vc: boolean
          created_at: string
          giveaway: boolean
          id: number
          in_voice_count: boolean
          member_count: boolean
          navigate: boolean
          purge: boolean
          register_poe2: boolean
          reload: boolean
          reputation_tracking: boolean
          starboard: boolean
          status: boolean
          temp_message: boolean
          text_xp: boolean
          voice_xp: boolean
        }
        Insert: {
          create_vc?: boolean
          created_at?: string
          giveaway?: boolean
          id?: number
          in_voice_count?: boolean
          member_count?: boolean
          navigate?: boolean
          purge?: boolean
          register_poe2?: boolean
          reload?: boolean
          reputation_tracking?: boolean
          starboard?: boolean
          status?: boolean
          temp_message?: boolean
          text_xp?: boolean
          voice_xp?: boolean
        }
        Update: {
          create_vc?: boolean
          created_at?: string
          giveaway?: boolean
          id?: number
          in_voice_count?: boolean
          member_count?: boolean
          navigate?: boolean
          purge?: boolean
          register_poe2?: boolean
          reload?: boolean
          reputation_tracking?: boolean
          starboard?: boolean
          status?: boolean
          temp_message?: boolean
          text_xp?: boolean
          voice_xp?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "feature_flag_configuration_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      group_events: {
        Row: {
          author_auth_id: string
          author_avatar_url: string | null
          author_username: string
          created_at: string
          description: string
          end_time: string
          guild_id: string
          id: number
          start_time: string
          tags: string
          title: string
        }
        Insert: {
          author_auth_id: string
          author_avatar_url?: string | null
          author_username: string
          created_at?: string
          description: string
          end_time: string
          guild_id: string
          id?: number
          start_time: string
          tags: string
          title: string
        }
        Update: {
          author_auth_id?: string
          author_avatar_url?: string | null
          author_username?: string
          created_at?: string
          description?: string
          end_time?: string
          guild_id?: string
          id?: number
          start_time?: string
          tags?: string
          title?: string
        }
        Relationships: []
      }
      group_participants: {
        Row: {
          auth_id: string
          avatar_url: string | null
          created_at: string
          discord_id: string
          group_event_id: number
          guild_id: string
          id: number
          username: string
        }
        Insert: {
          auth_id: string
          avatar_url?: string | null
          created_at?: string
          discord_id: string
          group_event_id: number
          guild_id: string
          id?: number
          username: string
        }
        Update: {
          auth_id?: string
          avatar_url?: string | null
          created_at?: string
          discord_id?: string
          group_event_id?: number
          guild_id?: string
          id?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_participants_group_event_id_fkey"
            columns: ["group_event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          community_rep: number
          created_at: string
          discord_id: number
          guild_id: number
          id: number
          staff_rep: number
          text_xp: number
          updated_at: string
          voice_xp: number
        }
        Insert: {
          community_rep?: number
          created_at?: string
          discord_id: number
          guild_id: number
          id?: number
          staff_rep?: number
          text_xp?: number
          updated_at: string
          voice_xp?: number
        }
        Update: {
          community_rep?: number
          created_at?: string
          discord_id?: number
          guild_id?: number
          id?: number
          staff_rep?: number
          text_xp?: number
          updated_at?: string
          voice_xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_discord_id_fkey"
            columns: ["discord_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["discord_id"]
          },
        ]
      }
      leave_feedback: {
        Row: {
          comments: string
          created_at: string
          discord_id: number
          guild_id: number
          id: number
        }
        Insert: {
          comments: string
          created_at?: string
          discord_id: number
          guild_id: number
          id?: number
        }
        Update: {
          comments?: string
          created_at?: string
          discord_id?: number
          guild_id?: number
          id?: number
        }
        Relationships: []
      }
      member_activity_configuration: {
        Row: {
          create_vc_channel_name: string
          created_at: string
          id: number
          in_voice_channel_name: string
          member_count_channel_name: string
          updated_at: string
        }
        Insert: {
          create_vc_channel_name?: string
          created_at?: string
          id?: number
          in_voice_channel_name?: string
          member_count_channel_name?: string
          updated_at?: string
        }
        Update: {
          create_vc_channel_name?: string
          created_at?: string
          id?: number
          in_voice_channel_name?: string
          member_count_channel_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_activity_configuration_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      navigation: {
        Row: {
          created_at: string
          group: string
          guild_id: number
          id: number
          location_url: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          group: string
          guild_id: number
          id?: number
          location_url: string
          title: string
          updated_at: string
        }
        Update: {
          created_at?: string
          group?: string
          guild_id?: number
          id?: number
          location_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      poe2_registration_configuration: {
        Row: {
          allowed_maximum_reports: number
          approved_dm_message: string
          approved_dm_title: string
          channel_embed_footer: string
          channel_embed_message: string
          channel_embed_title: string
          channel_url: string | null
          created_at: string
          delayed_dm_message: string
          delayed_dm_title: string
          guild_id: number
          id: number
          notification_channel_url: string | null
          utility_role_id: string | null
        }
        Insert: {
          allowed_maximum_reports?: number
          approved_dm_message?: string
          approved_dm_title?: string
          channel_embed_footer?: string
          channel_embed_message?: string
          channel_embed_title?: string
          channel_url?: string | null
          created_at?: string
          delayed_dm_message?: string
          delayed_dm_title?: string
          guild_id: number
          id?: number
          notification_channel_url?: string | null
          utility_role_id?: string | null
        }
        Update: {
          allowed_maximum_reports?: number
          approved_dm_message?: string
          approved_dm_title?: string
          channel_embed_footer?: string
          channel_embed_message?: string
          channel_embed_title?: string
          channel_url?: string | null
          created_at?: string
          delayed_dm_message?: string
          delayed_dm_title?: string
          guild_id?: number
          id?: number
          notification_channel_url?: string | null
          utility_role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poe2_registration_configuration_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      poe2_registrations: {
        Row: {
          created_at: string
          discord_id: number
          game_account_name: string
          guild_id: number
          id: number
          registration_character_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discord_id: number
          game_account_name: string
          guild_id: number
          id?: number
          registration_character_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discord_id?: number
          game_account_name?: string
          guild_id?: number
          id?: number
          registration_character_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      poe2_reports: {
        Row: {
          created_at: string
          discord_id: number
          guild_id: number
          id: number
          registration_account_name: string
          registration_character_name: string
          report_reason: string
        }
        Insert: {
          created_at?: string
          discord_id: number
          guild_id: number
          id?: number
          registration_account_name: string
          registration_character_name: string
          report_reason: string
        }
        Update: {
          created_at?: string
          discord_id?: number
          guild_id?: number
          id?: number
          registration_account_name?: string
          registration_character_name?: string
          report_reason?: string
        }
        Relationships: []
      }
      registration_config: {
        Row: {
          dm_approval_body: string
          dm_approval_footer: string | null
          dm_approval_title: string
          dm_delay_body: string
          dm_delay_footer: string | null
          dm_delay_title: string
          dm_registered_body: string
          dm_registered_footer: string | null
          dm_registered_title: string
          game_name: string
          guild_id: number
          log_channel_url: string | null
          registration_channel_url: string | null
          registration_embed_body: string
          registration_embed_footer: string
          registration_embed_title: string
          utility_role_id: number | null
        }
        Insert: {
          dm_approval_body?: string
          dm_approval_footer?: string | null
          dm_approval_title?: string
          dm_delay_body?: string
          dm_delay_footer?: string | null
          dm_delay_title?: string
          dm_registered_body?: string
          dm_registered_footer?: string | null
          dm_registered_title?: string
          game_name: string
          guild_id: number
          log_channel_url?: string | null
          registration_channel_url?: string | null
          registration_embed_body?: string
          registration_embed_footer?: string
          registration_embed_title?: string
          utility_role_id?: number | null
        }
        Update: {
          dm_approval_body?: string
          dm_approval_footer?: string | null
          dm_approval_title?: string
          dm_delay_body?: string
          dm_delay_footer?: string | null
          dm_delay_title?: string
          dm_registered_body?: string
          dm_registered_footer?: string | null
          dm_registered_title?: string
          game_name?: string
          guild_id?: number
          log_channel_url?: string | null
          registration_channel_url?: string | null
          registration_embed_body?: string
          registration_embed_footer?: string
          registration_embed_title?: string
          utility_role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_config_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "configuration"
            referencedColumns: ["guild_id"]
          },
        ]
      }
      registration_field: {
        Row: {
          field_title: string
          game_name: string
          guild_id: number
        }
        Insert: {
          field_title: string
          game_name: string
          guild_id: number
        }
        Update: {
          field_title?: string
          game_name?: string
          guild_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "registration_field_guild_id_game_name_fkey"
            columns: ["guild_id", "game_name"]
            isOneToOne: false
            referencedRelation: "registration_config"
            referencedColumns: ["guild_id", "game_name"]
          },
        ]
      }
      registration_record: {
        Row: {
          created_at: string
          discord_id: string
          game_name: string
          guild_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          discord_id: string
          game_name: string
          guild_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          game_name?: string
          guild_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_record_guild_id_game_name_fkey"
            columns: ["guild_id", "game_name"]
            isOneToOne: false
            referencedRelation: "registration_config"
            referencedColumns: ["guild_id", "game_name"]
          },
        ]
      }
      registration_record_entries: {
        Row: {
          discord_id: string
          field_title: string
          field_value: string
          game_name: string
          guild_id: number
        }
        Insert: {
          discord_id: string
          field_title: string
          field_value: string
          game_name: string
          guild_id?: number
        }
        Update: {
          discord_id?: string
          field_title?: string
          field_value?: string
          game_name?: string
          guild_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "registration_record_entries_guild_id_game_name_discord_id_fkey"
            columns: ["guild_id", "game_name", "discord_id"]
            isOneToOne: false
            referencedRelation: "registration_record"
            referencedColumns: ["guild_id", "game_name", "discord_id"]
          },
        ]
      }
      report_config: {
        Row: {
          guild_id: number
          log_channel_url: string | null
          max_allowed_reports: number
        }
        Insert: {
          guild_id?: number
          log_channel_url?: string | null
          max_allowed_reports?: number
        }
        Update: {
          guild_id?: number
          log_channel_url?: string | null
          max_allowed_reports?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_config_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["guild_id"]
          },
        ]
      }
      report_record: {
        Row: {
          created_at: string
          discord_id: string
          game_name: string | null
          guild_id: string
          report_reason: string
        }
        Insert: {
          created_at?: string
          discord_id: string
          game_name?: string | null
          guild_id: string
          report_reason: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          game_name?: string | null
          guild_id?: string
          report_reason?: string
        }
        Relationships: []
      }
      starboard: {
        Row: {
          author_id: number
          channel_id: number
          created_at: string
          id: number
          message_id: number
          reaction_count: number
          starboard_message_id: number
          updated_at: string
        }
        Insert: {
          author_id: number
          channel_id: number
          created_at?: string
          id?: number
          message_id: number
          reaction_count: number
          starboard_message_id: number
          updated_at?: string
        }
        Update: {
          author_id?: number
          channel_id?: number
          created_at?: string
          id?: number
          message_id?: number
          reaction_count?: number
          starboard_message_id?: number
          updated_at?: string
        }
        Relationships: []
      }
      starboard_configuration: {
        Row: {
          channel_url: string | null
          created_at: string
          id: number
          reaction: string
          required_reactions: number
          updated_at: string
        }
        Insert: {
          channel_url?: string | null
          created_at?: string
          id?: number
          reaction?: string
          required_reactions: number
          updated_at?: string
        }
        Update: {
          channel_url?: string | null
          created_at?: string
          id?: number
          reaction?: string
          required_reactions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "starboard_configuration_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "configuration"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          created_at: string
          discord_id: number
          guild_ids: Json
          id: number
        }
        Insert: {
          created_at?: string
          discord_id: number
          guild_ids: Json
          id?: number
        }
        Update: {
          created_at?: string
          discord_id?: number
          guild_ids?: Json
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      put_registration_config: {
        Args: {
          guild_id: number
          game_name: string
          registration_embed_title: string
          registration_embed_footer: string
          dm_approval_title: string
          dm_approval_body: string
          dm_delay_title: string
          dm_delay_body: string
          dm_registered_title: string
          dm_registered_body: string
          registration_embed_body: string
          fields?: Json
          log_channel_url?: string
          registration_channel_url?: string
          dm_approval_footer?: string
          dm_delay_footer?: string
          dm_registered_footer?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
