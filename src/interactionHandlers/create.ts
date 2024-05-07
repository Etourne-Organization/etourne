import { addPlayerDB, addTeamPlayerDB, createTeamDB } from "supabaseDB/methods/players";
import { checkOrCreateUserDB } from "supabaseDB/methods/users";
import { validateServerExists } from "./validate";

export async function createTeam({
  eventId,
  serverId,
  teamName,
  teamDescription,
  teamLeaderUserId,
  teamLeaderUsername,
}: {
  eventId: number;
  serverId: number;
  teamName: string;
  teamDescription: string;
  teamLeaderUserId: string;
  teamLeaderUsername: string;
}): Promise<number> {
  const teamLeaderId = await checkOrCreateUserDB({
    userId: teamLeaderUserId,
    serverId,
    username: teamLeaderUsername,
  });

  return await createTeamDB(eventId, teamName, teamLeaderId!, teamDescription);
}

export async function addTeamPlayer({
  guildId,
  teamId,
  userId,
  username,
}: {
  teamId: number;
  guildId: string | null;
  userId: string;
  username: string;
}) {
  const { value: serverId } = await validateServerExists(guildId);

  const userIdPK = await checkOrCreateUserDB({ serverId: serverId!, userId, username });

  return await addTeamPlayerDB(teamId, userIdPK!);
}

export async function addPlayer({
  guildId,
  eventId,
  userId,
  username,
}: {
  eventId: number;
  guildId: string | null;
  userId: string;
  username: string;
}) {
  const { value: serverId } = await validateServerExists(guildId);

  const userIdPK = await checkOrCreateUserDB({ serverId: serverId!, userId, username });

  return await addPlayerDB(eventId, userIdPK!);
}
