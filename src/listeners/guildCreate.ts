import { Client, Guild } from "discord.js";

import { checkAddServer } from "supabaseDB/methods/servers";
import { checkAddUser } from "supabaseDB/methods/users";
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

      // Fetch the most recent audit log entry of type 'BOT_ADD' to find out who added the bot.
      const fetchedLog = await guild.fetchAuditLogs({
        type: "BOT_ADD",
        limit: 1, // Fetch only the most recent log entry
      });
      // Get the first (and only) log entry from the fetched logs.
      const log = fetchedLog.entries.first();

      // Add or update the server information in the database.
      await checkAddServer({
        discordServerId: guild.id, // ID of the Discord server (guild)
        name: guild.name, // Name of the Discord server
      });

      // If the fetched log exists, add or update the user information in the database.
      if (log) {
        await checkAddUser({
          username: log!.executor!.username, // Username of the user who added the bot
          discordServerId: guild.id, // ID of the Discord server
          discordUserId: log!.executor!.id, // Discord user ID of the user who added the bot
          roleId: 3, // Predefined role ID, possibly indicating the user's role/privilege in the database
        });
      }
    } catch (err) {
      logError(throwFormattedErrorLog(err));
    }
  });
};

export default onNewGuild;
