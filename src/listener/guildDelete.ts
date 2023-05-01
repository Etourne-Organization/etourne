import { Guild, Client } from 'discord.js';

import { checkAddUser } from '../supabase/supabaseFunctions/users';
import { checkAddServer } from '../supabase/supabaseFunctions/servers';

export default (client: Client): void => {
	client.on('guildDelete', async (guild: Guild) => {
		const fetchedLog = await guild.fetchAuditLogs({
			// type: 'BOT_ADD',
			// limit: 1,
		});
		const log = fetchedLog.entries.first();

		console.log(log);
	});
};
