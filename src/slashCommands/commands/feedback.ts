import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';

const feedback: Command = {
	name: 'feedback',
	description: 'Send feedback',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor('#3A9CE2')
				.setTitle(':thought_balloon: Feedback')
				.setFields([
					{
						name: ':plunger: Report bug',
						value: 'https://etourne.canny.io/bugs',
					},
					{
						name: ':pencil: Share feedback or new ideas',
						value: 'https://etourne.canny.io/feature-requests',
					},
				])
				.setFooter({ text: 'Etourne' })
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

			logFile({
				error: err,
				folder: 'slashCommands/commands',
				file: 'feedback',
			});
		}
	},
};

export default feedback;
