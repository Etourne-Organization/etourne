/* 

* This file contains all the 'team players' table related functions
*
*

*/

import { throwFormattedErrorLog } from "src/globalUtils/logErrorFormat";
import { supabase } from "../supabase";
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
      teamId: teamId,
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

export const getAllTeamPlayers = async (props: getAllTeamPlayers) => {
  const { teamId } = props;

  let players: [{ username: string; userId: string }?] = [];

  const { data, error } = await supabase.from("TeamPlayers").select("userId").eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);

  for (const d of data!) {
    const us: [{ username: string }] | any = await getUsernameAndDiscordId({
      userId: d.userId,
    });
    players.push({
      username: us[0]["username"],
      userId: us[0]["userId"].toString(),
    });
  }

  return players;
};

export const getNumOfTeamPlayers = async (props: getNumOfTeamPlayers) => {
  const { teamId } = props;

  const { data, error } = await supabase.from("TeamPlayers").select("id").eq("teamId", teamId);

  if (error) throw throwFormattedErrorLog(error);

  return data.length;
};
