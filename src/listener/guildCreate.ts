import { Guild, Client } from 'discord.js';

import { checkAddUser } from '../supabase/supabaseFunctions/users';

export default (client: Client): void => {
	client.on('guildCreate', async (guild: Guild) => {
		const fetchedLog = await guild.fetchAuditLogs({
			type: 'BOT_ADD',
			limit: 1,
		});
		const log = fetchedLog.entries.first();

		checkAddUser({
			username: log!.executor!.tag,
			discordServerId: guild.id,
			discordUserId: log!.executor!.id,
		});
	});
};
