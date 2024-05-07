/* 

* This file contains all the 'team players' table related functions
*
*

*/

import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import { supabase } from "supabaseDB/index";
import { addUser, getUserId, getUsernameAndDiscordId } from "./users";

interface addPlayer {
  discordUserId: string;
  teamId: number;
  discordServerId: string;
  username: string;
}

interface removePlayer {
  discordUserId: string;
  teamId: number;
}

interface getAllTeamPlayers {
  teamId: number;
}

interface getNumOfTeamPlayers {
  teamId: number;
}

export const addPlayer = async (props: addPlayer) => {
  const { discordUserId, teamId, discordServerId, username } = props;

  let dbUserId: number;

  // get user ID from DB
  const { data: getUserIdData, error: getUserIdError } = await getUserId({
    discordUserId: discordUserId,
  });

  if (getUserIdError) throw throwFormattedErrorLog(getUserIdError);

  // add user to the Supabase DB if the user does not exist
  if (getUserIdData!.length < 1) {
    const { data: addUserData, error: addUserError } = await addUser({
      username: username,
      discordUserId: discordUserId,
      discordServerId: discordServerId!,
    });

    if (addUserError) throw throwFormattedErrorLog(addUserError);

    dbUserId = addUserData![0]["id"];
  } else {
    dbUserId = getUserIdData![0]["id"];
  }

  const { data, error } = await supabase.from("TeamPlayers").insert([
    {
      teamId,
      userId: dbUserId,
    },
  ]);

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const removePlayer = async (props: removePlayer) => {
  const { discordUserId, teamId } = props;

  // get user ID from DB
  const { data: getUserIdData, error: getUserIdError } = await getUserId({
    discordUserId: discordUserId,
  });

  if (getUserIdError) throw throwFormattedErrorLog(getUserIdError);

  const { data, error } = await supabase
    .from("TeamPlayers")
    .delete()
    .eq("userId", getUserIdData![0]["id"])
    .eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const getAllTeamPlayers = async (teamId: number) => {
  const { data, error } = await supabase.from("TeamPlayers").select("userId").eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);

  const players = [];

  if (data) {
    for (const { userId } of data) {
      const [{ username, userId: discordId }] = await getUsernameAndDiscordId({ userId });
      players.push({ username, userId: discordId.toString() });
    }
  }

  return players;
};

export const getNumOfTeamPlayers = async (props: getNumOfTeamPlayers) => {
  const { teamId } = props;

  const { data, error } = await supabase.from("TeamPlayers").select("id").eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);

  return data.length;
};
