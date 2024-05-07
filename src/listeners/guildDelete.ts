import { Client, Guild } from "discord.js";

const onGuildRemove = (client: Client): void => {
  client.on("guildDelete", async (guild: Guild) => {
    // const fetchedLog = await guild.fetchAuditLogs({
    //   // type: 'BOT_ADD',
    //   // limit: 1,
    // });
    // const log = fetchedLog.entries.first();
  });
};
export default onGuildRemove;
