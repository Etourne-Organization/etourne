import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';

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
				embeds: [
					infoMessageEmbed({
						title: ':x: There has been an error',
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			try {
				logFile({
					error: err,
					folder: 'slashCommands/commands',
					file: 'requestSupport',
				});
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	},
};

export default requestSupport;
