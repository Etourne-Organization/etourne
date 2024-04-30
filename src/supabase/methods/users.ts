/* 

* This file contains all the 'users' table related functions
*
*

*/

import { supabase } from "supabaseDB/index";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import { getServerId } from "./servers";

interface addUser {
  discordUserId: string;
  username: string;
  roleId?: number;
  discordServerId: string;
}

interface checkAddUser {
  discordUserId: string;
  username: string;
  roleId?: number;
  discordServerId: string;
}

interface getUserId {
  discordUserId: string;
}

interface getUsername {
  userId: number;
}

interface getMultipleUsernames {
  userIds: [number];
}

interface getUserRole {
  discordUserId: string;
  discordServerId: string;
}

interface setUserRole {
  discordUserId: string;
  discordServerId: string;
  roleId: number;
  username: string;
}

interface isUserSuperAdmin {
  discordUserId: string;
}

interface checkUserExists {
  discordUserId: string;
  discordServerId: string;
}

export const addUser = async (props: addUser) => {
  const { username, discordUserId, discordServerId, roleId = 1 } = props;

  const { data: getServerIdData, error: getServerIdError } = await getServerId({
    discordServerId: discordServerId,
  });

  if (getServerIdError) throw throwFormattedErrorLog(getServerIdError);

  const { data, error } = await supabase
    .from("Users")
    .insert([
      {
        userId: discordUserId,
        username: username,
        serverId: getServerIdData![0]["id"],
        roleId: roleId,
      },
    ])
    .select();

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const checkAddUser = async (props: checkAddUser) => {
  const { username, discordUserId, discordServerId, roleId = 1 } = props;

  // get server column id from supabase
  const { data: getServerIdData, error: getServerIdError } = await getServerId({
    discordServerId: discordServerId,
  });

  if (getServerIdError) throw throwFormattedErrorLog(getServerIdError);

  // check whether user exists in DB
  const { data: checkUserExistsData, error: checkUserExistsError } = await supabase
    .from("Users")
    .select("id")
    .eq("userId", discordUserId)
    .eq("serverId", getServerIdData![0]["id"]);

  if (checkUserExistsError) throw throwFormattedErrorLog(checkUserExistsError);

  if (checkUserExistsData!.length === 0) {
    await addUser({
      username: username,
      discordUserId: discordUserId,
      discordServerId: discordServerId,
      roleId: roleId,
    });
  }
};

export const getUserId = async (props: getUserId) => {
  const { discordUserId } = props;

  const { data, error } = await supabase.from("Users").select("id").eq("userId", discordUserId);

  if (error) throw throwFormattedErrorLog(error);

  return { data, error };
};

export const getUsernameAndDiscordId = async (props: getUsername) => {
  const { userId } = props;

  const { data, error } = await supabase.from("Users").select("username, userId").eq("id", userId);

  if (error) throw throwFormattedErrorLog(error);

  return data;
};

export const getMultipleUsernames = async (props: getMultipleUsernames) => {
  const { userIds } = props;

  const { data, error } = await supabase.from("Users").select("username").in("id", userIds);

  if (error) throw throwFormattedErrorLog(error);

  return data;
};

export const getUserRole = async (props: getUserRole) => {
  const { discordUserId, discordServerId } = props;

  const { data: getServerIdData, error: getServerIdError } = await getServerId({
    discordServerId: discordServerId,
  });

  if (getServerIdError) throw throwFormattedErrorLog(getServerIdError);

  const { data, error } = await supabase
    .from("Users")
    .select("roleId")
    .eq("userId", discordUserId)
    .eq("serverId", getServerIdData![0]["id"]);

  if (error) throw throwFormattedErrorLog(error);

  return data;
};

export const setUserRole = async (props: setUserRole) => {
  const { discordUserId, discordServerId, roleId, username } = props;

  // get server column id from supabase
  const { data: getServerIdData, error: getServerIdError } = await getServerId({
    discordServerId: discordServerId,
  });

  if (getServerIdError) throw throwFormattedErrorLog(getServerIdError);

  await checkAddUser({
    discordServerId: discordServerId,
    discordUserId: discordUserId,
    username: username,
  });

  const { data, error } = await supabase
    .from("Users")
    .update([
      {
        roleId: roleId,
      },
    ])
    .eq("userId", discordUserId)
    .eq("serverId", getServerIdData![0]["id"]);

  if (error) throw throwFormattedErrorLog(error);

  return data;
};

export const isUserSuperAdmin = async (props: isUserSuperAdmin) => {
  const { discordUserId } = props;

  const { data, error } = await supabase
    .from("SuperAdminUsers")
    .select("id")
    .eq("id", discordUserId);

  if (error) throw throwFormattedErrorLog(error);

  if (data!.length > 0) {
    return true;
  } else {
    return false;
  }
};

export const checkUserExists = async (props: checkUserExists) => {
  const { discordUserId, discordServerId } = props;

  // get server column id from supabase
  const { data: getServerIdData, error: getServerIdError } = await getServerId({
    discordServerId: discordServerId,
  });

  if (getServerIdError) throw throwFormattedErrorLog(getServerIdError);

  const { data, error } = await supabase
    .from("Users")
    .select("id")
    .eq("userId", discordUserId)
    .eq("serverId", getServerIdData![0]["id"]);

  if (error) throw throwFormattedErrorLog(error);

  if (data!.length > 0) {
    return true;
  } else {
    return false;
  }
};
