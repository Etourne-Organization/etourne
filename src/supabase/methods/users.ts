import { USER_ROLES } from "constants/userRoles";
import { supabase } from "supabaseDB/index";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";

const createUserDB = async (
  userId: string,
  serverId: number,
  username: string,
  roleId: number = USER_ROLES.Player,
) => {
  const { data, error } = await supabase
    .from("Users")
    .insert({
      userId,
      username,
      serverId,
      roleId,
    })
    .select("id")
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};

export const getUserIdPKDB = async (
  userId: string,
  serverId: number,
  viaUserId: boolean = false,
): Promise<number | null> => {
  const { data, error } = await supabase
    .from("Users")
    .select("id")
    .eq(viaUserId ? "userId" : "id", userId)
    .eq("serverId", serverId)
    .single();

  if (error) {
    // ? No user found
    throwFormattedErrorLog(error);
    return null;
  }

  return data.id;
};

export const checkOrCreateUserDB = async ({
  userId,
  serverId,
  username,
  roleId = USER_ROLES.Player,
}: {
  userId: string;
  serverId: number;
  username: string;
  roleId?: USER_ROLES;
}) => {
  const id = await getUserIdPKDB(userId, serverId, true);

  if (!id) return await createUserDB(userId, serverId, username, roleId);

  return id;
};

export const getUserRoleDB = async (serverId: number, userId: string) => {
  if (!serverId) return null;

  const { data, error } = await supabase
    .from("Users")
    .select("roleId")
    .eq("userId", userId)
    .eq("serverId", serverId)
    .single();

  if (error) {
    throwFormattedErrorLog(error);
    return null;
  }
  return data.roleId;
};

export const setUserRoleDB = async (
  userId: string,
  serverId: number,
  username: string,
  roleId: USER_ROLES,
) => {
  const userIdPK = await checkOrCreateUserDB({ userId, serverId, username, roleId });

  const { error } = await supabase
    .from("Users")
    .update({ roleId })
    .eq("id", userIdPK)
    .eq("serverId", serverId)
    .single();

  if (error) throw throwFormattedErrorLog(error);
};
