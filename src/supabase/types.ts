import { Database } from "supabaseDB/database.type";

export type Users = Database["public"]["Tables"]["Users"]["Row"];

export type Events = Database["public"]["Tables"]["Events"]["Row"];

export type Teams = Database["public"]["Tables"]["Teams"]["Row"];

export type BannedUsers = Database["public"]["Tables"]["BannedUsers"]["Row"];

export type AuditLog = Database["public"]["Tables"]["AuditLog"]["Row"];

export type BannedDiscordServers = Database["public"]["Tables"]["BannedDiscordServers"]["Row"];

export type DiscordServers = Database["public"]["Tables"]["DiscordServers"]["Row"];

export type SinglePlayers = Database["public"]["Tables"]["SinglePlayers"]["Row"];

export type Roles = Database["public"]["Tables"]["Roles"]["Row"];

export type TeamPlayers = Database["public"]["Tables"]["TeamPlayers"]["Row"];
