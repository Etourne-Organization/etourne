import { Client, Interaction } from 'discord.js';
import fs from 'fs';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

export default (client: Client, teamModalId: string): void => {
	client.on('interactionCreate', async (i: Interaction) => {
		try {
			if (i.isModalSubmit() && i.customId === teamModalId) {
				i.reply({
					embeds: [infoMessageEmbed('Team created')],
					ephemeral: true,
				});
			}
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/createTeamEvent/createTeamEvent.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	});
};
