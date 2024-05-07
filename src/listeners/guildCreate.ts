import { Client, Guild } from "discord.js";
import { checkOrCreateServerDB } from "supabaseDB/methods/server";

import { USER_ROLES } from "constants/userRoles";
import { checkOrCreateUserDB } from "supabaseDB/methods/users";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import logError from "utils/logging/logError";

/**
 * Sets up a listener for when the bot joins a new Discord guild.
 * It fetches audit logs and updates server/user information in a database.
 */
const onNewGuild = (client: Client) => {
  // Set up an event listener for when the bot joins a new server (guild).
  client.on("guildCreate", async (guild: Guild) => {
    try {
      // Ensure the bot has permission to view audit logs, otherwise return early.
      if (!guild!.members.me?.permissions.has("VIEW_AUDIT_LOG")) return;

      const fetchedLog = await guild.fetchAuditLogs({
        type: "BOT_ADD",
        limit: 1, // Fetch only the most recent log entry
      });
      const log = fetchedLog.entries.first();

      const serverId = await checkOrCreateServerDB(guild.id, guild.name);

      if (log) {
        await checkOrCreateUserDB({
          username: log!.executor!.username,
          serverId,
          userId: log!.executor!.id,
          roleId: USER_ROLES.Admin,
        });
      }
    } catch (err) {
      logError(throwFormattedErrorLog(err));
    }
  });
};

export default onNewGuild;
