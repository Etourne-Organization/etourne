import { MessageEmbed } from "discord.js";
import { getServerIdDB } from "supabaseDB/methods/server";
import { getUserIdPKDB, getUserRoleDB } from "supabaseDB/methods/users";
import {
  createCannotRunCommandEmbed,
  createServerAlreadyRegisteredEmbed,
  createServerNotRegisteredEmbed,
  createUserAlreadyRegisteredEmbed,
} from "./slashCommandHandler/utils/embeds";
import { getTeamDB } from "supabaseDB/methods/players";
import { createMissingTeamEmbed } from "./buttonHandler/utils/embeds";
import { USER_ROLES } from "constants/userRoles";

export type GenericValidationValue<T = string> =
  | {
      isValid: false;
      embed: MessageEmbed;
      value: null;
    }
  | {
      isValid: true;
      embed: MessageEmbed | null;
      value: T;
    };

export async function validateUserPermission(
  serverId: number,
  userId: string,
  /** if set to true, only `ADMINS` can set roles, otherwise, `MANAGERS` can as well */
  adminOnly: boolean = false,
): Promise<GenericValidationValue> {
  const userRoleDB = await getUserRoleDB(serverId, userId);

  const hasAdminRole = userRoleDB === USER_ROLES.Admin;
  const hasManagerRole = userRoleDB === USER_ROLES.Manager;

  const isAllowed = adminOnly ? hasAdminRole : hasAdminRole || hasManagerRole;

  if (!isAllowed) {
    return {
      isValid: false,
      embed: createCannotRunCommandEmbed(),
      value: null,
    };
  }

  // Return true if the user's role is allowed
  return { isValid: true, embed: null, value: "" };
}

export async function validateServerExists(
  guildId: string | null,
): Promise<GenericValidationValue<number>> {
  const hasServer = await getServerIdDB(guildId);

  if (!hasServer)
    return {
      isValid: false,
      embed: createServerNotRegisteredEmbed(),
      value: null,
    };

  return { isValid: true, embed: createServerAlreadyRegisteredEmbed(), value: hasServer };
}

export async function validateUserExists(
  serverId: number,
  userId: string,
): Promise<GenericValidationValue> {
  const hasUser = await getUserIdPKDB(userId, serverId, true);

  if (!hasUser)
    return {
      isValid: false,
      embed: createCannotRunCommandEmbed(),
      value: null,
    };

  return { isValid: true, embed: createUserAlreadyRegisteredEmbed(), value: "" };
}

export async function validateTeamExists(teamId: number): Promise<GenericValidationValue> {
  const hasTeam = await getTeamDB(teamId);

  if (!hasTeam)
    return {
      isValid: false,
      embed: createMissingTeamEmbed(),
      value: null,
    };

  return { isValid: true, embed: null, value: "" };
}
