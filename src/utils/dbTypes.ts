export type Users = {
  id: number;
  userId: string;
  username: string;
  roleId: number;
  serverId: number;
};

export type Events = {
  id: number;
  eventName: string;
  eventHost: string;
  gameName: string;
  description: string;
  dateTime: Date;
  isTeamEvent: boolean;
  maxNumTeams: number;
  maxNumTeamPlayers: number;
  timezone: string;
  maxNumPlayers: number;
  messageId: string;
  channelId: string;
  serverId: number;
};

export type Teams = {
  id: number;
  name: string;
  description: string;
  teamLeader: number;
  password: number;
  messageId: string;
  eventId: number;
};

export type BannedUsers = {
  id: number;
  serverId: number;
  isServerNoTeamEventBan: boolean;
  isServerTeamEventBan: boolean;
  userId: number;
};

export type AuditLog = {
  id: number;
  timestamp: Date;
  log: string;
  serverId: number;
  executorId: number;
};

export type BannedDiscordServers = {
  id: number;
  serverId: number;
  reason: string;
};

export type DiscordServers = {
  id: number;
  serverId: string;
  name: string;
};

export type SinglePlayers = {
  id: number;
  eventId: number;
  userId: number;
};

export type Roles = {
  id: number;
  name: string;
};

export type TeamPlayers = {
  id: number;
  teamId: number;
  userId: number;
};
