"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (client) => {
    client.on('guildDelete', async (guild) => {
        const fetchedLog = await guild.fetchAuditLogs({});
        const log = fetchedLog.entries.first();
        console.log(log);
    });
};
