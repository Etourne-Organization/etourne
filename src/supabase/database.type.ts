export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      AuditLog: {
        Row: {
          executorId: number | null;
          id: number;
          log: string | null;
          serverId: number | null;
          timestamp: string;
        };
        Insert: {
          executorId?: number | null;
          id?: number;
          log?: string | null;
          serverId?: number | null;
          timestamp: string;
        };
        Update: {
          executorId?: number | null;
          id?: number;
          log?: string | null;
          serverId?: number | null;
          timestamp?: string;
        };
        Relationships: [];
      };
      BannedDiscordServers: {
        Row: {
          id: number;
          reason: string | null;
          serverId: number;
        };
        Insert: {
          id?: number;
          reason?: string | null;
          serverId: number;
        };
        Update: {
          id?: number;
          reason?: string | null;
          serverId?: number;
        };
        Relationships: [];
      };
      BannedUsers: {
        Row: {
          id: number;
          isSearchTeamEventBan: boolean | null;
          isServerNoTeamEventBan: boolean | null;
          serverId: number;
          userId: number | null;
        };
        Insert: {
          id?: number;
          isSearchTeamEventBan?: boolean | null;
          isServerNoTeamEventBan?: boolean | null;
          serverId: number;
          userId?: number | null;
        };
        Update: {
          id?: number;
          isSearchTeamEventBan?: boolean | null;
          isServerNoTeamEventBan?: boolean | null;
          serverId?: number;
          userId?: number | null;
        };
        Relationships: [];
      };
      DiscordServers: {
        Row: {
          id: number;
          name: string | null;
          serverId: string;
        };
        Insert: {
          id?: number;
          name?: string | null;
          serverId: string;
        };
        Update: {
          id?: number;
          name?: string | null;
          serverId?: string;
        };
        Relationships: [];
      };
      Events: {
        Row: {
          channelId: string | null;
          dateTime: string | null;
          description: string | null;
          eventHost: string | null;
          eventName: string;
          gameName: string | null;
          id: number;
          isTeamEvent: boolean | null;
          maxNumPlayers: number | null;
          maxNumTeamPlayers: number | null;
          maxNumTeams: number | null;
          messageId: string | null;
          serverId: number | null;
          timezone: string | null;
        };
        Insert: {
          channelId?: string | null;
          dateTime?: string | null;
          description?: string | null;
          eventHost?: string | null;
          eventName: string;
          gameName?: string | null;
          id?: number;
          isTeamEvent?: boolean | null;
          maxNumPlayers?: number | null;
          maxNumTeamPlayers?: number | null;
          maxNumTeams?: number | null;
          messageId?: string | null;
          serverId?: number | null;
          timezone?: string | null;
        };
        Update: {
          channelId?: string | null;
          dateTime?: string | null;
          description?: string | null;
          eventHost?: string | null;
          eventName?: string;
          gameName?: string | null;
          id?: number;
          isTeamEvent?: boolean | null;
          maxNumPlayers?: number | null;
          maxNumTeamPlayers?: number | null;
          maxNumTeams?: number | null;
          messageId?: string | null;
          serverId?: number | null;
          timezone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Events_serverId_fkey";
            columns: ["serverId"];
            isOneToOne: false;
            referencedRelation: "DiscordServers";
            referencedColumns: ["id"];
          },
        ];
      };
      Roles: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      SinglePlayers: {
        Row: {
          eventId: number | null;
          id: number;
          userId: number | null;
        };
        Insert: {
          eventId?: number | null;
          id?: number;
          userId?: number | null;
        };
        Update: {
          eventId?: number | null;
          id?: number;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "SinglePlayers_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "SinglePlayers_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
        ];
      };
      SuperAdminUsers: {
        Row: {
          id: number;
        };
        Insert: {
          id?: number;
        };
        Update: {
          id?: number;
        };
        Relationships: [];
      };
      TeamPlayers: {
        Row: {
          id: number;
          teamId: number;
          userId: number | null;
        };
        Insert: {
          id?: number;
          teamId: number;
          userId?: number | null;
        };
        Update: {
          id?: number;
          teamId?: number;
          userId?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "TeamPlayers_teamId_fkey";
            columns: ["teamId"];
            isOneToOne: false;
            referencedRelation: "Teams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "TeamPlayers_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
        ];
      };
      Teams: {
        Row: {
          description: string | null;
          eventId: number | null;
          id: number;
          messageId: string | null;
          name: string | null;
          password: number | null;
          teamLeader: number | null;
        };
        Insert: {
          description?: string | null;
          eventId?: number | null;
          id?: number;
          messageId?: string | null;
          name?: string | null;
          password?: number | null;
          teamLeader?: number | null;
        };
        Update: {
          description?: string | null;
          eventId?: number | null;
          id?: number;
          messageId?: string | null;
          name?: string | null;
          password?: number | null;
          teamLeader?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Teams_eventId_fkey";
            columns: ["eventId"];
            isOneToOne: false;
            referencedRelation: "Events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Teams_teamLeader_fkey";
            columns: ["teamLeader"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
        ];
      };
      Users: {
        Row: {
          id: number;
          roleId: number | null;
          serverId: number | null;
          userId: string;
          username: string | null;
        };
        Insert: {
          id?: number;
          roleId?: number | null;
          serverId?: number | null;
          userId: string;
          username?: string | null;
        };
        Update: {
          id?: number;
          roleId?: number | null;
          serverId?: number | null;
          userId?: string;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Users_serverId_fkey";
            columns: ["serverId"];
            isOneToOne: false;
            referencedRelation: "DiscordServers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
