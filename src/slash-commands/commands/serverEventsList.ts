import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';

const serverEventsList: Command = {
	name: 'listserverevents',
	description: 'View the list of all the servers',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/serverEventsList.ts \n Actual error: ${err} \n \n`,
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

export default serverEventsList;
