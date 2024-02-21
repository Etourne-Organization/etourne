import fs from 'fs';

import { Guild, Client } from 'discord.js';

import { checkAddUser } from '../supabase/supabaseFunctions/users';
import { checkAddServer } from '../supabase/supabaseFunctions/servers';

export default (client: Client): void => {
	try {
		client.on('guildCreate', async (guild: Guild) => {
			if (!guild!.members.me?.permissions.has('VIEW_AUDIT_LOG')) return;

			const fetchedLog = await guild.fetchAuditLogs({
				type: 'BOT_ADD',
				limit: 1,
			});
			const log = fetchedLog.entries.first();

			await checkAddServer({
				discordServerId: guild.id,
				name: guild.name,
			});

			await checkAddUser({
				username: log!.executor!.tag,
				discordServerId: guild.id,
				discordUserId: log!.executor!.id,
				roleId: 3,
			});
		});
	} catch (err) {
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in listener/guildCreate.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
