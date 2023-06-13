import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	Message,
	MessageEmbed,
} from 'discord.js';

import { Command } from '../CommandStructure';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const requestSupport: Command = {
	name: 'requestsupport',
	description: 'Request for support whenever you are facing issues',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor('#3A9CE2')
				.setTitle(':tools: Support')
				.setDescription(
					'Join the support server: https://discord.gg/vNe9QVrWNa',
				)
				.setTimestamp();

			return await interaction.reply({
				embeds: [embed],
			});
		} catch (err) {
			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/registerServer.ts \n Actual error: ${err} \n \n`,
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

export default requestSupport;
