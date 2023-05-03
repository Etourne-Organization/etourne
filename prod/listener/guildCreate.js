"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../supabase/supabaseFunctions/users");
const servers_1 = require("../supabase/supabaseFunctions/servers");
exports.default = (client) => {
    client.on('guildCreate', async (guild) => {
        const fetchedLog = await guild.fetchAuditLogs({
            type: 'BOT_ADD',
            limit: 1,
        });
        const log = fetchedLog.entries.first();
        await (0, servers_1.checkAddServer)({
            discordServerId: guild.id,
            name: guild.name,
        });
        await (0, users_1.checkAddUser)({
            username: log.executor.tag,
            discordServerId: guild.id,
            discordUserId: log.executor.id,
        });
    });
};
