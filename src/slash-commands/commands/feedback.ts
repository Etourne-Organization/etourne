import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const feedback: Command = {
	name: 'feedback',
	description: 'Send feedback',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			return await interaction.reply({
				embeds: [
					infoMessageEmbed(
						'DM mz10ah#0054 to share feedback or ask questions.',
					),
				],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/feedback.ts \n Actual error: ${err} \n \n`,
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

export default feedback;
