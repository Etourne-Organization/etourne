import { validateServerExists } from "src/interactionHandlers/validate";
import { supabase } from "supabaseDB/index";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import { getUserIdPKDB } from "./users";
import { logFormattedError } from "utils/logging/logError";
import { Teams } from "supabaseDB/types";

export const getNormalEventPlayerCountDB = async (eventId: number) => {
  const { data, error } = await supabase.from("SinglePlayers").select("id").eq("eventId", eventId);

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data.length;
};

export const getTeamEventPlayerCountDB = async (teamId: number) => {
  const { data, error } = await supabase.from("TeamPlayers").select("id").eq("teamId", teamId);

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data.length;
};

export const getTeamEventCountDB = async (eventId: number) => {
  const { data, error } = await supabase.from("Teams").select("id").eq("eventId", eventId);

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data.length;
};

export const getTeamDB = async (teamId: number) => {
  const { data, error } = await supabase.from("Teams").select().eq("id", teamId).single();

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data.id;
};

export const getPlayersDB = async (eventId: number) => {
  const { data, error } = await supabase
    .from("SinglePlayers")
    .select(`userId, Users (username)`)
    .eq("eventId", eventId);

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data as unknown as { userId: number; Users: { username: string } }[];
};

export const getTeamPlayersDB = async (teamId: number) => {
  const { data, error } = await supabase
    .from("TeamPlayers")
    .select(`userId, Users (username)`)
    .eq("teamId", teamId);

  if (error) {
    logFormattedError(error);
    return null;
  }

  return data as unknown as { userId: number; Users: { username: string } }[];
};

export const addTeamPlayerDB = async (teamId: number, userId: number) => {
  const { data, error } = await supabase.from("TeamPlayers").insert({
    teamId,
    userId,
  });

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const addPlayerDB = async (eventId: number, userId: number) => {
  const { data, error } = await supabase.from("SinglePlayers").insert({
    eventId,
    userId,
  });

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const removeTeamPlayerDB = async (
  guildId: string | null,
  userId: string,
  teamId: number,
  viaUserId: boolean = false,
) => {
  const { isValid, value } = await validateServerExists(guildId);
  if (!isValid) throw throwFormattedErrorLog("Guild does not exist!");

  const userIdPK = await getUserIdPKDB(userId, value, viaUserId);

  if (!userIdPK) throw throwFormattedErrorLog("User does not exist!");

  const { error } = await supabase
    .from("TeamPlayers")
    .delete()
    .eq("userId", userIdPK)
    .eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);
};

export const updateTeamDB = async (teamId: number, teamName: string, teamDescription: string) => {
  const { data, error } = await supabase
    .from("Teams")
    .update({
      name: teamName,
      description: teamDescription,
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};

export const createTeamDB = async (
  eventId: number,
  teamName: string,
  teamLeaderId: number,
  teamDescription: string,
) => {
  const { data, error } = await supabase
    .from("Teams")
    .insert({
      eventId,
      teamLeader: teamLeaderId,
      name: teamName,
      description: teamDescription,
    })
    .select()
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};

export const deleteTeamDB = async (teamId: number) => {
  const { error } = await supabase.from("Teams").delete().eq("id", teamId);

  if (error) throw throwFormattedErrorLog(error);
};

export const removePlayerDB = async (
  guildId: string | null,
  /** interaction.user.id or userIdPK */
  userId: string,
  eventId: number,
  /** whether userId is discord userId or database userId Primary Key */
  viaUserId: boolean = false,
) => {
  const { isValid, value } = await validateServerExists(guildId);
  if (!isValid) throw throwFormattedErrorLog("Guild does not exist!");

  const userIdPK = await getUserIdPKDB(userId, value, viaUserId);

  if (!userIdPK) throw throwFormattedErrorLog("User does not exist!");

  const { error } = await supabase
    .from("SinglePlayers")
    .delete()
    .eq("userId", userIdPK)
    .eq("eventId", eventId);

  if (error) throw throwFormattedErrorLog(error);
};

export const performTeamUpdateDB = async (id: number, newData: Partial<Teams>) => {
  const { data, error } = await supabase
    .from("Teams")
    .update(newData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};
