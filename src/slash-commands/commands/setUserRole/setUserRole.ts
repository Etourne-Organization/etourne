import fs from 'fs';

import { BaseCommandInteraction, Client } from 'discord.js';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { Command } from '../../CommandStructure';

const setUserRole: Command = {
	name: 'setuserrole',
	description: 'Set user role',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/setUserRole/setUserRole.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	},
};

export default setUserRole;
